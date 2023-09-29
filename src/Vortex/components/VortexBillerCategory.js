// import {
//   Avatar,
//   ButtonBase,
//   capitalize,
//   Stack,
//   Typography,
// } from "@mui/material"
// import React from "react"

// import {
//   AirlinesIcon,
//   ConsumerFinanceIcon,
//   BankIcon,
//   CableAndInternetIcon,
//   ElectricityIcon,
//   FinancialServicesIcon,
//   GovernmentIcon,
//   HealthCareIcon,
//   InsuranceIcon,
//   PaymentGatewayIcon,
//   RealStateIcon,
//   LoansIcon,
//   WaterIcon,
//   PhoneAndInternetIcon,
// } from "../../../assets"
// import { primaryVortexTheme } from "../config/theme"

// export const BillerIcon = ({ categoryName = "Airlines" }) => {
//   const icon = (name) => {
//     switch (name) {
//       case "airlines":
//         return AirlinesIcon
//       case "consumer finance":
//         return ConsumerFinanceIcon
//       case "phone and internet":
//         return PhoneAndInternetIcon
//       case "insurance and financial services":
//         return InsuranceIcon
//       case "payment gateway":
//         return PaymentGatewayIcon
//       case "electricity":
//         return ElectricityIcon
//       case "government":
//         return GovernmentIcon
//       case "real estate":
//         return RealStateIcon
//       case "healthcare":
//         return HealthCareIcon
//       case "cable tv and internet":
//         return CableAndInternetIcon
//       case "banks":
//         return BankIcon
//       case "water":
//         return WaterIcon
//       case "loans":
//         return LoansIcon
//       default:
//         return AirlinesIcon
//     }
//   }

//   return (
//     <Avatar sx={{ padding: 1, bgcolor: "white" }}>
//       <img
//         src={icon(categoryName)}
//         alt={"icon"}
//         height={"50px"}
//         width={"50px"}
//         style={{
//           fill: `${primaryVortexTheme.primary}`,
//         }}
//       />
//     </Avatar>
//   )
// }

// const VortexBillerCategory = ({
//   title = "lorem ipsum",
//   onClick = () => {},
// }) => {
//   return (
//     <div
//       style={{
//         margin: "4px",
//       }}
//     >
//       <ButtonBase
//         onClick={() => {
//           onClick()
//         }}
//       >
//         <Stack padding={"0.5em"}>
//           <Stack direction={"row"} justifyContent={"center"}>
//             {/* <Avatar style={randomGradiantColorPicker()}>
//               {capitalize(title.substring(0, 1))}
//             </Avatar> */}
//             <BillerIcon categoryName={title} />
//           </Stack>
//           <Typography style={{ fontSize: "0.8em" }}>
//             {capitalize(title)}
//           </Typography>
//         </Stack>
//       </ButtonBase>
//     </div>
//   )
// }

// export default VortexBillerCategory
