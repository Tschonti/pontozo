import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { SeasonWithEverything } from '@pontozo/common'
import { ChangeEvent, Fragment, useState } from 'react'

type Props = {
  selectedCriterionIds: number[]
  setSelectedCriterionIds: (newIds: number[]) => void
  selectedCategoryIds: number[]
  setSelectedCategoryIds: (newIds: number[]) => void
  includeTotal: boolean
  setIncludeTotal: (newValue: boolean) => void
  onSave: () => void
  selectedSeason?: SeasonWithEverything
}

const maxCritToastId = 'max-crit-reached-warning'
const maxCritToastTitle = 'Maximum 5 szempont jeleníthető meg egyszerre!'

const minCritToastId = 'min-crit-reached-warning'
const minCritToastTitle = 'Minimum 1 szempontot ki kell választanod!'

export const CriteriaDrawer = ({
  includeTotal,
  selectedCategoryIds,
  selectedCriterionIds,
  onSave,
  selectedSeason,
  setSelectedCategoryIds,
  setSelectedCriterionIds,
  setIncludeTotal,
}: Props) => {
  const [storedCriterionIds, setStoredCriterionIds] = useState<number[]>([])
  const [storedCategoryIds, setStoredCategoryIds] = useState<number[]>([])
  const [storedIncludeTotal, setStoredIncludeTotal] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const selectCritCount = selectedCategoryIds.length + selectedCriterionIds.length + (includeTotal ? 1 : 0)

  const saveSelectedIds = () => {
    onSave()
    onClose()
  }

  const showToast = (toastId: string, toastTitle: string) => {
    if (!toast.isActive(toastId)) {
      toast({ id: toastId, title: toastTitle, status: 'warning' })
    }
  }

  const categoryCheckChange = (event: ChangeEvent, categoryId: number) => {
    if ((event.target as HTMLInputElement).checked) {
      if (selectCritCount > 4) return showToast(maxCritToastId, maxCritToastTitle)
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    } else {
      if (selectCritCount === 1) return showToast(minCritToastId, minCritToastTitle)
      setSelectedCategoryIds(selectedCategoryIds.filter((cId) => cId !== categoryId))
    }
  }

  const criterionCheckChange = (event: ChangeEvent, criterrionId: number) => {
    if ((event.target as HTMLInputElement).checked) {
      if (selectCritCount > 4) return showToast(maxCritToastId, maxCritToastTitle)
      setSelectedCriterionIds([...selectedCriterionIds, criterrionId])
    } else {
      if (selectCritCount === 1) return showToast(minCritToastId, minCritToastTitle)
      setSelectedCriterionIds(selectedCriterionIds.filter((cId) => cId !== criterrionId))
    }
  }

  const includeTotalChange = () => {
    if (includeTotal && selectCritCount === 1) return showToast(minCritToastId, minCritToastTitle)
    setIncludeTotal(!includeTotal)
  }

  const drawerOpened = () => {
    setStoredCategoryIds(selectedCategoryIds)
    setStoredCriterionIds(selectedCriterionIds)
    setStoredIncludeTotal(includeTotal)
    onOpen()
  }

  const drawerDismissed = () => {
    setSelectedCategoryIds(storedCategoryIds)
    setSelectedCriterionIds(storedCriterionIds)
    setIncludeTotal(storedIncludeTotal)
    onClose()
  }

  return (
    <>
      <Button colorScheme="brand" onClick={drawerOpened}>
        Szempontok ({selectCritCount})
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={drawerDismissed} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Megjelenített szempontok</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" gap={1}>
              <Text textAlign="justify">
                Itt választhatod ki, mely szempontok és kategóriák szerint szeretnéd megtekinteni az értékelés eredményeit. A kategóriáknál
                a hozzá tartozó szempontok átlagai, az 'Összesített átlag' esetében pedig minden szempont átlaga fog megjelenni.
              </Text>
              <Text>
                <span style={{ fontWeight: 'bold' }}>(V)</span> - Teljes versenyre vonatkozó szempont/kategória
              </Text>
              <Text mb={4}>
                <span style={{ fontWeight: 'bold' }}>(F)</span> - Futamra vonatkozó szempont/kategória
              </Text>
              <Checkbox colorScheme="brand" isChecked={includeTotal} onChange={includeTotalChange}>
                <Text fontWeight="bold">Összesített átlag</Text>
              </Checkbox>
              {selectedSeason?.categories.map((c) => (
                <Fragment key={c.id}>
                  <Checkbox
                    colorScheme="brand"
                    isChecked={selectedCategoryIds.includes(c.id)}
                    onChange={(e) => categoryCheckChange(e, c.id)}
                  >
                    <Text fontWeight="bold">
                      {c.name} {c.criteria.every((cc) => cc.stageSpecific) && '(F)'}
                      {c.criteria.every((cc) => !cc.stageSpecific) && '(V)'}
                    </Text>
                  </Checkbox>
                  <VStack alignItems="flex-start" gap={1} ml={4}>
                    {c.criteria.map((cc) => (
                      <Checkbox
                        colorScheme="brand"
                        key={cc.id}
                        isChecked={selectedCriterionIds.includes(cc.id)}
                        onChange={(e) => criterionCheckChange(e, cc.id)}
                      >
                        {cc.name} ({cc.stageSpecific ? 'F' : 'V'})
                      </Checkbox>
                    ))}
                  </VStack>
                </Fragment>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="gray" mr={3} onClick={drawerDismissed}>
              Mégse
            </Button>
            <Button colorScheme="brand" onClick={saveSelectedIds}>
              Alkalmaz
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
