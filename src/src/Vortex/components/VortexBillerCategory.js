import {
  Avatar,
  ButtonBase,
  capitalize,
  Stack,
  Typography,
} from "@mui/material"
import React from "react"

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
// } from "../../assets"

import AirlinesIcon from "../../assets/svg/vortex/Vortex_Airlines-01.svg"
import BankIcon from "../../assets/svg/vortex/Vortex_Bank-01.svg"
import CableAndInternetIcon from "../../assets/svg/vortex/Vortex_Cable&Internet-01.svg"
import ConsumerFinanceIcon from "../../assets/svg/vortex/Vortex_Consumer_Finance-01.svg"
import ElectricityIcon from "../../assets/svg/vortex/Vortex_electricity-01.svg"
import FinancialServicesIcon from "../../assets/svg/vortex/Vortex_Financial_Services-01.svg"
import GovernmentIcon from "../../assets/svg/vortex/Vortex_Government-01.svg"
import HealthCareIcon from "../../assets/svg/vortex/Vortex_Healthcare-01.svg"
import InsuranceIcon from "../../assets/svg/vortex/Vortex_Insurance-01.svg"
import PaymentGatewayIcon from "../../assets/svg/vortex/Vortex_Payment_Gateway-01.svg"
import RealStateIcon from "../../assets/svg/vortex/Vortex_Real-Estates-01.svg"
import LoansIcon from "../../assets/svg/vortex/Vortex_Loans-01.svg"
import WaterIcon from "../../assets/svg/vortex/Vortex_Water-01.svg"
import PhoneAndInternetIcon from "../../assets/svg/vortex/Vortex_Phone&Internet-01.svg"

import { primaryVortexTheme } from "../config/theme"

export const BillerIcon = ({ categoryName = "Airlines" }) => {
  const icon = (name) => {
    switch (name) {
      case "airlines":
        return AirlinesIcon
      case "consumer finance":
        return ConsumerFinanceIcon
      case "phone and internet":
        return PhoneAndInternetIcon
      case "insurance and financial services":
        return InsuranceIcon
      case "payment gateway":
        return PaymentGatewayIcon
      case "electricity":
        return ElectricityIcon
      case "government":
        return GovernmentIcon
      case "real estate":
        return RealStateIcon
      case "healthcare":
        return HealthCareIcon
      case "cable tv and internet":
        return CableAndInternetIcon
      case "banks":
        return BankIcon
      case "water":
        return WaterIcon
      case "loans":
        return LoansIcon
      default:
        return AirlinesIcon
    }
  }

  return (
    <Avatar sx={{ padding: 1, bgcolor: "white" }}>
       {/* {`${icon(categoryName)}`}  */}
      <img
        src={icon(categoryName)}
        alt={"icon"}
        height={"50px"}
        width={"50px"}
        style={{
          fill: `${primaryVortexTheme.primary}`,
        }}
      />
    </Avatar>
  )
}

const VortexBillerCategory = ({
  title = "lorem ipsum",
  onClick = () => {},
}) => {
  return (
    <div
      style={{
        margin: "4px",
      }}
    >
      <ButtonBase
        onClick={() => {
          onClick()
        }}
      >
        <Stack padding={"0.5em"}>
          <Stack direction={"row"} justifyContent={"center"}>
            {/* <Avatar style={randomGradiantColorPicker()}>
              {capitalize(title.substring(0, 1))}
            </Avatar> */}
            <BillerIcon categoryName={title} />
          </Stack>
          <Typography style={{ fontSize: "0.8em" }}>
            {capitalize(title)}
          </Typography>
        </Stack>
      </ButtonBase>
    </div>
  )
}

export default VortexBillerCategory
