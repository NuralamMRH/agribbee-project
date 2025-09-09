import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Button, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import LocationPermissionIcon from './LocationPermissionIcon';

const LocationEnableCheck = (props) => {
  const {
    openLocation,
    handleCloseLocation,
    isGeolocationEnabled,
    t,
    coords,
    handleAgreeLocation,
  } = props;
  return (
    <Dialog
      open={openLocation}
      onClose={handleCloseLocation}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        {!isGeolocationEnabled && (
          <Stack
            gap="10px"
            alignItems="center"
            maxWidth="500px"
            textAlign="center"
            padding={{ xs: '0 10px', sm: '0 40px', md: '0 60px' }}
          >
            <LocationPermissionIcon />
            <Typography fontSize={{ xs: '12px', sm: '14px', md: '16px' }} fontWeight={500}>
              {t('Please allow browser location permission')}
            </Typography>

            <Typography fontSize="12px">
              {t(
                'Your browser location track permission is off. Please turn on the location permission to detect current location'
              )}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Stack alignItems="center" justifyContent="center" paddingBottom="35px">
          {coords ? (
            <Button variant="contained" onClick={() => handleAgreeLocation()}>
              {t('Agree')}
            </Button>
          ) : (
            <Button onClick={() => handleCloseLocation()} variant="contained">
              {t('Okay')}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

LocationEnableCheck.propTypes = {};

export default LocationEnableCheck;
