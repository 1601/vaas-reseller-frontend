import React, { useState, useRef, useEffect } from 'react';

import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Box,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom'; 
import Transition from '../utils/Transition';

import GiftImg from '../images/gifting-feature.jpg';
import BillsImg from '../images/billspayment-feature.jpg';
import ReachImg from '../images/reach-feature.jpg'


function Features() {

  const [tab, setTab] = useState(1);

  const tabs = useRef(null);

  const heightFix = () => {
    // if (tabs.current.children[tab]) {
    //   // eslint-disable-next-line
    //   tabs.current.style.height = tabs.current.children[tab - 1].offsetHeight + 'px'
    // }
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    heightFix()
    // eslint-disable-next-line 
  }, [tab])

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <Typography variant="h4" component="h1" gutterBottom>
              Explore the solutions
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Looking for an easy and fast way to send prepaid mobile load to your friends and loved ones in the Philippines? Look no further!
            </Typography>
          </div>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7} lg={6}>
              <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                <Typography variant="h5" gutterBottom>
                  Whole suite of services
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  With Vortex, convenience in just a few clicks, no matter where you are.
                </Typography>
              </div>
              <Paper elevation={3} square>
                <Tabs
                  value={tab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  variant="fullWidth"
                >
                  <Tab label="Further your reach" />
                  <Tab label="All your essential bills in one place" />
                  <Tab label="Gifting made easy" />
                </Tabs>
                <Box p={3}>
                  {tab === 1 && (
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Further your reach
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Cater to Smart, SUN, and TNT subscribers worldwide and top billers in the Philippines.
                      </Typography>
                    </div>
                  )}
                  {tab === 2 && (
                    <div>
                      <Typography variant="h6" gutterBottom>
                        All your essential bills in one place
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        We offer a fast and convenient way to pay your essential bills anytime, anywhere.
                      </Typography>
                    </div>
                  )}
                  {tab === 3 && (
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Gifting made easy
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Enable a hassle-free way for your customers to easily make someone feel special.
                      </Typography>
                    </div>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <div className="relative flex flex-col text-center lg:text-right">
                <Box
                  display={tab === 1 ? 'block' : 'none'}
                  sx={{
                    transition: 'ease-in-out 700ms transform',
                    transformOrigin: 'top',
                    transform: tab === 1 ? 'none' : 'translateY(-16px)',
                  }}
                >
                  <img src={ReachImg} alt="Reach" />
                </Box>
                <Box
                  display={tab === 2 ? 'block' : 'none'}
                  sx={{
                    transition: 'ease-in-out 700ms transform',
                    transformOrigin: 'top',
                    transform: tab === 2 ? 'none' : 'translateY(-16px)',
                  }}
                >
                  <img src={BillsImg} alt="Bills" />
                </Box>
                <Box
                  display={tab === 3 ? 'block' : 'none'}
                  sx={{
                    transition: 'ease-in-out 700ms transform',
                    transformOrigin: 'top',
                    transform: tab === 3 ? 'none' : 'translateY(-16px)',
                  }}
                >
                  <img src={GiftImg} alt="Gift" />
                </Box>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  );
}

export default Features;
