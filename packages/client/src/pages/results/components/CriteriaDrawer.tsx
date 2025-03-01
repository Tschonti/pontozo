import {
  Alert,
  AlertIcon,
  Button,
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
import { ChangeEvent, Fragment, useState } from 'react'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { CheckboxOrRadio } from './CheckboxOrRadio'

type Props = {
  isMobile: boolean
}

const maxCritToastId = 'max-crit-reached-warning'
const maxCritToastTitle = 'Maximum 5 szempont jeleníthető meg egyszerre!'

export const CriteriaDrawer = ({ isMobile }: Props) => {
  const [storedCriterionIds, setStoredCriterionIds] = useState<number[]>([])
  const [storedCategoryIds, setStoredCategoryIds] = useState<number[]>([])
  const [storedIncludeTotal, setStoredIncludeTotal] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {
    includeTotal,
    selectedCategoryIds,
    selectedCriterionIds,
    seasonsData,
    setSelectedCategoryIds,
    setSelectedCriterionIds,
    setIncludeTotal,
    sendResultRequest,
  } = useResultTableContext()
  const selectCritCount = selectedCategoryIds.length + selectedCriterionIds.length + (includeTotal ? 1 : 0)

  const saveSelectedIds = () => {
    sendResultRequest()
    onClose()
  }

  const showToast = (toastId: string, toastTitle: string) => {
    if (!toast.isActive(toastId)) {
      toast({ id: toastId, title: toastTitle, status: 'warning' })
    }
  }

  const categoryCheckChange = (event: ChangeEvent, categoryId: number) => {
    if (isMobile) {
      setSelectedCriterionIds([])
      setIncludeTotal(false)
      setSelectedCategoryIds([categoryId])
    } else {
      if ((event.target as HTMLInputElement).checked) {
        if (selectCritCount > 4) return showToast(maxCritToastId, maxCritToastTitle)
        setSelectedCategoryIds([...selectedCategoryIds, categoryId])
      } else {
        setSelectedCategoryIds(selectedCategoryIds.filter((cId) => cId !== categoryId))
      }
    }
  }

  const criterionCheckChange = (event: ChangeEvent, criterionId: number) => {
    if (isMobile) {
      setSelectedCriterionIds([criterionId])
      setIncludeTotal(false)
      setSelectedCategoryIds([])
    } else {
      if ((event.target as HTMLInputElement).checked) {
        if (selectCritCount > 4) return showToast(maxCritToastId, maxCritToastTitle)
        setSelectedCriterionIds([...selectedCriterionIds, criterionId])
      } else {
        setSelectedCriterionIds(selectedCriterionIds.filter((cId) => cId !== criterionId))
      }
    }
  }

  const includeTotalChange = () => {
    if (isMobile) {
      setSelectedCriterionIds([])
      setIncludeTotal(true)
      setSelectedCategoryIds([])
    } else {
      if (!includeTotal && selectCritCount > 4) return showToast(maxCritToastId, maxCritToastTitle)
      setIncludeTotal(!includeTotal)
    }
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
          <DrawerHeader>Megjelenített szempont{isMobile ? '' : 'ok'}</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" gap={1}>
              <Text textAlign="justify">
                {isMobile
                  ? "Itt választhatod ki, mely szempont vagy kategória szerint szeretnéd megtekinteni az értékelés eredményeit. A kategóriáknál a hozzá tartozó szempontok súlyozott átlagai, az 'Összpontszám' esetében pedig minden szempont súlyozott átlaga fog megjelenni."
                  : "Itt választhatod ki, mely szempontok és kategóriák szerint szeretnéd megtekinteni az értékelés eredményeit. A kategóriáknál a hozzá tartozó szempontok súlyozott átlagai, az 'Összpontszám' esetében pedig minden szempont súlyozott átlaga fog megjelenni."}
              </Text>
              {isMobile && (
                <Alert my={1} status="warning">
                  <AlertIcon />
                  Kis képernyőn csak egy szempont jeleníthető meg egyszerre, részletesebb elemzéshez használj nagyobb kijelzőt!
                </Alert>
              )}
              <Text>
                <b>(V)</b> - Teljes versenyre vonatkozó szempont/kategória
              </Text>
              <Text mb={4}>
                <b>(F)</b> - Futamra vonatkozó szempont/kategória
              </Text>

              <CheckboxOrRadio isMobile={isMobile} isChecked={includeTotal} onChange={includeTotalChange}>
                Összpontszám
              </CheckboxOrRadio>

              {seasonsData?.selectedSeason?.categories.map((c) => (
                <Fragment key={c.id}>
                  <CheckboxOrRadio
                    isMobile={isMobile}
                    isChecked={selectedCategoryIds.includes(c.id)}
                    onChange={(e) => categoryCheckChange(e, c.id)}
                  >
                    <Text fontWeight="bold">
                      {c.name} {c.criteria.every((cc) => cc.stageSpecific) && '(F)'}
                      {c.criteria.every((cc) => !cc.stageSpecific) && '(V)'}
                    </Text>
                  </CheckboxOrRadio>
                  <VStack alignItems="flex-start" gap={1} ml={4}>
                    {c.criteria.map((cc) => (
                      <CheckboxOrRadio
                        isMobile={isMobile}
                        key={cc.id}
                        isChecked={selectedCriterionIds.includes(cc.id)}
                        onChange={(e) => criterionCheckChange(e, cc.id)}
                      >
                        {cc.name} ({cc.stageSpecific ? 'F' : 'V'})
                      </CheckboxOrRadio>
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
            <Button isDisabled={selectCritCount === 0} colorScheme="brand" onClick={saveSelectedIds}>
              Alkalmaz
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
