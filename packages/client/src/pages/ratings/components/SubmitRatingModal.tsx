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
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { getRatingResultPublishedDate } from 'src/util/dateHelpers'

type Props = {
  variant?: string
  color?: string
  colorScheme?: string
}

export const SubmitRatingModal = ({ variant, color, colorScheme }: Props) => {
  const { submitRating, openSubmitModal, eventRatingInfo } = useRatingContext()
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
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Értékelés véglegesítése</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="justify">
            <VStack gap={2} alignItems="flex-start" mb={5}>
              <Text>
                Köszönjük, hogy értékelted a versenyt! Az értékélest a <b>Küldés</b> gombbal tudod véglegesíteni, ezután már nem fogod tudni
                szerkeszteni. Ha szeretnél még szöveges formában (névtelen) visszajelzést küldeni a szervezőknek, azt megteheted az alábbi
                szövegdobozban.
              </Text>
              <Text>
                Az értékelés eredményei a verseny lezárta után nyolc nappal kerülnek publikálásra, tehát nézz vissza ekkor:{' '}
                <b>{getRatingResultPublishedDate(new Date(eventRatingInfo?.endDate ?? eventRatingInfo?.startDate ?? ''))}</b>
              </Text>
            </VStack>
            <FormControl>
              <FormLabel>Szöveges visszajelzés (opcionális)</FormLabel>
              <Textarea rows={8} value={value} onChange={(e) => setValue(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="gray" onClick={onClose}>
              Mégse
            </Button>
            <Button colorScheme="brand" onClick={() => submitRating(value)}>
              Küldés
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
