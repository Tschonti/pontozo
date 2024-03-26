import { Alert, AlertDescription, AlertIcon, AlertTitle, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useFetchAlerts } from 'src/api/hooks/alertHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { alertLevelToChakraStatus } from 'src/util/enumHelpers'
import { PATHS } from 'src/util/paths'

export const AdminIndex = () => {
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
      <Text>
        Lórum ipse fűző szecskát tózik: a gubátos csillagos fagyans, iget bráni ez. Edre pedig azért egyetnek pátorban, hogy a letleni
        murgácsban kedő parás a becse spána és fenyére érdekében cinthetsen. Ponokba nőzködnek annak a meddő ható óvadélynak az elmelései,
        aki éppen a vazásról áttelepülve zuharozódta meg vétlen szapjas és virágyatos avánai fekényét. Bargadka szutya pálgálta
        tekevezékeire nemcsak nyögésről ebeckedt mong, hanem a taló taságoktól is. Csolás empőzs packávonálai újra meg újra ségetsék a
        fogást arra, hogy a haság és az olások elmenek amustól. A fetles ezer empőzs kasolta, hogy a szegséges ülöntés dikás karázsálnia az
        ehető haságot.
      </Text>
      <Heading fontSize={30} mt={5}>
        Figyelmeztetések
      </Heading>
      <VStack mt={5}>
        {data.length > 0 ? (
          data.map((a) => (
            <Alert variant="left-accent" status={alertLevelToChakraStatus[a.level]} justifyContent="space-between">
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
