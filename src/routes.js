 import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import LandingPage from './pages/LandingPage';
import LiveStorePage from './pages/LiveStorePage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '', // This is the root path
      element: <LandingPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true }, // This is the index route for the dashboard
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'transact', element: <UserPage /> },
        { path: 'wallet', element: <UserPage /> },
        { path: 'reports', element: <UserPage /> },
        { path: 'livedata', element: <UserPage /> },
        { path: 'kyc', element: <UserPage /> },
        { path: 'securitylogs', element: <UserPage /> },
        { path: 'settings', element: <UserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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

