import { Alert, AlertDescription, AlertIcon, AlertTitle, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useFetchAlerts } from 'src/api/hooks/alertHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { alertLevelToChakraStatus } from 'src/util/enumHelpers'
import { PATHS } from 'src/util/paths'

export default function () {
  const { data, isLoading, error } = useFetchAlerts()
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <>
      <HelmetTitle title="Pontoz-O Admin" />
      <Heading>Admin oldal tudnivalók</Heading>
      <VStack gap={2}>
        <Text textAlign="justify">
          Üdv a Pontoz-O admin felületén! Itt lehet testreszabni, hogy milyen szempontok és kategóriák által értékelhetőek az egyes
          versenyek az alkalmazásban.
        </Text>
        <Text textAlign="justify">
          Ahhoz, hogy a versenyek egymással összehasonlíthatóak legyenek, elengedhetetlen, hogy ugyanazon szempontok alapján legyenek
          értékelve. Azonban az is fontos, hogy időnként ezeken lehessen változtatni. Ezért a versenyeket az alkalmazás <b>szezon</b>okba
          sorolja. Egy szezonon belül minden verseny pontosan ugyanazon szempontok alapján lesz értékelve. Egyszerre csak egy szezon lehet
          aktív. Ha egy szezon már elkezdődött, sem a szezon, sem annak kategóriái és szempontjai nem szerkeszthető.
        </Text>
        <Text textAlign="justify">
          Az értékelés során nem az összes szempontot egy oldalon fogja látni a felhasználó, hanem külön oldalanként. Erre a csoportosításra
          alkalmasak a <b>kategóriák</b>, hiszen egy kategóriában szereplő szempontok már egy oldalon fognak megjelenni. Érdemes tehát a
          hasonló témájú szempontokat azonos kategóriába tenni.
        </Text>
        <Text textAlign="justify">
          Az alkalmazásban a legkisebb értékelési egység a <b>szempont</b>, ez az, amire a felhasználónak valamilyen választ kell adnia. Az
          értékelés során minden szemponthoz kötelező valamit válaszolni, azonban ha a "Nem tudom" válasz engedett és azt választja, az ő
          döntése nem fogja befolyásolni az eredményt. A válaszlehetőségek értéke 0, 1, 2 és 3 lehet. Testreszabható, hogy milyen szöveggel
          jelenjenek meg az értékek. Amennyiben valamelyik értékhez nem tartozik jelentés, azt az értéket nem fogja tudni választani az
          értékelő. Minden szempontnál testreszabható az is, hogy milyen szerepkörbe tartozó felhasználók számára lesz elérhető. Amennyiben
          a futam specifikus beállítás be van kapcsolva, a verseny minden futamához értékelni kell a szempontot, egyébként csak egyszer, a
          teljes versenyre vonatkozóan.
        </Text>
        <Text textAlign="justify">
          Edzői vagy MTFSZ zsűri szerepkört a <b>Felhasználók</b> menüpontban lehet adni. Ezek a felhasználók később képesek lesznek az
          adott szerepkörben leadni egy értékelést, így olyan versenyeket is értékelhetnek, amiken nem vettek részt. Az Admin szerepkör ad
          hozzáférést ezen admin felülethez, ilyet csak valódi szükség esetén adjunk ki.
        </Text>
      </VStack>
      <Heading fontSize={30} mt={5}>
        Figyelmeztetések
      </Heading>
      <Text my={2}>A rendszer legfrissebb naplóbejegyzései</Text>
      <VStack>
        {data.length > 0 ? (
          data.map((a) => (
            <Alert key={a.id} variant="left-accent" status={alertLevelToChakraStatus[a.level]} justifyContent="space-between">
              <HStack gap={1}>
                <AlertIcon />
                <AlertTitle>{a.description}</AlertTitle>
              </HStack>
              <AlertDescription>
                {new Date(a.timestamp).toLocaleDateString('hu')} {new Date(a.timestamp).toLocaleTimeString('hu')}
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <Text fontStyle="italic" textAlign="center">
            Nincs egy figyelmeztetés se az elmúlt 14 napból!
          </Text>
        )}
      </VStack>
    </>
  )
}
