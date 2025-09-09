import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography, Stack, useTheme, Button } from '@mui/material';
// components
import Image from '../../components/image';
import { MotionViewport, varFade } from '../../components/animate';
import { bgGradient } from '@/utils/cssStyles';
import useResponsive from '@/hooks/useResponsive';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes/paths';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0 : 0.24),
    imgUrl: '/assets/background/4x3_map_right_side_make_white_color_.png',
    position: 'left center',
  }),
  padding: theme.spacing(10, 0),
  position: 'relative',
  minHeight: 400,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
    backgroundSize: 'contain !important',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-30% 0% !important',
  },
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    alignItems: 'center',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
  padding: theme.spacing(10, 5),
  [theme.breakpoints.up('md')]: {
    boxShadow: 'none',
  },
}));

// ----------------------------------------------------------------------

export default function HomeMinimal() {
    const theme = useTheme();
    const isSmall = theme.breakpoints.down("md");
      const isDesktop = useResponsive('up', 'md');
      const isTab = useResponsive('up', 'sm');
    console.log('isTab: ', isTab);
    console.log('isDesktop: ', isDesktop);
  return (
    <>
      <StyledRoot>
        <Container component={MotionViewport}>
          <Stack
            spacing={3}
            sx={{
              textAlign: 'center',
              mb: { xs: 5, md: 10 },
            }}
          >
            <m.div variants={varFade().inDown}>
              <Box
                component="img"
                src={'/logo/boatlogo.png'}
                sx={{
                  backgroundColor: '#ffffff',
                  width: { xs: 300, sm: 300, md: 500 },
                  height: { xs: 300, sm: 300, md: 500 },
                  borderRadius: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '99',
                  border: '3px solid #0088ff',
                }}
              />
            </m.div>
            <m.div variants={varFade().inLeft}>
              <Box
                component="img"
                src={'/assets/background/pngtree-space-satellite-broadcast-png-image_14661549.png'}
                sx={{
                  width: { xs: 150, sm: 150, md: 200 },
                  height: { xs: 150, sm: 150, md: 200 },
                  position: 'absolute',
                  right: !isDesktop ? '-10%' : '0%',
                  top: '0%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '99',
                }}
              />
            </m.div>
            <m.div variants={varFade().inLeft}>
              <Box
                component="img"
                src={'/assets/background/Starlink-wynajem-warszawa.png.webp'}
                sx={{
                  width: { xs: 60, sm: 60, md: 80 },
                  height: { xs: 60, sm: 60, md: 80 },
                  position: 'absolute',
                  right: { xs: '25% !important', md: '38% !important' },
                  top: { xs: '55%', sm: '54%', md: '54%' },
                  transform: 'translate(-50%, -50%)',
                  zIndex: '99',
                }}
              />
            </m.div>

            <Box
              component="div"
              sx={{
                position: 'absolute',
                right: !isDesktop ? '13%' : '18%',
                top: !isDesktop ? '10%' : '13%',
                transform: !isDesktop ? 'rotate(106deg)' : 'rotate(116deg)',
                zIndex: '99',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={!isDesktop ? '111' : '250'}
                height={!isDesktop ? '50' : '107'}
                viewBox="0 0 315 107"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
                    <stop offset="0%" stopColor="#1939B7" />
                    <stop offset="100%" stopColor="#1939B7" />
                  </linearGradient>
                </defs>
                <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                  <m.path
                    id="Path-1"
                    d="M1.4,2.1c0,0,86,57,211.5,41.5s172.5-24.5,289,81"
                    stroke="url(#BG1)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1 }}
                  />

                  <path
                    d="M1.4,2.1c0,0,86,57,211.5,41.5s172.5-24.5,289,81"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeDasharray="5,12"
                  />

                  <g>
                    <polyline points="0,-9 18,0 0,9 5,0" fill="#1939B7">
                      <animateMotion
                        rotate="auto"
                        begin="1s"
                        dur="3s"
                        repeatCount="1"
                        fill="freeze"
                      >
                        <mpath href="#Path-1" />
                      </animateMotion>
                    </polyline>
                  </g>
                </g>
              </svg>
            </Box>
          </Stack>
        </Container>
      </StyledRoot>

      <m.div variants={varFade().in}>
        <Stack direction={{ xs: 'column-reverse', sm: 'column-reverse' }} sx={{ my: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h2" color="info.main">
              iTruckSea - StarLink
            </Typography>
            <Typography variant="h5" color="secondary.light" fontWeight={'500'}>
              Vệ Tinh Network
            </Typography>
            <Button
              component={NextLink}
              href={PATH_AUTH.login}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={
                <Box
                  sx={{
                    color: '#ffd500',
                    backgroundColor: '#0088ff',
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#ffd500',
                      fontSize: 14,
                      fontWeight: '700',
                    }}
                  >
                    VIP
                  </Typography>
                </Box>
              }
              sx={{
                bgcolor: 'secondary.main',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
                border: '0.5px solid #000000',
                minWidth:200,
                justifyContent:'space-evenly'
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Stack>
      </m.div>
    </>
  );
}
