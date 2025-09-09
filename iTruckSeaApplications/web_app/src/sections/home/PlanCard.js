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


PlanCard.propTypes = {
  sx: PropTypes.object,
  plan: PropTypes.shape({
    license: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.string),
    commons: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default function PlanCard({ plan, sx, isTitleHide, ...other }) {
  const { license, commons, options, icons } = plan;

  const standard = license === 'Standard';

  const plus = license === 'Standard Plus';

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        pt: !isTitleHide ? 10 : 5,
        alignItems: 'center',
        ...(plus && {
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...sx,
        }),
      }}
      {...other}
    >
      {!isTitleHide && (
        <Stack spacing={2}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h4" color="secondary.dark" textTransform={'uppercase'}>
              {license}
            </Typography>
            <Typography variant="body2" color="error.main">
              {license === 'Boat-share app'
                ? 'Dịch Vụ Chành TruckSea trên biển'
                : license === 'Boat-Fleet app'
                ? 'Quản Lý Đội Tàu Cá Trực Tuyến'
                : ''}
            </Typography>

            <Box
              sx={{
                left: 0,
                bottom: 4,
                width: 40,
                height: 8,
                opacity: 0.48,
                bgcolor: 'error.main',
                position: 'absolute',
                ...(standard && { bgcolor: 'primary.main' }),
                ...(plus && { bgcolor: 'warning.main' }),
              }}
            />
          </Box>
        </Stack>
      )}

      {/* {standard ? (
        <SvgColor src={icons[2]} sx={{ width: 24, height: 24 }} />
      ) : (
        <Stack direction="row" spacing={2}>
          {icons.map((icon) => (
            <SvgColor key={icon} src={icon} sx={{ width: 24, height: 24 }} />
          ))}
        </Stack>
      )} */}

      <Stack spacing={2.5}>
        {commons.map((option) => (
          <Stack key={option} spacing={1} direction="row" alignItems="center">
            <Iconify icon="ph:boat-duotone" minWidth={16} width={16} />
            <Typography variant="body2">{option}</Typography>
          </Stack>
        ))}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {options.map((option, optionIndex) => {
          const disabled =
            (standard && optionIndex === 1) ||
            (standard && optionIndex === 2) ||
            (standard && optionIndex === 3) ||
            (plus && optionIndex === 3);

          return (
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(disabled && { color: 'text.disabled' }),
              }}
              key={option}
            >
              <Iconify
                icon={disabled ? 'eva:close-fill' : 'ph:boat-duotone'}
                minWidth={16}
                width={16}
              />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          );
        })}
      </Stack>

      {/* <Stack alignItems="flex-end">
        <Button
          color="inherit"
          size="small"
          target="_blank"
          rel="noopener"
          href={PATH_PAGE.faqs}
          endIcon={<Iconify icon="eva:chevron-right-fill" />}
        >
          Learn more
        </Button>
      </Stack> */}
    </Stack>
  );
}
