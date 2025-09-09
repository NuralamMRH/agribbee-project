import { m, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Card } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_FIGMA_PREVIEW, PATH_FREE_VERSION } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { textGradient, bgGradient } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// theme
import { secondaryFont } from '../../theme/typography';
// components
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import { MotionContainer, varFade } from '../../components/animate';
import Image from '@/components/image';
import { useLocales } from '@/locales';
import { borderRadius, height, padding, width } from '@mui/system';
import PlanCard from './PlanCard';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: '/assets/icons/i-truck-sea/Requesttodock.svg',
    title: 'YÊU CẦU CẬP CẢNG',
    description: 'Request to dock',
  },
  {
    icon: '/assets/icons/i-truck-sea/FishingLogbook.svg',
    title: 'NHẬT KÝ KHAI THÁC',
    description: 'Fishing Logbook',
  },
  {
    icon: '/assets/icons/i-truck-sea/VesselManagement.svg',
    title: 'QUẢN LÝ TÀU',
    description: 'Vessel Management',
  },
  {
    icon: '/assets/icons/i-truck-sea/SeafoodProcessingFactory.svg',
    title: 'NHÀ MÁY CHẾ BIẾN THỦY SẢN',
    description: 'Seafood Processing Factory',
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  padding: theme.spacing(2, 1),
  [theme.breakpoints.up('md')]: {
    boxShadow: 'none',
    padding: theme.spacing(4, 1),
  },
  [theme.breakpoints.only('sm')]: {
    width:300,
    height:300,
  },
}));

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 100,
    left: 0,
    paddingBottom:100,
    width: '100%',
    alignItems: 'center',
  },
}));

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(5, 0),
  height: '100%',
}));

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: secondaryFont.style.fontFamily,
  fontSize: `${64 / 55}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 55}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 180,
  height: 180,
  top: -80,
  right: -80,
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 100,
  bottom: -100,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
}));

// ----------------------------------------------------------------------


const marineCaptured = {
  license: 'Marine Captured Tracebility',
  commons: [
    'Truy xuất nguồn gốc.',
    'Block Chain Code truy xuất đánh bắt Ngư Trường đến bàn ăn.',
    'Cân đối số lượng đánh bắt tiêu chuẩn iUU.',
  ],
  options: [
    'Hồ sơ iUU trực tuyến & lưu trử online.',
    'AI. Scan định dạng Cá Species và GPS tận gốc.',
    'Mạng lưới StarLink vệ tinh viễn thông Offshore.',
  ],
  icons: [
    '/assets/icons/platforms/ic_sketch.svg',
    '/assets/icons/platforms/ic_figma.svg',
    '/assets/icons/platforms/ic_js.svg',
    '/assets/icons/platforms/ic_ts.svg',
  ],
};

export default function Home4Block() {
  const isDesktop = useResponsive('up', 'md');
   const theme = useTheme();
      const isTab= theme.breakpoints.only("sm");

          console.log('isTab: ', isTab);

  const { translate } = useLocales();

  return (
    <>
      <StyledRoot>
        <Container sx={{ height: 1, paddingY: { xs: 5 } }}>
          <Grid container sx={{ height: 1 }}>
            <Grid item xs={12} md={12}>
              <Description />
            </Grid>

            <Grid container item xs={12} md={6} justifyContent={'center'}>
              <Box
                gap={{ xs: 1, lg: 2 }}
                display="grid"
                alignItems="center"
                justifyContent={'center'}
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ position: 'relative' }}
              >
                <Box
                  sx={{
                    backgroundColor: '#ffffff',
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
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
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      fontSize: 14,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    VMS
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    IUU Port Authority
                  </Typography>
                </Box>
                {CARDS.map((card, index) => (
                  <m.div variants={varFade().inUp} key={card.title}>
                    <StyledCard
                      sx={{
                        boxShadow: (theme) => ({
                          md: `0px 10px 30px ${
                            theme.palette.mode === 'light'
                              ? alpha(theme.palette.grey[500], 0.16)
                              : alpha(theme.palette.common.black, 0.4)
                          }`,
                        }),
                        minHeight: { xs: 175 },
                      }}
                    >
                      <Image
                        src={card.icon}
                        alt={translate(card.title)}
                        sx={{
                          mx: 'auto',
                          width: { xs: 60, md: 80 },
                          height: { xs: 60, md: 80 },
                          padding: { xs: 1, md: 2 },
                          backgroundColor: (theme) => theme.palette.primary.main,
                          borderRadius: 50,
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          mt: { xs: 1, md: 3 },
                          mb: { xs: 1, md: 2 },
                          fontSize: { xs: 11, md: 14 },
                          fontWeight: 'bold',
                        }}
                      >
                        {translate(card.title)}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: 10, md: 12 }, color: 'text.secondary' }}
                      >
                        {translate(card.description)}
                      </Typography>
                    </StyledCard>
                  </m.div>
                ))}
              </Box>
            </Grid>
            <Grid container item xs={12} md={6} justifyContent={'flex-start'}>
              <PlanCard
                plan={marineCaptured}
                sx={{ borderLeft: (theme) => `dashed 1px ${theme.palette.divider}` }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* <StyledEllipseTop /> */}

        {/* <StyledEllipseBottom /> */}
      </StyledRoot>

      {/* <Box sx={{ height: { md: '50vh' } }} /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function Description() {
  return (
    <StyledDescription>
      {/* <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ my: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.root}
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
                bgcolor: 'primary.main',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Stack>
      </m.div> */}

      <m.div variants={varFade().in}>
        <Typography variant="h3" sx={{ textAlign: 'center', textTransform:'uppercase' }}>
          Truy Xuất Nguồn Gốc
        </Typography>
      </m.div>
    </StyledDescription>
  );
}
