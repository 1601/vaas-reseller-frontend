// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const role = localStorage.getItem('role');

const navConfig = role === 'admin' ?
  [
    {
      title: 'Home',
      path: '/dashboard/admin/home',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Store Approval',
      path: '/dashboard/admin/storeapproval',
      icon: icon('ic_approval'),
    },
    {
      title: 'KYC Approval',
      path: '/dashboard/admin/kycapproval',
      icon: icon('ic_user'),
    },
  ] :
  [
    {
      title: 'Home',
      path: '/dashboard/app',
      icon: icon('ic_home'),
    },
    {
      title: 'Storefront',
      path: '/dashboard/store',
      icon: icon('ic_store'),
    },
    {
      title: 'Products',
      path: '/dashboard/products/bills-payment',
      icon: icon('ic_product'),
      children: [
        {
          title: 'Bills Payment',
          icon: icon('ic_bills'),
          path: '/dashboard/products/bills-payment',
        },
        {
          title: 'Top-up',
          icon: icon('ic_topup'),
          path: '/dashboard/products/top-up',
        },
        {
          title: 'E-gifts',
          icon: icon('ic_egift'),
          path: '/dashboard/products/e-gifts',
        },
      ]
    },
    {
      title: 'Customers',
      path: '/dashboard/customer',
      icon: icon('ic_customer'),
    },
    {
      title: 'Sales Channel',
      path: '/dashboard/sales/transactions', 
      icon: icon('ic_sales'), 
      children: [
        {
          title: 'Transactions',
          icon: icon('ic_transact'), 
          path: '/dashboard/sales/transactions',
        },
       // {
       //   title: 'My Wallet',
       //   icon: icon('ic_wallet'), 
       //   path: '/dashboard/sales/my-wallet',
       // },
       // {
       //   title: 'Reports',
       //   icon: icon('ic_report'), 
       //   path: '/dashboard/sales/reports',
       // },
        {
          title: 'Point of Sale',
          icon: icon('ic_pos'),
          path: '/dashboard/sales/point-of-sale',
        },
      ]
    },
    {
      title: 'Wallets & Payouts',
      path: '/dashboard/wallet',
      icon: icon('ic_wallet'),
    },
    {
      title: 'Reports',
      path: '/dashboard/reports',
      icon: icon('ic_report'),
    },
    {
      title: 'Developers',
      path: '/dashboard/developer',
      icon: icon('ic_dev'),
    },
    {
      title: 'View Live Data',
      icon: icon('ic_toggle'),
      isToggle: true,
    },
    // {
    //   title: 'login',
    //   path: '/login',
    //   icon: icon('ic_lock'),
    // },
    // {
    //   title: 'Not found',
    //   path: '/404',
    //   icon: icon('ic_disabled'),
    // },
  ];

export default navConfig;
