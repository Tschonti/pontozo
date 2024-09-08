import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { EventWithRating, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { PATHS } from '../../../util/paths'

type Props = {
  eventWithRating: EventWithRating
  onStartClick: () => void
  isLoading: boolean
  startDisabled: boolean
  continueDisabled: boolean
}

export const GoToRatingButton = ({ eventWithRating, onStartClick, startDisabled, isLoading, continueDisabled }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  if (eventWithRating.userRating) {
    let url = `${PATHS.RATINGS}/${eventWithRating.userRating.id}?categoryIdx=`
    if (eventWithRating.userRating.status === RatingStatus.STARTED) {
      url += `${eventWithRating.userRating.currentCategoryIdx}`
      if (eventWithRating.userRating.currentStageIdx > -1) {
        url += `&stageIdx=${eventWithRating.userRating.currentStageIdx}`
      }
    } else {
      url += '0'
    }
    return (
      <Button
        as={Link}
        to={eventWithRating.userRating.status !== RatingStatus.SUBMITTED && continueDisabled ? undefined : url}
        colorScheme="brand"
        isDisabled={eventWithRating.userRating.status !== RatingStatus.SUBMITTED && continueDisabled}
      >
        {eventWithRating.userRating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelés folytatása'}
      </Button>
    )
  }

  return (
    <>
      <Button colorScheme="brand" isLoading={isLoading} onClick={onOpen} isDisabled={startDisabled}>
        Értékelés kezdése
      </Button>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tudnivalók az értékelésről</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="justify">
            <VStack gap={2}>
              <Text>
                Az értékelés során először a teljes versenyt lesz lehetőséged értékelni olyan szempontok alapján, melyek az egész versenyre
                vonatkoznak. Ezután az egyes futamokat fogod értékelni futamspecifikus szempontok (például térkép, pályák minősége) alapján.
                A felső sávban mindig látod, hogy jelenleg a teljes versenyt, vagy az egyik futamot értékeled.
              </Text>
              <Text>
                Egyes szempontok leírásában több, összetett kérdést is megfogalmaztunk, hogy segítsünk átgondolni, mik befolyásolhatják a
                döntésed. Előfordulhat, hogy ha ezeket külön tennék fel, eltérő válaszokat adnál rájuk. Arra kérünk, hogy az adott szempont
                értékelését az alapján válaszd ki, hogy Neked mi a legfontosabb az adott kérdésben, és azon a területen milyen élménnyel
                távoztál a versenyről.
              </Text>
              <Text>
                Az értékelést bármikor megszakíthatod, a válaszaid folyamatosan mentésre kerülnek, így amikor következőre visszatérsz erre
                az oldalra, onnan folytathatod, ahol abbahagytad. Az értékelésed csak akkor fog beszámítani az eredményekbe, ha minden
                kategóriát kitöltesz, majd a végén véglegesíted azt. Minden versenyt a lezárultát követő hét napban lehet értékelni, ezután
                már nem fogod tudni változtatni vagy véglegesíteni az értékelésed.
              </Text>
              <Text>Az értékelés anonim, az eredmények csak összesítve lesznek publikálva.</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="gray" onClick={onClose}>
              Mégse
            </Button>
            <Button colorScheme="brand" onClick={onStartClick}>
              Értékelés kezdése
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
