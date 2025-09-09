import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { List, Drawer, IconButton } from '@mui/material';
// config
import { NAV } from '../../../../config-global';
// components
import Logo from '../../../../components/logo';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import NavList from './NavList';
import NavAccount from '@/layouts/dashboard/nav/NavAccount';
import { NavSectionVertical } from '@/components/nav-section';
import { useAuthContext } from '@/auth/useAuthContext';
import { borderRadius } from '@mui/system';

// ----------------------------------------------------------------------

NavMobile.propTypes = {
  data: PropTypes.array,
  isOffset: PropTypes.bool,
};

export default function NavMobile({ isOffset, data }) {
  const { pathname } = useRouter();

  const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          ml: 1,
          ...(isOffset && {
            color: 'text.white',
          }),
        }}
      >
        <Iconify icon="eva:menu-2-fill" color="text.white" />
      </IconButton>

      <Drawer
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_BASE,
          },
        }}
      >
        <Scrollbar>
          {/* <Logo sx={{ mx: 2.5, my: 3 }}  /> */}

          {/* <List component="nav" disablePadding>
            {data.map((link) => (
              <NavList key={link.title} item={link} />
            ))}
          </List> */}

          {isAuthenticated ? <NavAccount borderRadius={0} /> : <Logo sx={{ mx: 2.5, my: 3, borderRadius:5 }} />}

          <NavSectionVertical
            data={data}
            sx={{
              py: 5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z24,
            }}
          />
        </Scrollbar>
      </Drawer>
    </>
  );
}
