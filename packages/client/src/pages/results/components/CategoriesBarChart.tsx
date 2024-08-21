import { Box } from '@chakra-ui/react'
import { EventWithResults, RatingResultWithJoins, StageWithResults } from '@pontozo/common'
import { Bar, BarChart, CartesianGrid, Legend, Text, Tooltip, XAxis, YAxis } from 'recharts'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { chartColors } from 'src/util/chartColors'
import { getResultItem } from 'src/util/resultItemHelpers'
import { BarChartData } from '../types/BarChartData'

type Props = {
  event: EventWithResults
  setSelectedCategoryId: (catId: number) => void
}

export const CategoryBarChart = ({ event, setSelectedCategoryId }: Props) => {
  const { selectedAgeGroups, selectedRoles } = useResultTableContext()

  const parseEventData = (rootResult: RatingResultWithJoins, stages: StageWithResults[]): BarChartData[] => {
    const rootOutput: BarChartData = {
      name: 'Összesített átlag',
      event: Math.max(+(getResultItem(rootResult.items, selectedRoles, selectedAgeGroups)?.average ?? 0).toFixed(2), 0),
    }
    stages.forEach((s) => {
      rootOutput[s.id] = Math.max(+(getResultItem(s.ratingResults.items, selectedRoles, selectedAgeGroups)?.average ?? 0).toFixed(2), 0)
    })
    return [
      rootOutput,
      ...(rootResult.children?.map((r) => {
        const output: BarChartData = {
          categoryId: r.categoryId,
          name: r.category?.name ?? '',
          event: Math.max(+(getResultItem(r.items, selectedRoles, selectedAgeGroups)?.average ?? 0).toFixed(2), 0),
        }
        stages.forEach((s) => {
          output[s.id] = Math.max(
            +(
              getResultItem(
                s.ratingResults.children?.find((c) => c.categoryId === r.categoryId)?.items ?? [],
                selectedRoles,
                selectedAgeGroups
              )?.average ?? 0
            ).toFixed(2),
            0
          )
        })
        return output
      }) ?? []),
    ]
  }

  const onChartClick = (catId: number | undefined) => {
    if (catId) setSelectedCategoryId(catId)
  }
  const isMobile = window.innerWidth < 768

  return (
    <Box overflowX={isMobile ? 'auto' : 'hidden'} width="100%" pb={2}>
      <BarChart
        width={975}
        height={450}
        style={{ cursor: 'pointer' }}
        data={parseEventData(event.ratingResults, event.stages)}
        onClick={(e) => onChartClick(e.activePayload?.[0].payload.categoryId)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          interval={0}
          dataKey="name"
          height={75}
          tick={({ x, y, payload }) => (
            <Text x={x} y={y} width={75} textAnchor="middle" verticalAnchor="start">
              {payload.value}
            </Text>
          )}
        />
        <YAxis type="number" domain={[0, 3]} tickCount={4} />
        <Legend />
        {!isMobile && <Tooltip cursor={{ fillOpacity: 0.4 }} />}
        <Bar name="Teljes verseny" dataKey="event" fill={chartColors[0]} onClick={(e) => onChartClick(e.categoryId)} />

        {event.stages.map((s, i) => (
          <Bar key={s.id} name={s.name} dataKey={s.id} fill={chartColors[i + 1]} onClick={(e) => onChartClick(e.categoryId)} />
        ))}
      </BarChart>
    </Box>
  )
}
