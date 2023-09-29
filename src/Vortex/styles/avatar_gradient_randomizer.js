let gradientGroup = [
  //`linear-gradient(to right bottom, #EEBD89, #D13ABD)`,
  //`linear-gradient(to right bottom, #9600ff, #AEBAF8)`,
  // `linear-gradient(to right bottom, #F6EA41, #F048C8)`,
  `linear-gradient(to right bottom, #1976d2, #1976d2)`,
]

export const randomGradiantColorPicker = () => {
  let randomNumber = Math.floor(Math.random() * (gradientGroup.length - 0))

  return {
    background: gradientGroup[randomNumber],
  }
}
