import { Box, HStack, IconButton, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { CategoryWithCriteria, CriterionWithWeight, RatingRole } from '@pontozo/common'
import { useMemo } from 'react'
import { FaCaretDown, FaCaretRight, FaMedal } from 'react-icons/fa'
import { criterionWeightReducer, getWeight } from 'src/util/criterionWeightHelper'
import { WeightBar } from './WeightBar'
import { WeightInput } from './WeightInput'

type Props = {
  category: CategoryWithCriteria<CriterionWithWeight>
  seasonId: string
  totalWeightSum: number
}

export const CategoryWeights = ({ category, seasonId, totalWeightSum }: Props) => {
  const competitorSum = useMemo(() => category.criteria.reduce(criterionWeightReducer('competitorWeight'), 0), [category])
  const organiserSum = useMemo(() => category.criteria.reduce(criterionWeightReducer('organiserWeight'), 0), [category])
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <IconButton
        onClick={onToggle}
        size="sm"
        variant="ghost"
        aria-label="Kategória bővebben"
        icon={isOpen ? <FaCaretDown /> : <FaCaretRight />}
      />
      <Text>
        <b>
          {category.name}{' '}
          {category.criteria.every((cc) => cc.stageSpecific) && (
            <Tooltip hasArrow placement="top" label={'Futamra vonatkozó kategória'}>
              (F)
            </Tooltip>
          )}
          {category.criteria.every((cc) => !cc.stageSpecific) && (
            <Tooltip hasArrow placement="top" label={'Teljes versenyre vonatkozó kategória'}>
              (V)
            </Tooltip>
          )}
        </b>
      </Text>
      <Text textAlign="center">
        <Tooltip hasArrow placement="left" label="A kategória szempontjainak versenyzőkre és edzőkre vonatkozó súlyösszege.">
          <b>{competitorSum.toFixed(2)}</b>
        </Tooltip>
      </Text>
      <Text textAlign="center">
        <Tooltip hasArrow placement="right" label="A kategória szempontjainak rendezőkre és MTFSZ Zsűrikre vonatkozó súlyösszege.">
          <b>{organiserSum.toFixed(2)}</b>
        </Tooltip>
      </Text>
      {isOpen ? (
        <Box display={{ base: 'none', lg: 'block' }} />
      ) : (
        <WeightBar greenPercent={(competitorSum / totalWeightSum) * 100} redPercent={(organiserSum / totalWeightSum) * 100} />
      )}
      {isOpen &&
        category.criteria.map((cc) => (
          <>
            <Box />
            <HStack w="100%">
              <Text>
                {cc.name}{' '}
                <Tooltip
                  hasArrow
                  placement="top"
                  label={cc.stageSpecific ? 'Futamra vonatkozó szempont' : 'Teljes versenyre vonatkozó szempont'}
                >
                  <b>({cc.stageSpecific ? 'F' : 'V'})</b>
                </Tooltip>
              </Text>
              {cc.nationalOnly && (
                <Tooltip hasArrow placement="top" label="Csak országos és kiemelt rangsoló versenyekre vonatkozó szempont">
                  <span>
                    <FaMedal />
                  </span>
                </Tooltip>
              )}
            </HStack>

            <WeightInput
              seasonId={seasonId}
              criterion={cc}
              weightKey="competitorWeight"
              defaultValue={cc.weight?.competitorWeight ?? 1}
              roles={[RatingRole.COMPETITOR, RatingRole.COACH]}
            />
            <WeightInput
              seasonId={seasonId}
              weightKey="organiserWeight"
              criterion={cc}
              defaultValue={cc.weight?.organiserWeight ?? 1}
              roles={[RatingRole.ORGANISER, RatingRole.JURY]}
            />
            <WeightBar
              greenPercent={(getWeight(cc, 'competitorWeight') / totalWeightSum) * 100}
              redPercent={(getWeight(cc, 'organiserWeight') / totalWeightSum) * 100}
            />
          </>
        ))}
    </>
  )
}
