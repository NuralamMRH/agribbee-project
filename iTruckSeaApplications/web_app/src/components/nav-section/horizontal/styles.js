// @mui
import { styled, alpha } from '@mui/material/styles';
import { Popover, ListItemButton, ListItemIcon } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// config
import { NAV, ICON } from '../../../config-global';

// ----------------------------------------------------------------------

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'open',
})(({ active, disabled, open, depth, theme, appStyle, isOffset }) => {
  const isLight = theme.palette.mode === 'light';

  const subItem = depth !== 1;

  const activeStyle = {
    color: isOffset ? theme.palette.text.white : theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    ...(!isLight && {
      color: theme.palette.primary.light,
    }),
  };

  const activeSubStyle = {
    color:  isOffset ? theme.palette.text.secondary : theme.palette.text.primary,
    backgroundColor: 'transparent',
  };

  const hoverStyle = {
    color: isOffset ? theme.palette.text.secondary : theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  };

  return {
    flexShrink: 0,
    display: 'inline-flex',
    flexDirection: appStyle && 'column',
    alignItems: appStyle && 'center',
    justifyContent: appStyle && 'center',
    textTransform: 'capitalize',
    // padding: theme.spacing(0, 0.75),
    color: isOffset ? theme.palette.text.white : theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    height: NAV.H_DASHBOARD_ITEM_HORIZONTAL,
    minHeight: appStyle && 68,
    minWidth: appStyle && 68,

    '&:hover': hoverStyle,
    // Sub item
    ...(subItem && {
      width: '100%',
      minHeight: 30,
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      margin: 0,
      paddingRight: 0,
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.primary,
    }),
    // Active item
    ...(active && {
      ...activeStyle,
      '&:hover': {
        ...activeStyle,
      },
    }),
    // Active sub item
    ...(subItem &&
      active && {
        ...activeSubStyle,
        '&:hover': {
          ...activeSubStyle,
        },
      }),
    // Open
    ...(open && !active && hoverStyle),
    // Disabled
    ...(disabled && {
      '&.Mui-disabled': {
        opacity: 0.64,
      },
    }),
  };
});

// ----------------------------------------------------------------------

export const StyledIcon = styled(ListItemIcon)(({ appStyle }) => ({
  marginRight: appStyle ? 0 : 8,
  flexShrink: 0,
  width: ICON.NAV_ITEM_HORIZONTAL,
  height: ICON.NAV_ITEM_HORIZONTAL,
}));

// ----------------------------------------------------------------------

export const StyledPopover = styled(Popover)(({ theme }) => ({
  pointerEvents: 'none',
  '& .MuiPopover-paper': {
    width: 160,
    pointerEvents: 'auto',
    padding: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    boxShadow: theme.customShadows.dropdown,
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    ...bgBlur({ color: theme.palette.background.default }),
  },
}));
