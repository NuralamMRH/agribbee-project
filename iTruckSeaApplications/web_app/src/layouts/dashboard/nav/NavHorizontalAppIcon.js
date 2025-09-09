import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Toolbar } from '@mui/material';
// config
import { HEADER, NAV } from '../../../config-global';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
//
import navConfig from './app-config-navigation';
import { useSettingsContext } from '@/components/settings';
import useOffSetTop from '@/hooks/useOffSetTop';
import useResponsive from '@/hooks/useResponsive';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();
  const { themeLayout } = useSettingsContext();
  const isNavHorizontal = themeLayout === 'horizontal';
  const isNavMini = themeLayout === 'mini';
  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AppBar
      component="nav"
      color="transparent"
      sx={{
        boxShadow: 0,
        top:
          isNavHorizontal && !isOffset
            ? HEADER.H_DASHBOARD_DESKTOP_OFFSET + HEADER.H_DASHBOARD_DESKTOP_OFFSET
            : HEADER.H_DASHBOARD_DESKTOP_OFFSET,
        left:
          isDesktop && isNavHorizontal
            ? 0
            : isNavMini && isDesktop
            ? NAV.W_DASHBOARD_MINI
            : isDesktop
            ? NAV.W_DASHBOARD
            : 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          paddingY: 1,
        }}
      >
        <NavSectionHorizontal appStyle data={navConfig} />
      </Toolbar>

      <Shadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object,
};

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        width: 1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
