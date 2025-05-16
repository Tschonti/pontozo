import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { UserRole } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../service/auth.service'
import Category from '../typeorm/entities/Category'
import Criterion from '../typeorm/entities/Criterion'
import Season from '../typeorm/entities/Season'
import UserRoleAssignment from '../typeorm/entities/UserRoleAssignment'
import { getAdminDataSource } from '../typeorm/getConfig'
import { ADMINS } from '../util/env'
import { handleException } from '../util/handleException'
import { getRedisClient } from '../util/redisClient'

const terep = [
  {
    name: 'Versenyszámok profilja szerinti megfelelés (hosszú, közép, rövid)',
    description: 'Mennyire felelt meg a pályád hossza a versenyszám által előírtaknak?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége: Szalagos pályák',
    description:
      'Mennyire volt megfelelő a szalagos pályák technikai nehézsége? Voltak egyszerű és biztonságos lehetőségek a szalag levágásra?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége: E-A-B-Br pályák',
    description: 'Mennyire voltak megfelelőek az adott pályák technikai nehézsége?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége: C pályák',
    description:
      'Mennyire voltak megfelelőek a C pályák technikai nehézsége? Voltak egyszerű és biztonságos lehetőségek az utak elhagyására?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége: időskorú szenior pályák',
    description: 'Mennyire voltak megfelelőek az adott pályák technikai nehézsége?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const terkep = [
  {
    name: 'Szabványosság',
    description: 'Mennyire követte a térkép a hivatalos szabványt?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Pontosság',
    description: 'Mennyire tükrözte a valóságot a térkép?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Nyomtatás, kűlcsín, hordozó',
    description: 'Milyen minőségű volt a térkép nyomtatása és megjelenése?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const vk = [
  {
    name: 'Megközelíthetőség',
    description:
      'Mennyire volt megközelíthető a VK? Milyen volt a bevezetőút minősége, volt-e lehetőség tömegközlekedéssel való megközelítésre?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Parkolás',
    description: 'Milyen volt a parkoló és parkoltatás minősége? Nem volt túl messze a parkoló a VK-tól?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Ivóvíz, mosdás',
    description: 'Volt-e megfelelő ivóvíz szolgáltatás és mosdási lehetőség?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Térerő, internet',
    description: 'Milyen volt a VK internet lefedettsége?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Aréna jelleg',
    description: 'Áttekinthető elrendezés, követhető befutó, látható átfutás, cél-rajt együtt',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Eredményhirdetés',
    description: 'Mennyire volt látványos és gördülékeny az eredményhirdetés? Mennyire voltak igényesek a díjak?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Kísérő szogáltatások',
    description: 'Mátrix/labirintus stb. tájfutó kísérőprogram, óvoda, játszóház',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Kísérő szogáltatások: Büfé, árusok',
    description: 'Milyen volt a büfék, árusok kínálata, ára, felszolgálás minősége?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Kísérő szogáltatások: Időtöltés, múzeum, kilátó, stb',
    description: 'Voltak-e ajánlott kulturális programok?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const rajt = [
  {
    name: 'Víz, WC',
    description: 'Ivóvíz és WC mennyisége és minősége a karanténban',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Várakozási és melegítési lehetőség',
    description: 'Várakozási és melegítési lehetőség minősége a rajtban',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Rajtoltatás áttekinthetősége, egyértelműsége',
    description: 'Mennyire volt áttekinthető, egyértelmű és gördülékeny a rajtoltatás?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Rajt rendszere: Repülőrajt alkalmazása, Kifutók ne látszódjanak',
    description: 'Szigorúan volt-e véve a repülőrajt, lehetett-e látni az előtted rajtolók kifutási irányát?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: false,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const szabalyzat = [
  {
    name: 'Kiírás',
    description: 'Milyen volt a kiírás minősége?',
    text0: 'Nincs',
    text1: 'Rossz',
    text2: 'Hiányos',
    text3: 'Szabályzatnak megfelelő',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Értesítő, rajtlista',
    description: 'Milyen volt a értesítő, rajtlista minősége?',
    text0: 'Nincs',
    text1: 'Rossz',
    text2: 'Hiányos',
    text3: 'Szabályzatnak megfelelő',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Versenynapi szabályeltérések',
    description: 'Voltak-e szabálysértések a versenyen?',
    text0: 'Nem engedélyezett eltérés',
    text2: 'Engedélyezett eltérés',
    text3: 'Nincs eltérés',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["ORGANISER", "JURY"]',
  },
  {
    name: 'Súlyos rendezői hiba',
    description: 'Történt-e súlyos rendezői hiba a verseny során?',
    text0: 'Kategória törlésre került sor',
    text1: 'Volt eredményt befolyásoló rendezői hiba',
    text2: 'Nem volt jogos (elfogadott) óvás, de érkezett óvás; vagy volt eredményt nem befolyásoló, de súlyos rendezői hiba',
    text3: 'Nem volt eredményt befolyásoló súlyos hiba',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    roles: '["ORGANISER", "JURY"]',
  },
]

const kommunikáció = [
  {
    name: 'Információk kellő időben',
    description:
      'A kiírás, értesítő, rajtlista és fontos értesítések mennyire érkeztek időben és a versenyzők mekkora részéhez jutottak el?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Esemény honlap léte, összeszedettsége, naprakészsége',
    description: 'Volt-e honlapja a versenynek, és ha igen, mennyire volt naprakész és könnyen használható?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Mtfsz és saját támogatók megjelenése',
    description: 'Megjelentek-e megfelelő minőségben a támogatók?',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

export const seed = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)

    const [ads, redisClient] = await Promise.all([getAdminDataSource(), getRedisClient(context)])
    const seasonRepo = ads.getRepository(Season)
    const categoryRepo = ads.getRepository(Category)
    const criterionRepo = ads.getRepository(Criterion)
    const userRepo = ads.getRepository(UserRoleAssignment)

    const criteria = (await criterionRepo.find({ select: { id: true } })).map((c) => c.id)
    const categories = (await categoryRepo.find({ select: { id: true } })).map((c) => c.id)
    const seasons = (await seasonRepo.find({ select: { id: true } })).map((s) => s.id)
    const uras = (await userRepo.find({ select: { id: true } })).map((u) => u.id)

    if (criteria.length > 0) {
      await criterionRepo.delete(criteria)
    }
    if (categories.length > 0) {
      await categoryRepo.delete(categories)
    }
    if (seasons.length > 0) {
      await seasonRepo.delete(seasons)
    }
    if (uras.length > 0) {
      await userRepo.delete(uras)
    }

    if (ADMINS.length > 0) {
      const newAdmins = await userRepo.save(
        ADMINS.map((a) => {
          const ura = new UserRoleAssignment()
          ura.userId = a.userId
          ura.userDOB = a.dob
          ura.userFullName = a.name
          ura.role = UserRole.SITE_ADMIN
          return ura
        })
      )
      await Promise.all([...newAdmins.map((a) => redisClient.hSet(`user:${a.userId}`, a.id, a.role))])
    }

    const newTerep = await Promise.all(
      terep.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const terepCat = new Category()
    terepCat.name = 'Terepválasztás, Pályakitűzés'
    terepCat.description = 'Ezen az oldalon az adott futamot a terep és pályák alapján értékelheted.'
    terepCat.criteria = newTerep.map((t, i) => ({
      criterion: t,
      order: i,
      category: terepCat,
      criterionId: t.id,
      categoryId: terepCat.id,
      id: i + 1,
    }))

    const newTerkep = await Promise.all(
      terkep.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const terkepCat = new Category()
    terkepCat.name = 'Terkép minőség'
    terkepCat.description = 'Ezen az oldalon az adott futamot a térkép minősége alapján értékelheted.'
    terkepCat.criteria = newTerkep.map((t, i) => ({
      criterion: t,
      order: i,
      category: terkepCat,
      criterionId: t.id,
      categoryId: terkepCat.id,
      id: i + 100,
    }))

    const newVk = await Promise.all(
      vk.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const vkCat = new Category()
    vkCat.name = 'Versenyközpont, célterület'
    vkCat.description = 'Ezen az oldalon a verseny versenyközpontját értékelheted.'
    vkCat.criteria = newVk.map((t, i) => ({
      criterion: t,
      order: i,
      category: vkCat,
      criterionId: t.id,
      categoryId: vkCat.id,
      id: i + 200,
    }))

    const newRajt = await Promise.all(
      rajt.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const rajtCat = new Category()
    rajtCat.name = 'Rajt'
    rajtCat.description = 'Ezen az oldalon az adott futamot a rajt minősége alapján értékelheted.'
    rajtCat.criteria = newRajt.map((t, i) => ({
      criterion: t,
      order: i,
      category: rajtCat,
      criterionId: t.id,
      categoryId: rajtCat.id,
      id: i + 300,
    }))

    const newSzab = await Promise.all(
      szabalyzat.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const szabCat = new Category()
    szabCat.name = 'Versenyszabályzat és Bajnoki Rendszer megfelelés'
    szabCat.description = 'Ezen az oldalon a versenyt az alapján értékelheted, hogy mennyire felelt meg a szabályzatoknak.'
    szabCat.criteria = newSzab.map((t, i) => ({
      criterion: t,
      order: i,
      category: szabCat,
      criterionId: t.id,
      categoryId: szabCat.id,
      id: i + 400,
    }))

    const newKomm = await Promise.all(
      kommunikáció.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const kommCat = new Category()
    kommCat.name = 'Kommunikáció'
    kommCat.description = 'Ezen az oldalon a versennyel kapcsolatos kommunikációt értékelheted.'
    kommCat.criteria = newKomm.map((t, i) => ({
      criterion: t,
      order: i,
      category: kommCat,
      criterionId: t.id,
      categoryId: kommCat.id,
      id: i + 500,
    }))

    const season = new Season()
    season.name = new Date().getFullYear().toString()
    const sd = new Date()
    sd.setMonth(0, 1)
    sd.setHours(0, 0, 0, 0)
    const ed = new Date()
    ed.setMonth(11, 31)
    ed.setHours(23, 59, 59)
    season.startDate = sd
    season.endDate = ed

    const newCategories = await Promise.all(
      [terepCat, terkepCat, vkCat, rajtCat, szabCat, kommCat].map(async (c, i) => {
        return await categoryRepo.save(c)
      })
    )

    season.categories = newCategories.map((c, i) => ({
      category: c,
      categoryId: c.id,
      order: i,
      id: i + 1,
      season,
      seasonId: season.id,
    }))
    await seasonRepo.save(season)
    context.log(`User #${user.szemely_id} seeded the database`)
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('seed', {
  methods: ['GET'],
  route: 'seed',
  handler: seed,
})
