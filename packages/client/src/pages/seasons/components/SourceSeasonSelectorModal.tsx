import {
  Button,
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
  useToast,
} from '@chakra-ui/react'
import { ChangeEvent, useMemo, useState } from 'react'
import { FaFileImport } from 'react-icons/fa'
import { useCopyWeightsMutation, useFetchSeasons } from 'src/api/hooks/seasonHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { queryClient } from 'src/util/queryClient'

export const SourceSeasonSelectorModal = ({ currentSeasonId }: { currentSeasonId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading, data } = useFetchSeasons()
  const { mutate } = useCopyWeightsMutation(currentSeasonId)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>()
  const toast = useToast()

  const filteredSeasons = useMemo(() => {
    if (data) return data.filter((s) => s.id !== parseInt(currentSeasonId))
    return []
  }, [data, currentSeasonId])

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeasonId(e.target.value)
  }

  const onSubmit = () => {
    if (selectedSeasonId) {
      mutate(selectedSeasonId, {
        onSuccess: () => {
          onClose()
          toast({ title: 'Súlyok sikeresen importálva!', status: 'success' })
          queryClient.invalidateQueries(['fetchSeasonWeights', currentSeasonId])
        },
      })
    }
  }

  return (
    <>
      <Button colorScheme="brand" leftIcon={<FaFileImport />} onClick={onOpen}>
        Súlyok importálása más szezonból
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Súlyok importálása más szezonból</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} textAlign="justify">
              Az itt kiválasztott szezon azon szempontjaihoz tartozó súlyértékek kerülnek importálása, melyek a jelenleg szerkesztett
              szezonnak is részei. <b>Az importálás során a jelenlegi súlyértékek felülíródnak, azt később visszavonni nem lehet!</b>
            </Text>
            {isLoading || !data ? (
              <LoadingSpinner />
            ) : (
              <Select value={selectedSeasonId} onChange={onSelectChange} placeholder="Válassz szezont!">
                {filteredSeasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Mégse
            </Button>
            <Button onClick={onSubmit} isDisabled={!selectedSeasonId} colorScheme="brand">
              Importálás
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
