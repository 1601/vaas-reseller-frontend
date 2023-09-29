// import React, { useState } from "react"
// import { LazyLoadImage } from "react-lazy-load-image-component"
// import "react-lazy-load-image-component/src/effects/blur.css"
// import getBillerLogo from "../functions/getBillerLogo"

// const VortexBillerLogoComponent = ({ id, billerName, altComponent }) => {
//   const [isError, setIsError] = useState(false)

//   return (
//     <div style={{ height: "60px", width: "60px" }}>
//       {!isError ? (
//         <LazyLoadImage
//           key={id}
//           src={getBillerLogo({ billerId: id })}
//           alt="biller-logo"
//           effect="blur"
//           height={"100%"}
//           width={"100%"}
//           style={{
//             objectFit: "scale-down",
//             marginBottom: "1em",
//           }}
//           onError={() => {
//             setIsError(true)
//           }}
//         />
//       ) : (
//         altComponent
//       )}
//     </div>
//   )
// }

// export default VortexBillerLogoComponent
