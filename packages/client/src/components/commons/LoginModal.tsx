import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { onLoginClick } from 'src/util/onLoginClick'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bejelentkezés</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="justify">
          <Text>
            Az alkalmazásba való bejelentkezéshez egy MTFSZ fiókra lesz szükséged. Ha már van ilyened, kattints a Bejelentkezés gombra és
            átirányításra kerülsz a bejelentkező oldalra.
          </Text>
          <Text mt={3}>
            Amennyiben nincs még ilyen fiókod, az MTFSZ admin oldalán létre kell hoznod egyet. Ezt csak azok tehetik meg, akik szerepelnek
            az MTFSZ adatbázisában.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={() => window.open('https://admin.mtfsz.hu/user/reg', '_blank')}>
            Regisztráció
          </Button>
          <Button colorScheme="brand" mr={3} onClick={onLoginClick}>
            Bejelentkezés
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
