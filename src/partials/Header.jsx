import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List'; // Import List component
import ListItem from '@mui/material/ListItem'; // Import ListItem component
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles'
import VortexBlackLogo from '../assets/vortex_logo_black.png';


const Responsive = styled('div')(({theme}) =>({
  [theme.breakpoints.down('md')]:{
    width:'100px'
  }
}))

function Header() {
  const [top, setTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false)


  const DrawerButtonHandle = (() => {
    if (isMenuOpen === true) {
      return <CloseIcon onClick={() => setIsMenuOpen(false)} />
    }
    return <MenuIcon onClick={() => setIsMenuOpen(true)} />
  })

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
      // eslint-disable-next-line
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <Responsive >
            {/* Logo */}
            <Link to="/" className="block" aria-label="Cruip">
              <img
                src={VortexBlackLogo}
                height="auto"  // Adjusted height to "auto" for responsiveness
                alt="Logo"
                style={{ maxWidth: "100%", maxHeight: "3rem" }}  // Adjusted max width and max height for responsiveness
              />
            </Link>
          </Responsive>

          {/* Site navigation */}
          <nav>
            <ul className="flex items-center space-x-2 md:space-x-4">
              <Hidden mdDown>
                <li className='font-medium text-sm md:text-base text-gray-600 hover:text-gray-900 px-2 py-1 md:px-3 md:py-2 flex items-center transition duration-150 ease-in-out"'>
                    Solutions
                    <ArrowDropDownIcon/>
                </li>
                <li className='font-medium text-sm md:text-base text-gray-600 hover:text-gray-900 px-2 py-1 md:px-3 md:py-2 flex items-center transition duration-150 ease-in-out"'>
                    Pricing
                </li>
              </Hidden>
              <li>
                <Link to="/login" className="font-medium text-sm md:text-base text-gray-600 hover:text-gray-900 px-2 py-1 md:px-3 md:py-2 flex items-center transition duration-150 ease-in-out">Log in</Link>
              </li>
              <li>
                <Link to="/signup" className="btn text-white bg-gray-900 text-shopifysans font-bold inline-block leading-none overflow-hidden max-w-full transition-all focus-visible:outline-4 focus-visible:outline-focus focus-visible:outline-offset-[-2px] border-solid border-2 rounded-[20px] focus-visible:outline-none tracking-ff-tight border-[transparent] text-white bg-shade-100 hover:bg-shade-70 active:bg-shade-50 disabled:bg-shade-20 disabled:text-shade-30 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">Create Shop</Link>
              </li>
              
              <li>
                <Hidden mdUp>
                  {DrawerButtonHandle()}
                </Hidden>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Drawer
        anchor="top"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        className='z-20'
        PaperProps={{
          style: {
            height: '20vh', // Set the desired height here (e.g., 80% of viewport height)
            justifyContent: 'flex-end',
            borderBottomLeftRadius: '44px', // Adjust the radius value as needed
            borderBottomRightRadius: '44px', // Adjust the radius value a
          },
        }}
      >
        <List
          sx={{ marginLeft: '32px', marginRight: "32px" }}
        >
          <ListItem component={Link} to="/solutions">
            <ListItemText>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Solutions
              </Typography> 
            </ListItemText>
          </ListItem>
          <hr />
          <ListItem component={Link} to="/solutions">
            <ListItemText>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Pricing
              </Typography> 
            </ListItemText>
          </ListItem>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>
    </header>

  );
}

export default Header;
