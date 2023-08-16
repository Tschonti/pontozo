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
