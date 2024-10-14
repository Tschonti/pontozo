import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { PublicEventMessage, RatingRole } from '@pontozo/common'
import { useRef } from 'react'
import { FaTrash, FaUserCircle } from 'react-icons/fa'
import { useAuthContext } from 'src/api/contexts/useAuthContext'
import { useDeleteMessageMutation } from 'src/api/hooks/ratingHooks'
import { ageGroupColor, ratingRoleColor, translateAgeGroup, translateRole } from 'src/util/enumHelpers'

type Props = { ratingWithMessage: PublicEventMessage; refetchMessages: () => void }

export const RatingMessage = ({ ratingWithMessage: pem, refetchMessages }: Props) => {
  const { isAdmin } = useAuthContext()
  const cancelRef = useRef(null)
  const toast = useToast()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const deleteMessageMutation = useDeleteMessageMutation()

  const onDeleteClick = (eventRatingId: number) => {
    if (isAdmin) {
      deleteMessageMutation.mutate(eventRatingId, {
        onSuccess: () => {
          refetchMessages()
          toast({ title: 'Szöveges értékelés sikeresen törölve!', status: 'success' })
        },
        onError: (err) => {
          console.error(err)
          toast({ title: 'Szöveges értékelés törlése nem sikerült!', description: 'Részletekért nyisd meg a konzolt!', status: 'error' })
        },
      })
    }
  }
  return (
    <Card key={pem.eventRatingId} width="100%">
      <CardBody>
        <VStack alignItems="flex-start">
          <HStack width="100%" justify="space-between">
            <HStack>
              <FaUserCircle fontSize={42} />
              <VStack alignItems="flex-start" gap={1}>
                <Text fontWeight="bold">Névtelen felhasználó</Text>
                <HStack>
                  <Badge colorScheme={ratingRoleColor[pem.role]} variant="solid">
                    {translateRole[pem.role]}
                  </Badge>
                  {pem.role === RatingRole.COMPETITOR && (
                    <Badge colorScheme={ageGroupColor[pem.ageGroup]} variant="solid">
                      {translateAgeGroup[pem.ageGroup]}
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>
            {isAdmin && (
              <>
                <IconButton
                  colorScheme="red"
                  icon={<FaTrash />}
                  aria-label="Szöveges értékelés törlése"
                  title="Szöveges értékelés törlése"
                  onClick={onOpen}
                />
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
                    <AlertDialogHeader>Biztosan törlöd?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>Biztosan törlöd ezt a szöveges értékelést? Ezt később nem fogod tudni visszavonni!</AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Mégse
                      </Button>
                      <Button colorScheme={'red'} ml={3} onClick={() => onDeleteClick(pem.eventRatingId)}>
                        Törlés
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </HStack>
          <Text>{pem.message}</Text>
        </VStack>
      </CardBody>
    </Card>
  )
}
