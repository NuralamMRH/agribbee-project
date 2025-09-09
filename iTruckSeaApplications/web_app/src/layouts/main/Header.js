import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Link, Stack } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import { bgBlur } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// routes
import { PATH_AUTH, PATH_DOCS, PATH_MINIMAL_ON_STORE } from '../../routes/paths';
// components
import Logo from '../../components/logo';
import Label from '../../components/label';
//
import NavMobile from './nav/mobile';
import navConfig from './nav/config-navigation';
import NavDesktop from './nav/desktop';
import LanguagePopover from '../dashboard/header/LanguagePopover';
import { useAuthContext } from '@/auth/useAuthContext';
import NotificationsPopover from '../dashboard/header/NotificationsPopover';
import AccountPopover from '../dashboard/header/AccountPopover';
import NAV_ITEMS from './nav/main-navigation';
import { NavSectionHorizontal } from '@/components/nav-section';
import Searchbar from './nav/Searchbar';

// ----------------------------------------------------------------------

export default function Header() {
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AppBar color="primary" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            // ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: !isDesktop && 'space-between',
          }}
        >
          {!isDesktop && <NavMobile isOffset={isOffset} data={NAV_ITEMS} />}
          <Logo />
          {isDesktop && <Box sx={{ flexGrow: 1 }} />}
          {/* {isDesktop && <NavDesktop isOffset={isOffset} data={navConfig} />} */}
          {isDesktop && <NavSectionHorizontal isOffset={true} data={NAV_ITEMS} />}
          {isDesktop && !isAuthenticated ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={{ xs: 0.5, sm: 1.5 }}
            >
              <Button
                color="inherit"
                size="small"
                variant="contained"
                rel="noopener"
                href={PATH_AUTH.register}
                sx={{
                  color: 'grey.800',
                  bgcolor: 'secondary.main',
                  borderRadius: 10,
                  marginX: 1,
                }}
              >
                Sign up
              </Button>
            </Stack>
          ) : (
            isDesktop && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={{ xs: 0.5, sm: 1.5 }}
              >
                <Searchbar />
                <NotificationsPopover color={!isOffset ? 'common.white' : 'common.white'} />

                <AccountPopover />
              </Stack>
            )
          )}
          <LanguagePopover />
        </Container>
      </Toolbar>

      {isOffset && <Shadow />}
    </AppBar>
  );
}

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
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
