import PropTypes from 'prop-types';
import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Tab, Tabs, Stack, Button, Divider, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_AUTH, PATH_MINIMAL_ON_STORE, PATH_PAGE } from '../../routes/paths';
// _mock_
// import { _homePlans } from '../../_mock/arrays';
// components
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import { varFade, MotionViewport } from '../../components/animate';
import PlanCard from './PlanCard';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

export const _homePlans = [
  {
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
  },
  {
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
    icons: [],
  },
  {
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
  },
];

// ----------------------------------------------------------------------

export default function HomePricingPlans() {
  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        {/* <Description /> */}
        <Content />
      </Container>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

function Description() {
  return (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
          pricing plans
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
          The right plan for <br /> your business
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
          Choose the perfect plan for your needs. Always flexible to grow
        </Typography>
      </m.div>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Content() {
  const isDesktop = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('Standard');

  const desktopList = () => (
    <Box
      display="grid"
      gridTemplateColumns={isDesktop ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
      sx={{ borderRadius: 2, border: (theme) => `dashed 1px ${theme.palette.divider}` }}
    >
      {_homePlans.map((plan) => (
        <m.div key={plan.license} variants={varFade().in}>
          <PlanCard key={plan.license} plan={plan} />
        </m.div>
      ))}
    </Box>
  );

  const mobileList = (
    <>
      <Stack alignItems="center" sx={{ mb: 5 }}>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {_homePlans.map((tab) => (
            <Tab key={tab.license} value={tab.license} label={tab.license} />
          ))}
        </Tabs>
      </Stack>

      <Box
        sx={{
          borderRadius: 2,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {_homePlans.map(
          (tab) =>
            tab.license === currentTab && (
              <PlanCard
                key={tab.license}
                plan={tab}
                sx={{ borderLeft: (theme) => `dashed 1px ${theme.palette.divider}` }}
              />
            )
        )}
      </Box>
    </>
  );

  return (
    <>
      {desktopList()}

      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >
          {/* <m.div variants={varFade().inDown}>
            <Typography variant="h4">Still have questions?</Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
              Please describe your case to receive the most accurate advice.
            </Typography>
          </m.div> */}

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

// ----------------------------------------------------------------------

