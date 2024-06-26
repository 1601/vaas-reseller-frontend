import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SecureLS from 'secure-ls';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import useAccount from '../../../_mock/useAccount';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import getNavConfig from './config';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const ls = new SecureLS({ encodingType: 'aes' });
const NAV_WIDTH = 280;
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfigBottom = [
  {
    title: 'upload document',
    path: '/dashboard/kyc',
    icon: icon('ic_docu'),
  },
  {
    title: 'settings',
    path: '/dashboard/settings',
    icon: icon('ic_settings'),
    children: [
      {
        title: 'My Profile',
        path: '/dashboard/settings/profile',
      },
      {
        title: 'Frequently Asked Questions',
        path: '/dashboard/settings/faq',
      },
      {
        title: 'Support',
        path: '/dashboard/settings/support',
      },
    ],
  },
];

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

const pathsToRefetch = ['/dashboard/app', '/dashboard/admin/home'];

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const location = useLocation();
  const account = useAccount();
  const isDesktop = useResponsive('up', 'lg');
  const [role, setRole] = useState(() => {
    const user = ls.get('user');
    return user ? user.role : null;
  });
  const [subrole, setSubrole] = useState(() => {
    const user = ls.get('user');
    return user ? user.subrole : null;
  });
  const [toggles, setToggles] = useState(() => {
    const user = ls.get('user');
    return user ? user.adminToggles : null;
  });
  const [currentNavConfig, setCurrentNavConfig] = useState(getNavConfig(role));

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (pathsToRefetch.includes(location.pathname)) {
      const user = ls.get('user');
      const newRole = user ? user.role : null;
      const newSubrole = user ? user.subrole : null;
      const newToggles = user ? user.adminToggles : null;
      setRole(newRole);
      setSubrole(newSubrole);
      setToggles(newToggles);
      setCurrentNavConfig(getNavConfig(newRole, newSubrole, newToggles));
    }
  }, [location.pathname]);

  useEffect(() => {
    setCurrentNavConfig(getNavConfig(role, subrole, toggles));
  }, [role, subrole]);

  const filteredNavConfigBottom = navConfigBottom
    .filter((item) => !((role === 'admin' || role === 'reseller') && item.title === 'upload document'))
    .map((item) => {
      if (role === 'admin' && item.title === 'settings') {
        return {
          ...item,
          children: item.children.filter((child) => child.title !== 'My Profile'),
        };
      }
      return item;
    });

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Logo />
      </Box>

      <NavSection data={currentNavConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <NavSection data={filteredNavConfigBottom} />

        {/* <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button>
        </Stack> */}
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
