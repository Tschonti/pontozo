import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import { ColorfulExternalLink } from 'src/components/commons/ColorfulExternalLink'

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
    title: 'Valóban anonim az értékelésem?',
    paragraphs: [
      `A rendszer felhasználókhoz kapcsol minden értékelést, ez elengedhetetlen ahhoz, hogy később szerkeszd vagy megtekintsd a saját értékelésed.
      Az értékelések publikus eredményei azonban csak az összesített értékeléseket tartalmazzák, azok soha nem vezethetőek vissza egy adott személyre.
      Az adatbázisban tárolt, felhasználókhoz köthető értékelési adatokat harmadik féllel (például versenyrendezői csapattal) soha nem osztjuk meg.
      Ez igaz a szempontokra leadott és a szöveges értékelésekre is. Fenntartjuk a jogát, hogy amennyiben egy szöveges értékelést nem tartunk konstruktívank, töröljük azt.`,
    ],
  },
]

export const FAQPage = () => {
  return (
    <VStack gap={4} alignItems="flex-start">
      <Helmet title="Pontoz-O | GYIK" />
      <Heading>Gyakran Ismételt Kérdések</Heading>
      <Accordion w="100%" bg="white" defaultIndex={[...faqItems.map((_, i) => i), faqItems.length]} allowMultiple>
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
              <Heading fontSize={50} transform="auto" skewX={-10} style={{ fontVariant: 'small-caps' }}>
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
      </Accordion>
    </VStack>
  )
}
