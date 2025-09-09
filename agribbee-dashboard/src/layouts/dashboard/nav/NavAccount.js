// next
import NextLink from 'next/link';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  const { global } = useSelector((state) => state.globalSettings);

  // console.log(user);

  return (
    <Link component={NextLink} href={PATH_DASHBOARD.user.account} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar
          src={`${global?.base_urls?.customer_image_path}/${user?.image}`}
          alt={`${user?.f_name} ${user?.l_name}`}
          name={`${user?.f_name} ${user?.l_name}`}
        />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap color={(theme) => theme.palette.text.white}>
            {`${user?.f_name} ${user?.l_name}`}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: (theme) => theme.palette.text.gray }}>
            {user?.company_name ? user?.company_name : user?.role}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
