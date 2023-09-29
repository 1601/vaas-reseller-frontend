export default function getBillerLogo({ billerId }) {
  // const prepString = (text) => {
  //   //Convert string to lower case
  //   let lwrCase = text?.toLowerCase()

  //   let replaceSpace = lwrCase?.replaceAll(" ", "_")

  //   const regex = /[&\/\\#,+()$~%.'":*?<>{}]/g

  //   let removeSpecial = replaceSpace?.replaceAll(regex, "")

  //   let finalString = removeSpecial

  //   return finalString
  // }

  return `https://sparkle-vortex.imgix.net/${billerId}.png?w=60&h=60`
}
