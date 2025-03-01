import { Box } from '@chakra-ui/react'
import { EventWithResults } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Text, Tooltip, XAxis, YAxis } from 'recharts'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { chartColors } from 'src/util/chartColors'
import { getCriterionScore } from 'src/util/resultItemHelpers'
import { BarChartData } from '../types/BarChartData'

type Props = {
  event: EventWithResults
  selectedCategoryId?: number
}

export const CriteriaBarChart = ({ event, selectedCategoryId }: Props) => {
  const { selectedAgeGroups, selectedRoles } = useResultTableContext()
  const [chartData, setChartData] = useState<BarChartData[]>([])

  useEffect(() => {
    setChartData(
      event.ratingResults.children
        ?.find((cat) => cat.categoryId === selectedCategoryId)
        ?.children?.map((r) => {
          const rootValue = +(getCriterionScore(r.items, selectedRoles, selectedAgeGroups)?.average ?? -1).toFixed(2)
          const output: BarChartData = {
            name: r.criterion?.name ?? '',
            event: rootValue < 0 ? '-' : rootValue,
          }
          if (event.stages.length > 1) {
            event.stages.forEach((s) => {
              if (s.ratingResults) {
                const stageValue = +(
                  getCriterionScore(
                    s.ratingResults.children
                      ?.find((cat) => cat.categoryId === selectedCategoryId)
                      ?.children?.find((c) => c.criterionId === r.criterionId)?.items ?? [],
                    selectedRoles,
                    selectedAgeGroups
                  )?.average ?? -1
                ).toFixed(2)
                output[s.id] = stageValue < 0 ? '-' : stageValue
              }
            })
          }
          return output
        }) ?? []
    )
  }, [selectedCategoryId, event, selectedAgeGroups, selectedRoles])

  if (!selectedCategoryId) return null
  const stageSpecificCategory = event.ratingResults.children
    ?.find((catRes) => catRes.categoryId === selectedCategoryId)
    ?.children?.some((critRes) => critRes.criterion?.stageSpecific)
  const isMobile = window.innerWidth < 768

  return (
    <Box overflowX={isMobile ? 'auto' : 'hidden'} width="100%" pb={2}>
      <BarChart width={975} height={450} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          interval={0}
          dataKey="name"
          height={100}
          tick={({ x, y, payload }) => (
            <Text x={x} y={y} width={100} textAnchor="middle" verticalAnchor="start">
              {payload.value}
            </Text>
          )}
        />
        <YAxis type="number" domain={[0, 3]} tickCount={4} />
        {!isMobile && <Tooltip cursor={{ fillOpacity: 0.4 }} />}
        <Legend />
        <Bar name="Teljes verseny" dataKey="event" fill={chartColors[0]} />
        {event.stages.length > 1 &&
          stageSpecificCategory &&
          event.stages.map((s, i) => <Bar key={s.id} name={s.name} dataKey={s.id} fill={chartColors[i + 1]} />)}
      </BarChart>
    </Box>
  )
}
