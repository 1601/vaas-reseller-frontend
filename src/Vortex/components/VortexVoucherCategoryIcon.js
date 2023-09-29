import React from "react"

import { Avatar, ButtonBase, Stack, Typography } from "@mui/material"

import {
  FoodIcon, ShoppingIcon, HomeAppliancesIcon,
  MedicalIcon, BookstoreIcon, HardwareIcon, KidsIcon, LifeStyleIcon
} from "../../../assets"

import { primaryVortexTheme } from "../config/theme"

export const VoucherCategoryIcon = ({ category = "food" }) => {
  const icon = () => {
    switch (category.toLowerCase()) {
      case "food":
        return FoodIcon
      case 'lifestyle':
        return LifeStyleIcon
      case "shopping":
        return ShoppingIcon
      case "home appliances":
        return HomeAppliancesIcon
      case 'medical':
        return MedicalIcon
      case 'bookstore':
        return BookstoreIcon
      case 'hardware':
        return HardwareIcon
      case 'kids':
        return KidsIcon
      default:
        return FoodIcon
    }
  }



  return (
    <Avatar
      sx={{
        padding: 1,
        bgcolor: "white",
      }}
    >
      <img
        src={icon()}
        alt="icon"
        height="50px"
        width="50px"
        style={{
          fill: `${primaryVortexTheme.primary}`,
        }}
      />
    </Avatar>
  )
}

export default VoucherCategoryIcon
