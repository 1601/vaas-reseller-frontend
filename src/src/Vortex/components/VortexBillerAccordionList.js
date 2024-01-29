import React, { useState } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import VortexBillerCard from "./VortexBillerCard"
import { BillerIcon } from "./VortexBillerCategory"
import VortexBillerHCard from "./VortexBillerHCard"
import { primaryVortexTheme } from "../config/theme"
import localTelecomRankProvider from "../functions/localTelecomRankProvider"

const VortexBillerAccordionList = ({
  categories = [],
  billers = [],
  onSelectCategory = () => {},
  onSelectBiller = () => {},
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    onSelectCategory(panel)
    setExpanded(isExpanded ? panel : false)
  }

  // console.log(billers)

  return (
    <div
      style={{
        marginTop: "1em",
        paddingBottom: "10em",
      }}
    >
      {categories.map((category) => {
        return (
          <Accordion
            expanded={expanded === `${category}`}
            onChange={handleChange(category)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Stack direction={"row"} alignItems="center">
                <BillerIcon categoryName={category} />
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  fontWeight="bold"
                  color={`${primaryVortexTheme.primarytextcolor}`}
                >
                  {category}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  display: "flex",
                  overflowY: "scroll",
                  height: "7em",
                }}
              >
                {billers.map(biller => {
                  // console.log(biller.name, localTelecomRankProvider(biller.name))
                  return {
                    ...biller, 
                    rank: localTelecomRankProvider(biller.name)
                  }
                }).sort((biller, previous)  => previous.rank - biller.rank).map((biller) => {
                  return (
                    <VortexBillerCard
                      id={biller.id}
                      title={biller.name}
                      onClick={() => {
                        onSelectBiller(biller)
                      }}
                      icon={<BillerIcon categoryName={category} />}
                    />
                  )
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

export default VortexBillerAccordionList
