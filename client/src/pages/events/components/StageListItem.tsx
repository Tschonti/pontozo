import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import { EventSection } from '../../../api/model/event'

export const StageListItem = ({ stage }: { stage: EventSection }) => {
  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">{stage.nev_1}</Heading>
      </CardHeader>

      <CardBody>
        <Text>{new Date(parseInt(stage.idopont_tol) * 1000).toLocaleString('hu-HU')}</Text>
        <Text>Rangsor típus: {stage.futam.rangsorolo}</Text>
      </CardBody>
    </Card>
  )
}
