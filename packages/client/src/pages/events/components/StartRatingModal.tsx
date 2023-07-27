import {
  Button,
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuthContext } from '../../../api/contexts/useAuthContext'
import { useRatingContext } from '../../../api/contexts/useRatingContext'
import { useStartRatingMutation } from '../../../api/hooks/ratingHooks'
import { DbEvent, RatingRole, UserRole } from '@pontozo/common'

export const StartRatingModal = ({ event }: { event: DbEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { loggedInUser } = useAuthContext()
  const [role, setRole] = useState<RatingRole | undefined>()
  const startRating = useStartRatingMutation()
  const { startRating: startRatingWithContext } = useRatingContext()

  const onSubmit = () => {
    if (role) {
      startRating.mutate(
        { eventId: event.id, role },
        {
          onSuccess: (res) => startRatingWithContext(res[0].id),
        }
      )
    }
  }

  return (
    <>
      {
        <Button colorScheme="brand" onClick={onOpen}>
          Értékelés
        </Button>
      }

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{event.name} értékelése</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Tudnivalók az értékelésről</Text>
            <Text textAlign="justify">
              Lórum ipse fűző szecskát tózik: a gubátos csillagos fagyans, iget bráni ez. Edre pedig azért egyetnek pátorban, hogy a letleni
              murgácsban kedő parás a becse spána és fenyére érdekében cinthetsen. Ponokba nőzködnek annak a meddő ható óvadélynak az
              elmelései, aki éppen a vazásról áttelepülve zuharozódta meg vétlen szapjas és virágyatos avánai fekényét. Bargadka szutya
              pálgálta tekevezékeire nemcsak nyögésről ebeckedt mong, hanem a taló taságoktól is. Csolás empőzs packávonálai újra meg újra
              ségetsék a fogást arra, hogy a haság és az olások elmenek amustól. A fetles ezer empőzs kasolta, hogy a szegséges ülöntés
              dikás karázsálnia az ehető haságot.
            </Text>
            <FormLabel mt={5}>Szerepköröd:</FormLabel>
            <Select placeholder="Válassz szerepkört!" value={role} onChange={(e) => setRole(e.target.value as RatingRole)}>
              <option value={RatingRole.COMPETITOR}>Versenyző</option>
              {loggedInUser?.roles.includes(UserRole.COACH) && <option value={RatingRole.COACH}>Edző</option>}
              <option value={RatingRole.ORGANISER}>Rendező</option>
              {loggedInUser?.roles.includes(UserRole.JURY) && <option value={RatingRole.JURY}>MTFSZ Zsűri</option>}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Flex w="100%" justify="space-between">
              <Button onClick={onClose}>Mégse</Button>
              <Button isDisabled={!role} isLoading={startRating.isLoading} colorScheme="brand" onClick={onSubmit}>
                Tovább
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
