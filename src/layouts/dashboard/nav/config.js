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
      title: 'Store',
      path: '/dashboard/store',
      icon: icon('ic_blog'),
    },
    {
      title: 'Products',
      path: '/dashboard/products',
      icon: icon('ic_cart'),
    },
    {
      title: 'Customers',
      path: '/dashboard/customer',
      icon: icon('ic_user'),
    },
    {
      title: 'Transaction Directory',
      path: '/dashboard/transact',
      icon: icon('ic_transact'),
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
      path: '/dashboard/livedata',
      icon: icon('ic_toggle'),
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
