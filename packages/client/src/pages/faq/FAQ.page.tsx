import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Helmet } from 'react-helmet'
import { FaEnvelope, FaExclamationTriangle, FaGithub, FaLinkedin } from 'react-icons/fa'
import { useAuthContext } from 'src/api/contexts/useAuthContext'
import { usePurgeUserMutation } from 'src/api/hooks/authHooks'
import { ColorfulExternalLink } from 'src/components/commons/ColorfulExternalLink'
import { PATHS } from 'src/util/paths'

const faqItems: { title: string; paragraphs: string[] }[] = [
  {
    title: 'Hogyan tevődik össze egy verseny összpontszáma?',
    paragraphs: [
      `Először is átlagoljuk az egyes szempontokra érkezett értékeléseket értékelési csoportonként.
    Két csoport van, az elsőbe a versenyzők és az edzők, a másikba pedig a rendezők és az MTFSZ zsűrik tartoznak.
    Azért kezeljük külön a második csoportot, mert a számosságuk fix és alacsony, de jobban ráláttak a versenyre.
    Az így keletkezett átlagok súlyozott átlaga lesz a verseny végső pontszáma.
    Minden szempontnak külön súlyértéke van a két értékelési csoporthoz, attól függően, hogy az adott szempont mennyire befolyásolja a verseny egészét.
    A kategóriák pontszáma hasonlóan számítható, itt a kategóriába tartozó szempontok súlyozott átlagát vesszük.`,
    ],
  },
  {
    title: 'Egy futamspecifikus szempont összpontszáma nem a futamonkénti értékek átlaga?',
    paragraphs: [
      `Általában nem. A futamspecifikus szempontok összpontszámánál az összes, az adott szempontra érkező értékelést egybe számoljuk, futamtól függetlenül.
    A futamokra általában különböző mennyiségű értékelés érkezik, így előfordulhat, hogy az összpontszám nem a futamok értékeinek átlaga.`,
    ],
  },
  {
    title: 'Letelt a nyolc nap, már nem értékelhető a verseny, de mégse látom az értékelés eredményeit. Hogy lehet ez?',
    paragraphs: [
      `Az eredmények számolásához szükség van arra, hogy a verseny eredményei és jegyzőkönyve feltöltésre kerüljön az MTFSZ Adatbankba,
    hiszen ez alapján ellenőrizzük, hogy például a versenyzőként értékelők tényleg elindultak a versenyen.
    Amennyiben ezek nem lettek feltöltve az értékelés zárultakor, az eredmények számítása eltolódhat.
    Várhatóan a feltöltés utáni nap lesznek elérhetőek az értékelés eredményei, mely a verseny rendezőjétől függ.`,
      `Továbbá csak azon versenyekhez számítódik értékelési eredmény, amit legalább egy felhasználó értékelt.
    Amennyiben senki sem értékelte a versenyt, nem fog megjelenni a listában.`,
    ],
  },
  {
    title: 'Meg mernék esküdni, hogy az egyik verseny pontszáma korábban még más volt. Hogy lehetséges ez?',
    paragraphs: [
      `Habár próbáljuk elkerülni, időnként (főleg a kezdeti időszakban) előfordulhat, hogy szezon közben változtatunk a szempontok súlyain,
      majd újraszámoljuk a versenyek eredményeit. Egy verseny eredmény oldalán mindig látod, hogy mikor lett kiszámolva a jelenlegi ponszám.
      Azt azonban garantáljuk, hogy azonos szezonban lévő versenyek mindigy ugyanazon szempontok és súlyok alapján lettek kiértékelve.`,
    ],
  },
  {
    title: 'Valóban anonim az értékelésem?',
    paragraphs: [
      `A rendszer felhasználókhoz kapcsol minden értékelést, ez elengedhetetlen ahhoz, hogy később szerkeszd vagy megtekintsd a saját értékelésed.
      Az értékelések publikus eredményei azonban csak az összesített értékeléseket tartalmazzák, azok soha nem vezethetőek vissza egy adott személyre.
      Az adatbázisban tárolt, felhasználókhoz köthető értékelési adatokat harmadik féllel (például versenyrendezői csapattal) soha nem osztjuk meg.
      Ez igaz a szempontokra leadott és a szöveges értékelésekre is. Fenntartjuk a jogát, hogy amennyiben egy szöveges értékelést nem tartunk konstruktívnak, töröljük azt.`,
    ],
  },
]

export const FAQPage = () => {
  const { isLoggedIn, onLogout } = useAuthContext()
  const { isLoading, mutateAsync } = usePurgeUserMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const toast = useToast()

  const onPurge = async () => {
    try {
      await mutateAsync()
      toast({ title: 'Az adataidat sikeresen töröltük.', status: 'success' })
      onClose()
      onLogout(PATHS.FAQ)
    } catch (e) {
      console.error(e)
      toast({ title: 'A fiókod törlése nem sikerült', status: 'error' })
    }
  }
  return (
    <VStack gap={4} alignItems="flex-start">
      <Helmet title="Pontoz-O | GYIK" />
      <Heading>Gyakran Ismételt Kérdések</Heading>
      <Accordion
        w="100%"
        bg="white"
        defaultIndex={[...faqItems.map((_, i) => i), faqItems.length, faqItems.length + 1, faqItems.length + 2]}
        allowMultiple
      >
        {faqItems.map((q) => (
          <AccordionItem key={q.title}>
            <h2>
              <AccordionButton>
                <Box fontWeight="bold" as="span" flex="1" textAlign="left">
                  {q.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack alignItems="flex-start">
                {q.paragraphs.map((p) => (
                  <Text key={p.split(' ')[0]} textAlign="justify">
                    {p}
                  </Text>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
        <AccordionItem>
          <h2 id="impressum">
            <AccordionButton>
              <Box fontWeight="bold" as="span" flex="1" textAlign="left">
                Ki fejlesztette az oldalt?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} justifyItems="center">
            <VStack justifyItems="center">
              <Image width={250} height={250} src="/img/samu.jpg" rounded="100%" />
              <Heading textAlign="center" fontSize={50} transform="auto" skewX={-10} style={{ fontVariant: 'small-caps' }}>
                Fekete Sámuel
              </Heading>
              <HStack>
                <ColorfulExternalLink url="https://github.com/Tschonti/" hoverColor="brand.500">
                  <FaGithub size={25} />
                </ColorfulExternalLink>
                <ColorfulExternalLink url="mailto:feketesamu@gmail.com" hoverColor="brand.500">
                  <FaEnvelope size={25} />
                </ColorfulExternalLink>
                <ColorfulExternalLink url="https://www.linkedin.com/in/samuel-fekete/" hoverColor="brand.500">
                  <FaLinkedin size={25} />
                </ColorfulExternalLink>
                <a
                  style={{
                    display: 'flex',
                    backgroundColor: '#FC5200',
                    color: '#fff',
                    padding: '6px 10px 6px 30px',
                    fontSize: '11px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '10px center',
                    borderRadius: '3px',
                    backgroundImage: "url('https://badges.strava.com/logo-strava-echelon.png')",
                  }}
                  href="https://strava.com/athletes/445408"
                  target="_clean"
                >
                  <Text pt={0.4}>Follow me on</Text>
                  <img
                    src="https://badges.strava.com/logo-strava.png"
                    alt="Strava"
                    style={{ marginLeft: '2px', verticalAlign: 'text-bottom' }}
                    height="13px"
                    width="51px"
                  />
                </a>
              </HStack>

              <Text textAlign="justify">
                Az alkalmazást az MTFSZ felkérése fejlesztettem a szabadidőmben. Tájfutáshoz kapcsolódó szakmai kérdésekben (pl. szempontok,
                súlyok meghatározása) az MTFSZ Informatikai- és Versenybizottságának szava volt a döntő. Hibajelentésekkel, fejlesztési
                ötletekkel bátran keressetek emailben. A projekt volt a fő témája a BME mérnökinformatikus alapképzésre beadott
                szakdolgozatomnak, melyet{' '}
                <Link color="brand.500" isExternal href="/szakdolgozat.pdf">
                  innen letölthettek
                </Link>
                . Az alkalmazást ez után is fejlesztettem, optimalizáltam.
              </Text>
              <Text textAlign="justify">
                Az alkalmazás teljes mértékben nyílt forráskódú. A backend REST API-ja Azure serverless Function-ökből áll, a felhasználói
                felület Reactben készült. Amennyiben érdekel a projekt és esetleg szívesen segítenél, keress emailen!
              </Text>
              <Button
                onClick={() => window.open('https://github.com/Tschonti/pontozo', '_blank', 'noopener,noreferrer')}
                colorScheme="brand"
                leftIcon={<FaGithub />}
                aria-label="GitHub repository"
              >
                GitHub repository
              </Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2 id="privacy-notice">
            <AccordionButton>
              <Box fontWeight="bold" as="span" flex="1" textAlign="left">
                Hogyan kezeli az alkalmazás az adataimat?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} justifyItems="center">
            <VStack alignItems="flex-start">
              <Text textAlign="justify">
                A rendszer elsődleges adatforrása az MTFSZ adatbázisa. Bejelentkezéskor innen kérjük le a felhasználó adatait, azonban azok
                közül kizárólag az e-mail címet, az MTFSZ személy azonosítót és a születési dátumot tároljuk. Az e-mail címet kizárólag
                rendszerértesítések küldése érdekében tároljuk. Amennyiben semmiképpen nem szeretnél e-mailben értesítést kapni, a
                profilodon található Értesítési beállítások menüben törölheted az e-mail címed.
              </Text>

              <Text textAlign="justify">
                Az adatokat a Microsoft Azure Poland Central nevű régiójában (adatközpontjában) tároljuk, harmadik félnek soha nem adjuk ki.
                Amennyiben szeretnéd az összes, hozzád kapcsolható adatot törölni a rendszerből, nyomd meg az alábbi gombot. Ezzel az e-mail
                címed és az általad leadott értékelések törlésre kerülnek, valamint ki leszel jelentkeztetve. Ha újra bejelentkezel, ismét
                használhatod az alkalmazást, azonban a korábban törölt értékeléseid nem visszaállíthatóak. Az általad értékelt versenyek
                értékelési eredményeit nem befolyásolja az értékeléseid törlése, hiszen azok az értékelés lezárultakor számolódnak ki és nem
                tartalmaznak személyre visszavezethető adatot. Ha viszont a későbbiekben egy verseny pontszáma valamilyen okból
                újraszámolódik, akkor már a te értékelésed nélkül fog ez megtörténni.
              </Text>
              <Button
                alignSelf="center"
                onClick={onOpen}
                isDisabled={!isLoggedIn}
                color="white"
                bg="black"
                _hover={{ bg: 'gray.700' }}
                leftIcon={<FaExclamationTriangle />}
                aria-label="Fiókom és adataim törlése"
              >
                Fiókom és adataim törlése
              </Button>
              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Fiókom és adataim törlése
                    </AlertDialogHeader>

                    <AlertDialogBody textAlign="justify">
                      Biztos vagy benne? Ezzel az e-mail címed és az általad leadott értékelések törlésre kerülnek, valamint ki leszel
                      jelentkeztetve. Ha újra bejelentkezel, ismét használhatod az alkalmazást, azonban a korábban törölt értékeléseid nem
                      visszaállíthatóak. Az általad értékelt versenyek értékelési eredményeit nem befolyásolja az értékeléseid törlése,
                      hiszen azok az értékelés lezárultakor számolódnak ki és nem tartalmaznak személyre visszavezethető adatot. Ha viszont
                      a későbbiekben egy verseny pontszáma valamilyen okból újraszámolódik, akkor már a te értékelésed nélkül fog ez
                      megtörténni.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Mégse
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={onPurge}
                        ml={3}
                        color="white"
                        bg="black"
                        isLoading={isLoading}
                        _hover={{ bg: 'gray.700' }}
                        leftIcon={<FaExclamationTriangle />}
                      >
                        Törlés
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2 id="cookie-notice">
            <AccordionButton>
              <Box fontWeight="bold" as="span" flex="1" textAlign="left">
                Használ sütiket az alkalmazás?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} justifyItems="center">
            <VStack alignItems="flex-start">
              <Text textAlign="justify">
                Az alkalmazás elsősorban a működéshez elegendhetetlen sütiket használ. Sütiben tároljuk a téged azonosító tokent, mely
                kijelentkezéskor vagy 7 nap után törlődik a böngésződből.
              </Text>

              <Text textAlign="justify">
                Ezen kívül az oldal forgalmát a Microsoft Azure Application Insights rendszere méri, mely szintén használ sütiket a
                felhasználók azonosításához. Időnként az IP-cím is küldésre kerül, azonban ezt soha nem tárolja, csak az egyes kérésekhez ez
                alapján tud geolokációs információt (ország, régió, város) rendelni.
              </Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  )
}
