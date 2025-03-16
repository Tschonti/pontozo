export const chartColors = [
  '#0a723a',
  '#F8AB10', // mezo sarga
  '#B04191', // felulnyomas
  '#D07500', // szintvonal barna
  '#009FE3', // viz
  '#EAB983', // aszfalt
  '#f76d1c', // bolya
  '#9D9D9C', // epulet
]

export const yAxisTickFormatter = (value: number) => {
  switch (value) {
    case 0:
      return '0 (rossz)'
    case 1:
      return '1 (gyenge)'
    case 2:
      return '2 (megfelelő)'
    default:
      return '3 (kiváló)'
  }
}
