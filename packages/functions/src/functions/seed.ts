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

const terep = [
  {
    name: 'Versenyszámok profilja szerinti megfelelés (hosszú, közép, rövid)',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége 10D pályák',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége E-A-B-Br pályák',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége C pályák',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Technikai fokozatok megfelelősége időskorú szenior pályák',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const terkep = [
  {
    name: 'Szabványosság',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Pontosság',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Nyomtatás, kűlcsín, hordozó',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const vk = [
  {
    name: 'Megközelíthetőség',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Parkolás',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Ivóvíz, mosdás',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Infrastruktúra - Térerő, internet',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Aréna jelleg',
    description: 'Áttekinthető elrendezés, Követhető befutó, Látható átfutás, Cél-Rajt együtt',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
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
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Kísérő szogáltatások (Büfé, árusok)',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Kísérő szogáltatások (Időtöltés, múzeum, kilátó, stb)',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: true,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const rajt = [
  {
    name: 'Víz, WC',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Várakozási és melegítési lehetőség ',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Rajtoltatás áttekinthetősége, egyértelműsége',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Rajt rendszere: Repülőrajt alkalmazása, Kifutók ne látszódjanak',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: true,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

const szabalyzat = [
  {
    name: 'Kiírás',
    description: 'test',
    text0: 'Nincs',
    text1: 'Rossz',
    text2: 'Hiányos',
    text3: 'Szabályzatnak megfelelő',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["ORGANISER", "JURY"]',
  },
  {
    name: 'Értesítő, rajtlista',
    description: 'test',
    text0: 'Nincs',
    text1: 'Rossz',
    text2: 'Hiányos',
    text3: 'Szabályzatnak megfelelő',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["ORGANISER", "JURY"]',
  },
  {
    name: 'Versenynapi szabályeltérések',
    description: 'test',
    text0: 'Nem engedélyezett eltérés',
    text2: 'Engedélyezett eltérés',
    text3: 'Nincs eltérés',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["ORGANISER", "JURY"]',
  },
  {
    name: 'Súlyos rendezői hiba',
    description: 'test',
    text0: ' Kategória törlésre került sor',
    text1: 'Volt eredményt befolyásoló rendezői hiba',
    text2: 'Nem volt jogos (elfogadott) óvás, de érkezett óvás; vagy volt eredményt nem befolyásoló, de súlyos rendezői hiba',
    text3: 'Nem volt eredményt befolyásoló súlyos hiba',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["ORGANISER", "JURY"]',
  },
]

const kommunikáció = [
  {
    name: 'Információk kellő időben',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: false,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Esemény honlap léte, összeszedettsége, naprakészsége',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
  {
    name: 'Mtfsz és saját támogatók megjelenése',
    description: 'test',
    text0: 'Rossz',
    text1: 'Gyenge',
    text2: 'Megfelelő',
    text3: 'Kiváló',
    nationalOnly: true,
    stageSpecific: false,
    allowEmpty: false,
    competitorWeight: 1,
    organiserWeight: 1,
    roles: '["COMPETITOR", "COACH","ORGANISER", "JURY"]',
  },
]

export const seed = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    await getUserFromHeaderAndAssertAdmin(req)

    const ads = await getAdminDataSource()
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
      await userRepo.save(
        ADMINS.map((a) => {
          const ura = new UserRoleAssignment()
          ura.userId = a.userId
          ura.userDOB = a.dob
          ura.userFullName = a.name
          ura.role = UserRole.SITE_ADMIN
          return ura
        })
      )
    }

    const newTerep = await Promise.all(
      terep.map(async (t) => {
        return await criterionRepo.save(t)
      })
    )
    const terepCat = new Category()
    terepCat.name = 'Terepválasztás, Pályakitűzés'
    terepCat.description = 'test'
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
    terkepCat.description = 'test'
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
    vkCat.description = 'test'
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
    rajtCat.description = 'test'
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
    szabCat.description = 'test'
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
    kommCat.description = 'test'
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

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('seed', {
  methods: ['GET'],
  route: 'seed',
  handler: seed,
})
