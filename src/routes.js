 import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import LandingPage from './pages/LandingPage';
import LiveStorePage from './pages/LiveStorePage';
import StorePageEdit from './pages/StorePageEdit';
import VerifyPage from './pages/VerifyPage';
import KYC from './pages/KYC';
import ForgotPasswordPage from './pages/ForgotPassword';

// ----------------------------------------------------------------------

const excludedSubdomains = ['pldt-vaas-frontend', 'www'];

export default function Router() {
  const isLoggedIn = localStorage.getItem('token');
  const isExcludedSubdomain = excludedSubdomains.includes(subdomain);
  const isSubdomain = window.location.hostname.split('.').length > 2 && !isExcludedSubdomain;
  const routes = useRoutes([
    {
      path: '',
      element: isSubdomain ? <LiveStorePage /> : <LandingPage />,
    },
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true }, // This is the index route for the dashboard
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'store', element: <StorePageEdit /> },
        { path: 'customer', element: <UserPage /> },
        { path: 'developer', element: <UserPage /> },
        { path: 'transact', element: <UserPage /> },
        { path: 'wallet', element: <UserPage /> },
        { path: 'reports', element: <UserPage /> },
        { path: 'livedata', element: <UserPage /> },
        { path: 'kyc', element: <KYC /> },
        { path: 'securitylogs', element: <UserPage /> },
        { path: 'settings', element: <UserPage /> },
      ],
    },
    {
      path: 'login',
      element: isLoggedIn ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
    {
      path: 'forgotpassword',
      element: <ForgotPasswordPage />,
    },
    {
      path: 'verify',
      element: <VerifyPage />,
    },    
    {
      path: ':storeUrl',
      element: <LiveStorePage />,
      children: [
        { path: 'bills', element: <div> Bills </div> },
        { path: 'topup', element: <div> Topup </div> },
        { path: 'voucher', element: <div> Voucher </div> },
        { path: 'transactions', element: <div> Transactions </div> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

