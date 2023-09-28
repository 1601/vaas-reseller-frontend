import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
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
import AdminDashboard from './pages/AdminPages/AdminHome';
import AdminApproval from './pages/AdminPages/AdminApproval';
import AdminStores from './pages/AdminPages/AdminStores';
import AdminKYC from './pages/AdminPages/AdminKYC';
import AdminKYCApproval from './pages/AdminPages/AdminKYCApproval';

// ----------------------------------------------------------------------

const excludedSubdomains = ['pldt-vaas-frontend', 'www'];

export default function Router() {
  const hostnameParts = window.location.hostname.split('.');
  const subdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
  const isExcludedSubdomain = subdomain ? excludedSubdomains.includes(subdomain) : false;
  const isLoggedIn = localStorage.getItem('token');
  const isSubdomain = subdomain && !isExcludedSubdomain;
  const role = localStorage.getItem('role');

  const routes = useRoutes([
    {
      path: '',
      element: isSubdomain ? <LiveStorePage /> : <LandingPage />,
      children: [
        { path: 'bills', element: <div> Bills </div> },
        { path: 'topup', element: <div> Topup </div> },
        { path: 'voucher', element: <div> Voucher </div> },
        { path: 'transactions', element: <div> Transactions </div> },
      ],
    },
    {
      path: '/dashboard',
      element: isLoggedIn
        ? (role === 'admin'
          ? <Navigate to="/dashboard/admin" replace />
          : <DashboardLayout />)
        : <Navigate to="/login" />,
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
      path: '/dashboard/admin',
      element: role === 'admin' ? <DashboardLayout /> : <Navigate to="/404" />,
      children: [
        { element: <Navigate to="/dashboard/admin/home" />, index: true },
        { path: 'home', element: <AdminDashboard /> },
        { path: 'storeapproval', element: <AdminStores /> },
        { path: 'approve/:storeId', element: <AdminApproval /> },
        { path: 'kycapproval', element: <AdminKYC /> },
        { path: 'kycapprove/:storeId', element: <AdminKYCApproval /> }
      ]
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
    { //for testing purpose, to be removed later
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

