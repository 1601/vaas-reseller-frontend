import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import SecureLS from 'secure-ls';
import { useAuth } from './components/authentication/AuthContext';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
// pages
import LoginDialog from './components/authentication/LoginDialog';
import BlogPage from './pages/BlogPage';
import CustomerPage from './pages/DealerPages/CustomerPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/AuthPages/LoginPage';
import LoginPageAdmin from './pages/AuthPages/LoginPageAdmin';
import LoginPageReseller from './pages/AuthPages/LoginPageReseller';
import SignUpPage from './pages/AuthPages/SignUpPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import LandingPage from './pages/LandingPage';
import LiveStorePage from './pages/LiveStorePage';
import StorePageEdit from './pages/StorePageEdit';
import VerifyPage from './pages/AuthPages/VerifyPage';
import KYC from './pages/KYC';
import ForgotPasswordPage from './pages/AuthPages/ForgotPassword';
import AdminDashboard from './pages/AdminPages/AdminHome';
import AdminApproval from './pages/AdminPages/AdminApproval';
import AdminStores from './pages/AdminPages/AdminStores';
import AdminKYC from './pages/AdminPages/AdminKYC';
import AdminKYCApproval from './pages/AdminPages/AdminKYCApproval';
import VortexBills from './pages/VortexBills';
import ResetPasswordPage from './pages/AuthPages/ResetPasswordPage';
import TermsAndConditions from './pages/OtherPages/TermsAndConditions';
import DataPrivacyPolicy from './pages/OtherPages/DataPrivacyPolicy';
import CookiePolicy from './pages/OtherPages/CookiePolicy';
import SurveyPrivacyPolicy from './pages/OtherPages/SurveyPrivacyPolicy';
import WalletAndPayout from './pages/DealerPages/WalletAndPayout';
import ProfilePage from './pages/DealerPages/ProfilePage';
import VerifyInLoginPage from './pages/AuthPages/VerifyInLoginPage';
import ProfileSettings from './pages/DealerPages/ProfileSettings';
import FAQs from './pages/OtherPages/FAQs';
import SupportDetails from './pages/OtherPages/SupportDetails';
import ManageReseller from './pages/DealerPages/ManageReseller';
import VortexTopUp from './pages/VortexPages/VortexTopUp';
import VortexContext from './Vortex/context/VortexContext';
import AdminDealerAccount from './pages/AdminPages/AdminDealerAccount';
import AdminBanner from './pages/AdminPages/AdminBanner';
import AdminCreation from './pages/AdminPages/AdminCreation';
import AdminSignUp from './pages/AdminPages/AdminSignUp';
import TransactionPage from './pages/DealerPages/TransactionPage';
import { excludedPaths } from './components/subdomain/ExcludedPaths';
import TopUpProducts from './pages/DealerPages/Products/TopUpProducts';
import TopUpConfig from './pages/DealerPages/Products/TopUpConfig';
import BillerProducts from './pages/DealerPages/Products/BillerProducts';
import OldLoginPage from './pages/AuthPages/oldLoginPage';
import AdminWallet from './pages/AdminPages/AdminWallet';
import AdminAccounts from './pages/AdminPages/AdminAccounts';

// ----------------------------------------------------------------------

const excludedSubdomains = ['www', 'lvh', 'localhost'];
const ls = new SecureLS({ encodingType: 'aes' });

const checkTokenValidity = async () => {
  const token = ls.get('token');
  if (!token) {
    return { isValid: false, reason: 'no_token' };
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      return { isValid: false, reason: 'expired' };
    }

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/verify-token`,
      { token },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if(!response.data.isValid){
      return { isValid: response.data.isValid, reason: 'Token is expired.' };
    }
    return { isValid: response.data.isValid, reason: 'valid' };
  } catch (error) {
    console.error('Token validation error:', error);
    if (error.response) {
      return { isValid: false, reason: error.response.data.message };
    }
    return { isValid: false, reason: 'error' };
  }
};

export default function Router() {
  const location = useLocation();
  const hostnameParts = window.location.hostname.split('.');
  const subdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
  const isExcludedSubdomain = subdomain
    ? excludedSubdomains.includes(subdomain) ||
      subdomain.includes('pldt-vaas-frontend') ||
      subdomain.includes('vortex-vaas-frontend')
    : false;
  const isLoggedIn = ls.get('token');
  const isSubdomain = subdomain && !isExcludedSubdomain;
  const user = ls.get('user');
  const role = user ? user.role : null;
  const [isTokenValid, setIsTokenValid] = useState(true);
  const {
    isAuthenticated,
    newLoginDialogOpen,
    tokenExpiredDialogOpen,
    setNewLoginDialogOpen,
    setTokenExpiredDialogOpen,
  } = useAuth();

  useEffect(() => {
    const currentHostname = window.location.hostname;
    const currentPort = window.location.port;
    const currentPath = window.location.pathname;
    const hostnameParts = currentHostname.split('.');
    const subdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;

    const storeUrlPattern = /^\/([a-zA-Z0-9_-]+)$/;
    const match = currentPath.match(storeUrlPattern);
    const storeUrl = match ? match[1] : null;

    const isExcludedSubdomain = subdomain
      ? excludedSubdomains.includes(subdomain) ||
        subdomain.includes('pldt-vaas-frontend') ||
        subdomain.includes('vortex-vaas-frontend')
      : false;

    if ((currentPath && excludedPaths.some((path) => currentPath.includes(path))) || isExcludedSubdomain) {
      return;
    }

    if (
      match &&
      subdomain &&
      !subdomain.includes('pldt-vaas-frontend') &&
      !subdomain.includes('vortex-vaas-frontend')
    ) {
      const storeUrl = match[1];

      fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.isLive === false) {
            console.log('Store is not live.');
            return;
          }
          if (currentHostname.includes('lvh.me')) {
            window.location.href = `http://${storeUrl}.lvh.me:${currentPort}`;
          } else if (currentHostname.includes('sevenstarjasem.com')) {
            window.location.href = `https://${storeUrl}.sevenstarjasem.com`;
          }
        });
    }

    // Grab Query Parameter from URL
    const getQueryParam = (param) => {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get(param);
    };

    const resellerCode = getQueryParam('reseller');

    if (storeUrl && !resellerCode) {
      ls.remove('resellerCode');
    } else if (resellerCode) {
      ls.set('resellerCode', JSON.stringify({ code: resellerCode, timestamp: new Date().getTime() }));
      window.history.pushState({}, '', currentPath);
    } else {
      const storedData = ls.get('resellerCode');
      if (storedData) {
        const { timestamp } = JSON.parse(storedData);
        const currentTime = new Date().getTime();
        if (currentTime - timestamp > 3600000) {
          ls.remove('resellerCode');
        }
      }
    }
  }, []);

  useEffect(() => {
    let intervalId;

    if (!newLoginDialogOpen && !tokenExpiredDialogOpen) {
      intervalId = setInterval(async () => {
        const { isValid, reason } = await checkTokenValidity();
        setIsTokenValid(isValid);

        if (!isValid && location.pathname.startsWith('/dashboard')) {
          if (reason === 'Token is invalid due to new login.') {
            setNewLoginDialogOpen(true);
            setTokenExpiredDialogOpen(false);
          } else if (reason === 'Token is expired.') {
            setNewLoginDialogOpen(false);
            setTokenExpiredDialogOpen(true);
          } else {
            setNewLoginDialogOpen(false);
            setTokenExpiredDialogOpen(false);
          }
        } else {
          setNewLoginDialogOpen(false);
          setTokenExpiredDialogOpen(false);
        }
      }, 60000);
    }

    return () => clearInterval(intervalId);
  }, [location.pathname, newLoginDialogOpen, tokenExpiredDialogOpen]);

  const handleCloseDialog = () => {
    setNewLoginDialogOpen(false);
    setTokenExpiredDialogOpen(false);
  };

  const routes = useRoutes([
    {
      path: '',
      element: isSubdomain ? <LiveStorePage /> : <LandingPage />,
      children: [
        { path: 'bills', element: <VortexBills /> },
        {
          path: 'topup',
          element: (
            <VortexContext>
              <VortexTopUp />
            </VortexContext>
          ),
        },
        { path: 'voucher', element: <div> Voucher </div> },
        { path: 'transactions', element: <div> Transactions </div> },
      ],
    },
    {
      path: '/dashboard',
      element: isLoggedIn ? (
        role === 'admin' ? (
          <Navigate to="/dashboard/admin" replace />
        ) : (
          <DashboardLayout />
        )
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true }, // This is the index route for the dashboard
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        {
          path: 'products',
          children: [
            { path: '/dashboard/products', element: <Navigate to="bills-payment" replace />, index: true },
            { path: 'bills-payment', element: <BillerProducts /> },
            {
              path: 'top-up',
              children: [
                { path: '/dashboard/products/top-up', element: <TopUpProducts />, index: true },
                { path: ':productName', element: <TopUpConfig /> },
              ],
            },
            { path: 'e-gifts', element: <ProductsPage /> },
          ],
        },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'store',
          children: [
            { path: '/dashboard/store', element: <Navigate to="storefront" replace />, index: true },
            { path: 'storefront', element: <StorePageEdit /> },
            { path: 'resellers', element: <ManageReseller /> },
          ],
        },
        { path: 'customer', element: <CustomerPage /> },
        { path: 'developer', element: <UserPage /> },
        {
          path: 'sales',
          children: [
            { path: '/dashboard/sales', element: <Navigate to="transactions" replace />, index: true },
            { path: 'transactions', element: <TransactionPage /> },
            { path: 'my-wallet', element: <ProductsPage /> },
            { path: 'reports', element: <ProductsPage /> },
            { path: 'point-of-sale', element: <ProductsPage /> },
          ],
        },
        { path: 'wallet', element: <WalletAndPayout /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'reports', element: <UserPage /> },
        { path: 'kyc', element: <KYC /> },
        { path: 'securitylogs', element: <UserPage /> },
        {
          path: 'settings',
          children: [
            { path: '/dashboard/settings', element: <Navigate to="profile" replace />, index: true },
            { path: 'profile', element: <ProfileSettings /> },
            { path: 'faq', element: <FAQs /> },
            { path: 'support', element: <SupportDetails  /> },
          ],
        },
      ],
    },
    {
      path: '/dashboard/reseller',
      element: isLoggedIn && role === 'reseller' ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: '', element: <Navigate to="app" replace />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        {
          path: 'products',
          children: [
            { path: '', element: <ProductsPage />, index: true },
            { path: 'bills-payment', element: <BillerProducts /> },
            {
              path: 'top-up',
              children: [
                { path: '', element: <TopUpProducts />, index: true },
                { path: ':productName', element: <TopUpConfig /> },
              ],
            },
          ],
        },
        {
          path: 'sales',
          children: [
            { path: '', element: <TransactionPage />, index: true },
            { path: 'transactions', element: <TransactionPage /> },
          ],
        },
        { path: 'profile', element: <ProfilePage /> },
        {
          path: 'settings',
          children: [
            { path: '', element: <ProfileSettings />, index: true },
            { path: 'profile', element: <ProfileSettings /> },
            { path: 'faq', element: <FAQs /> },
          ],
        },
      ],
    },
    {
      path: 'admin',
      element: isLoggedIn && role === 'admin' ? <Navigate to="/dashboard/admin" /> : <LoginPageAdmin />,
    },
    {
      path: '/dashboard/admin',
      element: role === 'admin' ? <DashboardLayout /> : <Navigate to="/404" />,
      children: [
        { element: <Navigate to="/dashboard/admin/home" />, index: true },
        { path: 'home', element: <AdminDashboard /> },
        { path: 'storeapproval', element: <AdminStores /> },
        { path: 'storeapproval/:storeId', element: <AdminApproval /> },
        { path: 'kycapproval', element: <AdminKYC /> },
        { path: 'kycapprove/:storeId', element: <AdminKYCApproval /> },
        { path: 'banner', element: <AdminBanner /> },
        { path: 'create', element: <AdminCreation /> },

        // Product Config
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'products/bills', element: <ProductsPage /> },
        // { path: 'products/topup', element: <TopUpProducts /> },
        // { path: 'products/egift', element: <ProductsPage /> },

        // Dealer Accounts
        { path: 'dealers', element: <AdminDealerAccount /> },
        { path: 'accounts', element: <AdminAccounts /> },
        { path: 'wallet/manage-ca', element: <AdminWallet /> },
      ],
    },
    {
      path: 'admin-signup',
      element: <AdminSignUp />,
    },
    {
      path: 'login',
      element: isLoggedIn ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      path: 'login2',
      element: isLoggedIn ? <Navigate to="/dashboard/app" /> : <OldLoginPage />,
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
      path: 'reset-password',
      element: !isLoggedIn ? <ResetPasswordPage /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: 'verify',
      element: <VerifyInLoginPage />,
    },
    {
      path: 'verify-email',
      element: <VerifyPage />,
    },
    {
      path: 'terms-and-conditions',
      element: <TermsAndConditions />,
    },
    {
      path: 'data-privacy-policy',
      element: <DataPrivacyPolicy />,
    },
    {
      path: 'cookie-policy',
      element: <CookiePolicy />,
    },
    {
      path: 'survey-privacy-policy',
      element: <SurveyPrivacyPolicy />,
    },
    {
      path: ':storeUrl/reseller',
      element: <LoginPageReseller />,
      loader: async ({ params }) => {
        const { storeUrl } = params;
        if (!storeUrl.includes('pldt-vaas-frontend') && !storeUrl.includes('vortex-vaas-frontend')) {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}`);
          const storeData = await response.json();
          if (storeData.isLive === false) {
            console.log('Store is not live.');
            return null;
          }
          return { storeData };
        }
        return null;
      },
    },
    ...(!isSubdomain
      ? [
          {
            path: ':storeUrl',
            element: <LiveStorePage />,
            children: [
              {
                path: 'bills',
                element: <VortexBills />,
              },
              {
                path: 'topup',
                element: (
                  <VortexContext>
                    <VortexTopUp />
                  </VortexContext>
                ),
              },
              { path: 'voucher', element: <div> Voucher </div> },
              { path: 'transactions', element: <div> Transactions </div> },
              // { path: 'reseller', element: <div> reseller </div> },
            ],

            loader: async ({ params }) => {
              const { storeUrl } = params;
              if (!storeUrl.includes('pldt-vaas-frontend') && !storeUrl.includes('vortex-vaas-frontend')) {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}`);
                const storeData = await response.json();
                if (storeData.isLive === false) {
                  console.log('Store is not live.');
                  return null;
                }
                return { storeData };
              }
              return null;
            },
          },
        ]
      : []),
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

  return (
    <>
      <LoginDialog
        open={newLoginDialogOpen}
        onClose={() => handleCloseDialog('newLogin')}
        dialogType="newLogin"
        disableBackdropClick
        disableEscapeKeyDown
      />
      <LoginDialog
        open={tokenExpiredDialogOpen}
        onClose={() => handleCloseDialog('tokenExpired')}
        dialogType="tokenExpired"
        disableBackdropClick
        disableEscapeKeyDown
      />
      {routes}
    </>
  );
}
