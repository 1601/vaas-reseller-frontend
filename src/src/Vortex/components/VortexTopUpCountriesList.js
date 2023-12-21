import React from 'react'
import {
	Typography,
	Box, 
	ListItem,
	ListItemIcon,
	Stack, 
	Divider
} from '@mui/material'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {primaryVortexTheme} from '../config/theme'


const VortexTopUpCountriesList = ({countries, onClick = () => {}}) => {
	console.log(countries)
	return (
	    <>
	      <Box>
	        <Typography
	          margin={2}
	          fontFamily={"Visby"}
	          fontSize={20}
	          color={"gray"}
	        >
	          Select Countries
	        </Typography>
	        {countries.map((country) => {
	          return (
	            <ListItem key={country} button onClick={() => {
			    onClick(country)
		    }}>
	              <Stack
	                direction={"row"}
	                alignItems="center"
	                width="100%"
	                margin="1em"
	              >
	                <Typography
	                  fontFamily={"Visby"}
	                  fontWeight={"bold"}
	                  style={{
	                    color: primaryVortexTheme.primarytextcolor,
	                  }}
	                >
	                  {country}
	                </Typography>
	              </Stack>
	              <ListItemIcon>
	                <ChevronRightIcon style={{ color: "#0060bf" }} />
	              </ListItemIcon>
	            </ListItem>
	          )
	        })}

	        <Divider />
	      </Box>
	    </>
	  )
}

export default VortexTopUpCountriesList