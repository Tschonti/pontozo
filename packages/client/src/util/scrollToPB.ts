export const scrollToPB = () => {
  if (window.scrollY > document.getElementById('ratingPB')!.offsetTop) {
    window.scrollTo({ top: document.getElementById('ratingPB')!.offsetTop, left: 0, behavior: 'smooth' })
  }
}
