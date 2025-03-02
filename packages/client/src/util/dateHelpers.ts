export const formatDateRange = (startDate: string, endDate?: string) => {
  if (!endDate) {
    return startDate.split('-').join('.') + '.'
  }
  const startParts = startDate.split('-')
  const endParts = endDate.split('-')
  const start = startParts.join('.') + '-'

  if (startParts[0] !== endParts[0]) {
    return `${start}${endParts.join('.')}.`
  } else if (startParts[1] !== endParts[1]) {
    return `${start}${endParts[1]}.${endParts[2]}.`
  } else {
    return `${start}${endParts[2]}.`
  }
}

export const formatDate = (date: Date): string => {
  const realDate = new Date(date)
  const year = realDate.getFullYear()
  const month = String(realDate.getMonth() + 1).padStart(2, '0')
  const day = String(realDate.getDate()).padStart(2, '0')
  const hours = String(realDate.getHours()).padStart(2, '0')
  const minutes = String(realDate.getMinutes()).padStart(2, '0')

  return `${year}. ${month}. ${day}. ${hours}:${minutes}`
}

export const getRatingEndDate = (endDate: Date) => {
  endDate.setDate(endDate.getDate() + 8)
  endDate.setHours(23)
  endDate.setMinutes(59)
  return formatDate(endDate)
}

export const getRatingResultPublishedDate = (endDate: Date) => {
  const publishDate = new Date(endDate.getTime() + 9 * 24 * 60 * 60 * 1000)
  return publishDate.toLocaleDateString('hu')
}
