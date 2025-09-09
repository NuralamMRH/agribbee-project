import React, { useEffect, useState } from 'react';
import {
  alpha,
  Autocomplete,
  Button,
  CircularProgress,
  circularProgressClasses,
  IconButton,
  NoSsr,
  Stack,
  Typography,
} from '@mui/material';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Box } from '@mui/system';

export function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={25}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => theme.palette.primary.main,
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={25}
        thickness={4}
        {...props}
      />
    </Box>
  );
}
