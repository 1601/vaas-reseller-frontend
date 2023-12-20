import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
// subdomain
import SubdomainHandler from './SubdomainHandler';
import { StoreProvider } from './StoreContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <SubdomainHandler />
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </StoreProvider>
    </HelmetProvider>
  );
}
