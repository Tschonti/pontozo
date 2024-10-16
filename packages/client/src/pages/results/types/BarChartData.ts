export type BarChartData = {
  categoryId?: number
  name: string
  event: number | '-'
  [key: number]: number | '-'
}
