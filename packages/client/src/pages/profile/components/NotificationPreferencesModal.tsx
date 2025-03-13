import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { EventImportedNotificationOptions, ResultNotificationOptions, UpdateEmailRecipient } from '@pontozo/common'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  useFetchEmailPreferencesMutation,
  useOptOutEmailPreferencesMutation,
  useUpdateEmailPreferencesMutation,
} from 'src/api/hooks/emailRecipientHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'

export const NotificationPreferencesModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: preferences, isLoading: fetchLoading, mutate: fetchPreferences } = useFetchEmailPreferencesMutation()
  const { isLoading: patchLoading, mutate: patchPreferences } = useUpdateEmailPreferencesMutation()
  const { isLoading: optOutLoading, mutate: optOut } = useOptOutEmailPreferencesMutation()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateEmailRecipient>({
    defaultValues: {
      email: '',
      eventImportedNotifications: EventImportedNotificationOptions.ONLY_NATIONAL,
      resultNotifications: ResultNotificationOptions.ONLY_RATED,
    },
  })

  useEffect(() => {
    if (preferences) {
      setValue('email', preferences.email)
      setValue('eventImportedNotifications', preferences.eventImportedNotifications)
      setValue('resultNotifications', preferences.resultNotifications)
    }
  }, [preferences, setValue])

  const onModalOpened = () => {
    onOpen()
    fetchPreferences()
    reset()
  }

  const onSubmit: SubmitHandler<UpdateEmailRecipient> = (data) => {
    patchPreferences(data, {
      onError: (error) => {
        console.error(error)
        toast({ title: 'Nem sikerült a mentés!', description: error.message, status: 'error' })
      },
      onSuccess: () => {
        toast({ title: 'A preferenciáid elmentettük.', status: 'success' })
        onClose()
      },
    })
  }

  const onDeleteEmail = () => {
    optOut(undefined, {
      onError: (error) => {
        console.error(error)
        toast({ title: 'Nem sikerült a mentés!', description: error.message, status: 'error' })
      },
      onSuccess: () => {
        toast({ title: 'Az e-mail címed töröltük.', status: 'success' })
        onClose()
      },
    })
  }

  return (
    <>
      <Button colorScheme="brand" onClick={onModalOpened}>
        Értesítési beállítások
      </Button>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={2}>Értesítési beállítások</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text pb={2} textAlign="justify">
              Itt adhatod meg, milyen címen és milyen események bekövetkeztekor értesítsünk e-mailben. Mindkét témában naponta maximum egy
              email kerül küldésre, összegezve az aznap megjelent versenyeket vagy eredményeiket. Mivel a versenyek többsége hétvégén van,
              az esetek többségében heti 2-4 e-mailnél akkor sem fogsz többet kapni, ha minden versenyre feliratkozol. Preferenciáidat
              bármikor megváltoztathatod.
            </Text>
            {fetchLoading ? (
              <LoadingSpinner />
            ) : (
              <VStack alignItems="flex-start" spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>E-mail cím</FormLabel>
                  {preferences?.restricted && (
                    <Alert mb={2} status="error">
                      <AlertIcon />
                      Korábban nem sikerült kézbesíteni egy értesítést az e-mail címedre, ezért letiltottuk azt. Kérlek adj meg egy új,
                      érvényes e-mail címet az értesítések bekapcsolásához.
                    </Alert>
                  )}
                  <Input
                    {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
                    bg="white"
                  />
                  <FormErrorMessage>Érvénytelen e-mail cím!</FormErrorMessage>
                </FormControl>
                <Input type="email" hidden {...register('eventImportedNotifications')} />
                <RadioGroup
                  onChange={(newValue) => setValue('eventImportedNotifications', newValue as EventImportedNotificationOptions)}
                  value={watch('eventImportedNotifications')}
                >
                  <FormLabel>Mely versenyekről szeretnél értesítést kapni, amikor értékelhetővé válnak?</FormLabel>
                  <VStack gap={1} alignItems="flex-start">
                    <Radio colorScheme="brand" value={EventImportedNotificationOptions.NONE}>
                      Semmelyikről
                    </Radio>
                    <Radio colorScheme="brand" value={EventImportedNotificationOptions.ONLY_NATIONAL}>
                      Országos vagy kiemelt rangsoroló versenyekről
                    </Radio>
                    <Radio colorScheme="brand" value={EventImportedNotificationOptions.ALL}>
                      Minden versenyről
                    </Radio>
                  </VStack>
                </RadioGroup>

                <Input hidden {...register('resultNotifications')} />
                <RadioGroup
                  onChange={(newValue) => setValue('resultNotifications', newValue as ResultNotificationOptions)}
                  value={watch('resultNotifications')}
                >
                  <FormLabel>Mely versenyekről szeretnél értesítést kapni, amikor az értékelés eredménye publikálásra kerül?</FormLabel>
                  <VStack gap={1} alignItems="flex-start">
                    <Radio colorScheme="brand" value={ResultNotificationOptions.NONE}>
                      Semmelyikről
                    </Radio>
                    <Radio colorScheme="brand" value={ResultNotificationOptions.ONLY_RATED}>
                      Csak az általam értékelt versenyekről
                    </Radio>
                    <Radio colorScheme="brand" value={ResultNotificationOptions.ALL}>
                      Minden versenyről
                    </Radio>
                  </VStack>
                </RadioGroup>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter justifyContent="space-between">
            <Popover>
              <PopoverTrigger>
                <Button colorScheme="red">E-mail cím törlése</Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader fontWeight="bold">Biztosan törlöd az e-mail címed?</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>Ezzel leiratkozol az e-mail értesítésekről.</PopoverBody>
                  <PopoverFooter>
                    <Button isLoading={optOutLoading} colorScheme="red" onClick={onDeleteEmail}>
                      E-mail cím törlése
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Portal>
            </Popover>

            <HStack>
              <Button colorScheme="gray" onClick={onClose}>
                Mégse
              </Button>
              <Button
                isDisabled={Object.keys(errors).length > 0}
                type="submit"
                colorScheme="brand"
                isLoading={patchLoading}
                onClick={handleSubmit(onSubmit)}
              >
                Mentés
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
