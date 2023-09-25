import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'

interface ConfirmDialogButtonProps {
  headerText?: string
  bodyText?: string
  initiatorButtonText: string
  initiatorButtonDisabled: boolean
  buttonColorScheme?: string
  confirmButtonText?: string
  refuseButtonText?: string
  confirmAction: () => void
}

export const ConfirmDialogButton = ({
  headerText,
  bodyText,
  initiatorButtonText,
  initiatorButtonDisabled,
  buttonColorScheme = 'red',
  confirmButtonText = 'Törlés',
  refuseButtonText = 'Mégse',
  confirmAction,
}: ConfirmDialogButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  return (
    <>
      <Button isDisabled={initiatorButtonDisabled} colorScheme="red" onClick={onOpen}>
        {initiatorButtonText}
      </Button>
      <AlertDialog
        preserveScrollBarGap={true}
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          {headerText && <AlertDialogHeader>{headerText}</AlertDialogHeader>}
          <AlertDialogCloseButton />
          {bodyText && <AlertDialogBody>{bodyText}</AlertDialogBody>}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {refuseButtonText}
            </Button>
            <Button colorScheme={buttonColorScheme} ml={3} onClick={confirmAction}>
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
