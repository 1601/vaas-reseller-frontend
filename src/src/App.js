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
import { AuthProvider } from './components/authentication/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <SubdomainHandler />
              <Router />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </StoreProvider>
    </HelmetProvider>
  );
}
