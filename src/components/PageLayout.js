import React from 'react';
import { styled } from '@mui/material/styles';
import Header from '../partials/Header';
import Footer from '../partials/Footer';

// Incorporate styles here
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

function PageLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden" style={{backgroundColor: "#FFF"}}>
      {/* Site header */}
      <Header />
  
      {/* Page content */}
      <main className="flex-grow">
        {/* Page sections */}
        <StyledContent>
          {children}
        </StyledContent>
      </main>
  
      {/* Site footer */}
      <Footer />
    </div>
  );
}

export default PageLayout;
