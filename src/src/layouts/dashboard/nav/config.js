// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const getNavConfig = (role, subrole, toggles) => {
  if (role === 'admin') {
    if (subrole === 'crm') {
      const config = [
        {
          title: 'Home',
          path: '/dashboard/admin/home',
          icon: icon('ic_analytics'),
        },
      ];

      if (toggles.approvals) {
        config.push({
          title: 'Approvals',
          path: '/dashboard/admin/storeapproval',
          icon: icon('ic_approval'),
          children: [
            {
              title: 'Store Approval',
              path: '/dashboard/admin/storeapproval',
              icon: icon('ic_storeapprove'),
            },
            {
              title: 'KYC Approval',
              path: '/dashboard/admin/kycapproval',
              icon: icon('ic_user'),
            },
          ],
        });
      }

      if (toggles.dealers) {
        config.push({
          title: 'Dealer Accounts',
          path: '/dashboard/admin/dealers',
          icon: icon('ic_customer'),
        });
      }

      if (toggles.banners) {
        config.push({
          title: 'Banner Configuration',
          path: '/dashboard/admin/banner',
          icon: icon('ic_product'),
        });
      }

      if (toggles.wallets) {
        config.push({
          title: 'Wallet',
          path: '/dashboard/admin/wallet',
          icon: icon('ic_wallet'),
          children: [
            {
              title: 'Manage Wallet CA',
              path: '/dashboard/admin/wallet/manage-ca',
              icon: icon('ic_circle'),
            },
          ],
        });
      }

      return config;
    }

    if (subrole === 'admin1' || subrole === 'admin0') {
      return [
        {
          title: 'Home',
          path: '/dashboard/admin/home',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Admin Accounts',
          path: '/dashboard/admin/accounts',
          icon: icon('ic_customer'),
        },
      ];
    }

    // return [
    //   {
    //     title: 'Home',
    //     path: '/dashboard/admin/home',
    //     icon: icon('ic_analytics'),
    //   },
    //   {
    //     title: 'Approvals',
    //     path: '/dashboard/admin/storeapproval',
    //     icon: icon('ic_approval'),
    //     children: [
    //       {
    //         title: 'Store Approval',
    //         path: '/dashboard/admin/storeapproval',
    //         icon: icon('ic_storeapprove'),
    //       },
    //       {
    //         title: 'KYC Approval',
    //         path: '/dashboard/admin/kycapproval',
    //         icon: icon('ic_user'),
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Dealer Accounts',
    //     path: '/dashboard/admin/dealers',
    //     icon: icon('ic_customer'),
    //   },
    //   {
    //     title: 'Admin Accounts',
    //     path: '/dashboard/admin/accounts',
    //     icon: icon('ic_customer'),
    //   },
    //   {
    //     title: 'Banner Configuration',
    //     path: '/dashboard/admin/banner',
    //     icon: icon('ic_product'),
    //   },
    //   {
    //     title: 'Wallet',
    //     path: '/dashboard/admin/wallet',
    //     icon: icon('ic_wallet'),
    //     children: [
    //       {
    //         title: 'Manage Wallet CA',
    //         path: '/dashboard/admin/wallet/manage-ca',
    //         icon: icon('ic_circle'),
    //       },
    //     ],
    //   },
    // ];
  }

  if (role === 'reseller') {
    // Reseller-specific navigation config
    return [
      {
        title: 'Dashboard',
        path: '/dashboard/reseller/app',
        icon: icon('ic_home'),
      },
      {
        title: 'Products',
        path: '/dashboard/reseller/products',
        icon: icon('ic_product'),
        children: [
          {
            title: 'Bills Payment',
            path: '/dashboard/reseller/products/bills-payment',
            icon: icon('ic_bills'),
          },
          {
            title: 'Top-up',
            path: '/dashboard/reseller/products/top-up',
            icon: icon('ic_topup'),
          },
        ],
      },
      {
        title: 'Sales',
        path: '/dashboard/reseller/sales/transactions',
        icon: icon('ic_sales'),
        children: [
          {
            title: 'Transactions',
            path: '/dashboard/reseller/sales/transactions',
            icon: icon('ic_transact'),
          },
        ],
      },
    ];
  }

  return [
    {
      title: 'Home',
      path: '/dashboard/app',
      icon: icon('ic_home'),
    },
    {
      title: 'Store',
      path: '/dashboard/store',
      icon: icon('ic_store'),
      children: [
        {
          title: 'Store Forex',
          path: '/dashboard/store/storeforex',
        },
        {
          title: 'Storefront',
          path: '/dashboard/store/storefront',
        },
        {
          title: 'Manage Retailers',
          path: '/dashboard/store/resellers',
        },
      ],
    },
    {
      title: 'Products',
      path: '/dashboard/products/bills-payment',
      icon: icon('ic_product'),
      children: [
        {
          title: 'Bills Payment',
          path: '/dashboard/products/bills-payment',
          icon: icon('ic_bills'),
        },
        {
          title: 'Top-up',
          path: '/dashboard/products/top-up',
          icon: icon('ic_topup'),
        },
      ],
    },
    {
      title: 'Customers',
      path: '/dashboard/customer',
      icon: icon('ic_customer'),
    },
    {
      title: 'Transactions',
      path: '/dashboard/sales/transactions',
      icon: icon('ic_transact'),
    },
    {
      title: 'Wallets & Payouts',
      path: '/dashboard/wallet',
      icon: icon('ic_wallet'),
    },
  ];
};

export default getNavConfig;
