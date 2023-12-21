import PropTypes from 'prop-types';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
// @mui
import { Box, List, ListItemText, IconButton, Collapse, Switch } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  exact: PropTypes.bool,
};

function NavItem({ item }) {
  const { title, path, icon, children, isToggle } = item;
  const [open, setOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === path || children?.some((child) => location.pathname.startsWith(child.path));

  const handleToggleChange = (e) => {
    setIsToggled(e.target.checked);
  };

  const handleClick = (e) => {
    if (children) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <StyledNavItem
        component={isToggle ? 'div' : RouterLink}
        to={isToggle ? undefined : path || '#'}
        onClick={handleClick}
        sx={{
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
          color: isActive ? 'text.primary' : undefined,
          fontWeight: isActive ? 'fontWeightBold' : undefined,
        }}
      >
        {isToggle ? (
          <Switch checked={isToggled} onChange={handleToggleChange} sx={{ mr: 1 }} />
        ) : (
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        )}
        <ListItemText disableTypography primary={title} />

        {children && (
          <IconButton
            size="small"
            sx={{ ml: 1, transition: '0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ExpandMore fontSize="small" />
          </IconButton>
        )}
      </StyledNavItem>

      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <NavSection data={children} sx={{ pl: 1.5 }} />
        </Collapse>
      )}
    </>
  );
}
