export const scrollToPB = () => {
  if (window.scrollY > document.getElementById('ratingPB')!.offsetTop) {
    window.scrollTo({ top: document.getElementById('ratingPB')!.offsetTop, left: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
}
