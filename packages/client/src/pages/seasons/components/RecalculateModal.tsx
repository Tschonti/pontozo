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
  useToast,
} from '@chakra-ui/react'
import { FaRedoAlt } from 'react-icons/fa'
import { useRecalculateSeasonMutation } from 'src/api/hooks/seasonHooks'

export const RecalculateModal = ({ seasonId }: { seasonId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate } = useRecalculateSeasonMutation(seasonId)
  const toast = useToast()

  const onSubmit = () => {
    mutate(undefined, {
      onSuccess: () => {
        onClose()
        toast({
          title: 'Az újraszámítás megkezdődött!',
          description: 'Kérlek légy türelemmel, hamarosan már a frissített eredmények fogod látni a versenyek publikus oldalán!',
          status: 'success',
        })
      },
    })
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="red" leftIcon={<FaRedoAlt />}>
        Pontok újraszámítása
      </Button>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pontok újraszámítása</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} textAlign="justify">
              <b>
                A piros gomb megnyomásával elindítod ezen szezon lezajlott versenyeinek értékelési eredményeinek újraszámítását a jelenlegi
                súlyértékekkel. Ez egy hosszabb és erőforrásigényesebb művelet is lehet{' '}
              </b>
              (a lezajlott versenyek számától függően), ezért lehetőleg ne használd túl gyakran. A folyamat elindítását követő pár percben
              lehet, hogy lassabban fog működni az oldal. Amennyiben a teljesítmény hosszabb idő után sem javul, vagy furcsa anomáliák
              történnek, kérlek jelezd a fejlesztőnek. Az admin felület Tudnivalók oldal alján láthatsz frissítéseket a folyamat
              haladásáról.
              <b>
                {' '}
                Azt is tarstd fejben, hogy az újraszámolástól a már publikált eredmények megváltozhatnak, tehát szezon közben jobb lenne ezt
                elkerülni.
              </b>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Mégse
            </Button>
            <Button onClick={onSubmit} colorScheme="red">
              Újraszámítás
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
