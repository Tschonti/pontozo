import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useRatingContext } from 'src/api/contexts/useRatingContext'

type Props = {
  variant?: string
  color?: string
  colorScheme?: string
}

export const SubmitRatingModal = ({ variant, color, colorScheme }: Props) => {
  const { submitRating, openSubmitModal } = useRatingContext()
  const [value, setValue] = useState('')
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <>
      <Button
        color={color}
        colorScheme={colorScheme}
        rightIcon={<FaChevronRight />}
        variant={variant}
        onClick={() => openSubmitModal(onOpen)}
      >
        Véglegesítés
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Értékelés véglegesítése</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="justify">
            <Text mb={5}>
              Köszönjük, hogy értékelted a versenyt! Az értékélest a 'Küldés' gombbal tudod véglegesíteni, ezután már nem fogod tudni
              szerkeszteni. Ha szeretnél még szöveges formában visszajelzést küldeni a szervezőknek, azt megteheted az alábbi
              szövegdobozban.
            </Text>
            <FormControl>
              <FormLabel>Szöveges visszajelzés (opcionális)</FormLabel>
              <Textarea rows={8} value={value} onChange={(e) => setValue(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="gray" onClick={onClose}>
              Mégse
            </Button>
            <Button colorScheme="brand" mr={3} onClick={() => submitRating(value)}>
              Küldés
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
