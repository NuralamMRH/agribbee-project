import PropTypes from 'prop-types';
import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Stack, Button, Divider, Container,Grid, Typography, Card } from '@mui/material';
// hooks
import useResponsive from '@/hooks/useResponsive';
// routes
import { PATH_AUTH, PATH_MINIMAL_ON_STORE, PATH_PAGE } from '@/routes/paths';
// _mock_
// import { _homePlans } from '../../_mock/arrays';
// components
import SvgColor from '@/components/svg-color';
import Iconify from '@/components/iconify';
import { MotionContainer, varFade } from '@/components/animate';
import Image from '@/components/image';
import PlanCard from './PlanCard';
import { useLocales } from '@/locales';
import { height, minWidth } from '@mui/system';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme, bgColor }) => ({
  backgroundColor: bgColor || theme.palette.background.neutral,
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
  padding: theme.spacing(5, 1),
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.up('md')]: {
    boxShadow: 'none',
    width: 300,
    height: 300,
  },

  [theme.breakpoints.down('md')]: {
    boxShadow: 'none',
    minWidth: 250,
    minHeight: 250,
  },
}));


const boatShare = {
  license: 'Boat-share app',
  commons: [
    'Chành Trung chuyển giảm chi phí thời gian nguyên liệu xăng dầu.',
    'Cấp Đông hầm tàu cá tươi Chất Lượng',
    'Năng lượng iSolar an toàn thực phẩm',
  ],
  options: [
    'Boat-Share App tạo nguồn thu cho tàu cá thiếu sản lượng ',
    'QR code vận chuyển thủy bộ đảm bảo không thất lạc và truy cập xuất xứ trực tuyến.',
  ],
};

const vesselmanagement = {
  license: 'Boat-Fleet app',
  commons: [
    '⁠Camera giám sát quản lý đánh bắt.',
    '⁠Hệ thống kiểm tra lượng dầu.',
    ' Thương thuyết, đấu giá trực tuyến.',
  ],
  options: [
    '⁠Tiếp thị Chợ Nổi. ',
    ' AI-Scan IUU truy xuất nguồn gốc.',
    ' Wifi  internet Phone Vệ Tinh Low Orbit StarLink.',
  ],
  icons: [],
};

const offshoreMarket = {
  license: 'SÀN ĐẤU GIÁ CHUỖI CUNG ỨNG',
  commons: [
    'Tiếp cận nguồn cung ứng  ngoài khơi',
    'Liên kết đội tàu thu mua với tàu cá đánh bắt Ngư trường',
    'Chợ nổi Online tận gốc ngoài khơi offshore',
  ],
  options: [
    '⁠Hệ thống liên lạc Phone-WiFi-Internet Vệ tinh',
    '⁠Thương thuyết đấu giá trực tuyến',
    '⁠Vận chuyển eLogistics QR tracking',
  ],
  icons: [],
};

function HomeMoreDetails() {
     const { translate } = useLocales();
  return (
    <>
      <Stack alignItems="center" spacing={2} paddingY={10}>
        <Typography variant="h3" color="secondary.dark">
          Boat-share app
        </Typography>
        <Typography variant="h5" color="error.main" fontWeight={'500'}>
          Dịch Vụ Chành TruckSea trên biển
        </Typography>
      </Stack>

      <StyledRoot>
        <Container sx={{ height: 1, paddingY: { xs: 5 } }}>
          <Grid container sx={{ height: 1 }}>
            <Grid container item xs={12} md={6} justifyContent={'center'}>
              <m.div variants={varFade().inLeft}>
                <StyledCard
                  sx={{
                    boxShadow: (theme) => ({
                      md: `0px 10px 30px ${
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[500], 0.16)
                          : alpha(theme.palette.common.black, 0.4)
                      }`,
                    }),
                  }}
                >
                  <Image
                    src={'/assets/icons/i-truck-sea/buoy_17906108 1.svg'}
                    alt={translate('Chành Vận Chuyển Biển')}
                    sx={{
                      mx: 'auto',
                      width: 80,
                      height: 80,
                      padding: 2,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      borderRadius: 50,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ mt: 3, mb: 2, fontSize: { xs: 12, md: 14 }, fontWeight: 'bold' }}
                  >
                    {translate('Chành Vận Chuyển Biển')}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('Boat4Share Transport')}
                  </Typography>
                </StyledCard>
              </m.div>
            </Grid>
            <Grid container item xs={12} md={6} justifyContent={'flex-start'}>
              <PlanCard
                isTitleHide={true}
                plan={boatShare}
                sx={{ borderLeft: (theme) => `dashed 1px ${theme.palette.divider}` }}
              />
            </Grid>
          </Grid>
        </Container>
      </StyledRoot>

      <StyledRoot bgColor="#fafaff">
        <Container sx={{ height: 1, paddingY: { xs: 2 } }}>
          <Grid container sx={{ height: 1 }}>
            <Grid container item xs={6} md={6} justifyContent={'center'}>
              <m.div variants={varFade().inLeft}>
                <Image
                  src={'/assets/images/home/fishing-boat-image.png'}
                  sx={{
                    mx: 'auto',
                    padding: 2,
                  }}
                />
              </m.div>
            </Grid>
            <Grid container item xs={6} md={6} justifyContent={'center'}>
              <m.div variants={varFade().inRight}>
                <Image
                  src={'/assets/images/home/solarTruck-sea.png'}
                  sx={{
                    mx: 'auto',
                    padding: 2,
                  }}
                />
              </m.div>
            </Grid>
          </Grid>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h3" color="secondary.dark">
              Boat-Fleet app
            </Typography>
            <Typography variant="h5" color="error.main" fontWeight={'500'}>
              Quản Lý Đội Tàu Cá Trực Tuyến
            </Typography>
          </Stack>
        </Container>
      </StyledRoot>

      <StyledRoot bgColor="#394c6026">
        <Container sx={{ height: 1, paddingY: { xs: 5 } }}>
          <Grid container sx={{ height: 1 }}>
            <Grid container item xs={12} md={6} justifyContent={'center'}>
              <m.div variants={varFade().inLeft}>
                <StyledCard
                  sx={{
                    boxShadow: (theme) => ({
                      md: `0px 10px 30px ${
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[500], 0.16)
                          : alpha(theme.palette.common.black, 0.4)
                      }`,
                    }),
                  }}
                >
                  <Image
                    src={'/assets/icons/i-truck-sea/VesselManagement.svg'}
                    alt={translate('QUẢN LÝ TÀU')}
                    sx={{
                      mx: 'auto',
                      width: 80,
                      height: 80,
                      padding: 2,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      borderRadius: 50,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ mt: 3, mb: 2, fontSize: { xs: 12, md: 14 }, fontWeight: 'bold' }}
                  >
                    {translate('QUẢN LÝ TÀU')}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('Vessel Management')}
                  </Typography>
                </StyledCard>
              </m.div>
            </Grid>
            <Grid container item xs={12} md={6} justifyContent={'flex-start'}>
              <PlanCard
                isTitleHide={true}
                plan={vesselmanagement}
                sx={{ borderLeft: (theme) => `dashed 1px ${theme.palette.divider}` }}
              />
            </Grid>
          </Grid>
        </Container>
      </StyledRoot>

      <StyledRoot bgColor="#fafaff">
        <Container sx={{ height: 1, paddingY: { xs: 2 } }}>
          <Grid container xs={12} md={12} justifyContent={'center'}>
            <m.div variants={varFade().inLeft}>
              <Image
                src={'/assets/images/home/sea-port.png'}
                sx={{
                  mx: 'auto',
                  padding: 2,
                }}
              />
            </m.div>
          </Grid>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h3" color="secondary.dark">
              Chợ nổi thu mua
            </Typography>
            <Typography variant="h5" color="error.main" fontWeight={'500'}>
              Daily Catch Auction
            </Typography>
          </Stack>
        </Container>
      </StyledRoot>

      <StyledRoot bgColor="#394c6026">
        <Container sx={{ height: 1, paddingY: { xs: 5 } }}>
          <Grid container sx={{ height: 1 }}>
            <Grid container item xs={12} md={6} alignItems={'center'} justifyContent={'center'}>
              <m.div variants={varFade().inLeft}>
                <StyledCard
                  sx={{
                    boxShadow: (theme) => ({
                      md: `0px 10px 30px ${
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[500], 0.16)
                          : alpha(theme.palette.common.black, 0.4)
                      }`,
                    }),
                  }}
                >
                  <Image
                    src={'/assets/icons/i-truck-sea/selling_14644467.svg'}
                    alt={translate('Chợ Nổi Thu Mua')}
                    sx={{
                      mx: 'auto',
                      width: 80,
                      height: 80,
                      padding: 2,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      borderRadius: 50,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ mt: 3, mb: 2, fontSize: { xs: 12, md: 14 }, fontWeight: 'bold' }}
                  >
                    {translate('Chợ Nổi Thu Mua')}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('Procurement Offshore Market')}
                  </Typography>
                </StyledCard>
              </m.div>
            </Grid>
            <Grid container item xs={12} md={6} justifyContent={'flex-start'}>
              <PlanCard
                plan={offshoreMarket}
                sx={{ borderLeft: (theme) => `dashed 1px ${theme.palette.divider}` }}
              />
            </Grid>
          </Grid>
        </Container>
      </StyledRoot>

      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
            mb: {
              xs: 5,
              md: 10,
            },
            paddingX: {
              xs: 5,
              md: 10,
            },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Button
              color="inherit"
              size="large"
              variant="contained"
              href={PATH_AUTH.register}
              sx={{
                bgcolor: 'secondary.dark',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
                minWidth: { xs: '100%', md: 300 },
              }}
            >
              Sign Up for Free
            </Button>
          </m.div>
        </Box>
      </m.div>
    </>
  );
}

export default HomeMoreDetails