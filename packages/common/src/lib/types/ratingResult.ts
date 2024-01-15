export interface RatingResult {
  id: number
  parentId?: number
  eventId: number
  stageId?: number
  criterionId?: number
  categoryId?: number
  items: RatingResultItem[]
}

export interface RatingResultItem {
  count: number
  average: number
  role?: string
  ageGroup?: string
}
