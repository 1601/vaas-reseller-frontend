import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardContent } from '@mui/material';
// components
import Iconify from '../components/iconify';
import AccountStatusModal from '../components/user-account/AccountStatusModal';
import UserDataFetch from '../components/user-account/UserDataFetch';
import StoreDataFetch from '../components/user-account/StoreDataFetch';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [kycApprove, setKycApprove] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [displayMessage, setDisplayMessage] = useState('');
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);

  const userData = UserDataFetch(userId);

  useEffect(() => {
    if (storeData && storeData._id) {
      console.log('Fetching store status for _id:', storeData._id);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/store-status/${storeData._id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Received store status data:', data);
          setKycApprove(data.kycApprove);
          setDaysLeft(data.daysLeft);
          setDisplayMessage(data.displayMessage);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    }
  }, [storeData]);

  const trialMessageCard =
    kycApprove !== 2 &&
    daysLeft !== null &&
    userData &&
    userData.accountStatus !== 'Suspended' &&
    userData.accountStatus !== 'Deactivated' ? (
      <Card sx={{ mb: 5, p: 3, textAlign: 'center', backgroundColor: 'error.light' }}>
        <CardContent>
          <Typography variant="h5" color="error.dark">
            Your Free Trial Account has {daysLeft} days left to submit documents for Approval
          </Typography>
        </CardContent>
      </Card>
    ) : null;

  return (
    <>
      <Helmet>
        <title> Dashboard | VAAS </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        {trialMessageCard}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2023',
                '02/01/2023',
                '03/01/2023',
                '04/01/2023',
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',
                '08/01/2023',
                '09/01/2023',
                '10/01/2023',
                '11/01/2023',
              ]}
              chartData={[
                {
                  name: 'Reseller A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Reseller B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Reseller C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Sales by Reseller"
              chartLabels={['Topup-Globe', 'Topup-Smart', 'Topup-TNT', 'Bills Payment', 'EGifts', 'Topup-Sun']}
              chartData={[
                { name: 'Reseller A', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Reseller B', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Reseller C', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[
                {
                  title: 'New Egifts Available',
                  description: 'Exciting news! New Egifts from your favorite brands are now available in our store.',
                },
                {
                  title: 'Instant Top-up',
                  description: 'Top-up made easy! Instantly recharge your mobile with our fast and secure service.',
                },
                {
                  title: 'Bill Payment Update',
                  description:
                    'Important update: Our platform now supports bill payments for over 100+ providers in the Philippines.',
                },
                {
                  title: 'Exclusive Offer Alert',
                  description: 'Exclusive offer alert! Save 20% on your next Egift purchase. Limited time only!',
                },
                {
                  title: 'Global Accessibility',
                  description:
                    'Expanding horizons! Our services are now accessible worldwide. Enjoy convenience no matter where you are.',
                },
              ].map((item, index) => ({
                id: faker.datatype.uuid(),
                title: item.title, // Use the provided title
                description: item.description, // Use the provided description
                image: `/assets/images/covers/cover_${index + 1}.jpg`, // Replace with your image source
                postedAt: faker.date.recent(), // You can replace this with the actual post date if needed
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Wallet Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  'Wallet Refill Php 120,000 from September',
                  '280, orders, $220',
                  '997, orders, $2222',
                  'Wallet Refill Php 199,000 from March',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
}
