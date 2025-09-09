import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Grid, Card, Button, Typography, Stack, Box } from '@mui/material';
// _mock
import { _addressBooks } from '../../../../../_mock/arrays';
// components
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
//
import CheckoutSummary from '../CheckoutSummary';
import CheckoutBillingNewAddressForm from './CheckoutBillingNewAddressForm';
import { useMutation, useQuery } from 'react-query';
import { AddressApi } from 'src/hooks/react-query/config/addressApi';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

CheckoutBillingAddress.propTypes = {
  checkout: PropTypes.object,
  onBackStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function CheckoutBillingAddress({ checkout, onBackStep, onCreateBilling }) {
  const { total, discount, subtotal } = checkout;
  const [openConfirm, setOpenConfirm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isError, error, refetch } = useQuery(['address-list'], AddressApi.addressList, {
    onError: (err) => {
      enqueueSnackbar(`${err}!`, 'error');
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { mutate: deleteMutation } = useMutation(AddressApi.deleteAddress, {
    onSuccess: () => {
      handleCloseConfirm();
      enqueueSnackbar(`Address removed successfully`, 'success');
      refetch();
    },
    onError: (err) => {
      enqueueSnackbar(`${err}!`, 'error');
    },
  });
  const deleteAddress = (addressId) => {
    deleteMutation(addressId);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {data?.data?.addresses.map((addressData, index) => (
            <AddressItem
              key={index}
              addressData={addressData}
              onCreateBilling={() => onCreateBilling(addressData)}
              openConfirm={openConfirm}
              handleOpenConfirm={handleOpenConfirm}
              handleCloseConfirm={handleCloseConfirm}
              handleDeleteRows={deleteAddress}
            />
          ))}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              variant="soft"
              onClick={handleOpen}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add new address
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
        </Grid>
      </Grid>

      <CheckoutBillingNewAddressForm open={open} onClose={handleClose} onCreateBilling={refetch} />
    </>
  );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  addressData: PropTypes.object,
  onCreateBilling: PropTypes.func,
  openConfirm: PropTypes.bool,
  handleOpenConfirm: PropTypes.func,
  handleCloseConfirm: PropTypes.func,
  handleDeleteRows: PropTypes.func,
};

function AddressItem({
  addressData,
  onCreateBilling,
  openConfirm,
  handleCloseConfirm,
  handleOpenConfirm,
  handleDeleteRows,
}) {
  const { address, address_type, contact_person_number, zip, isDefault } = addressData;

  return (
    <Card
      sx={{
        p: 3,
        mb: 3,
      }}
    >
      <Stack
        spacing={2}
        alignItems={{
          md: 'flex-end',
        }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1">
              {addressData?.contact_person_name || addressData?.address_type}
              <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
                {address_type}
              </Box>
            </Typography>

            <Label color="info" sx={{ ml: 1 }}>
              Zip: {zip}
            </Label>

            {isDefault && (
              <Label color="info" sx={{ ml: 1 }}>
                Default
              </Label>
            )}
          </Stack>

          <Typography variant="body2">{address}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {contact_person_number}
          </Typography>
        </Stack>

        <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
          {!isDefault && (
            <Button
              onClick={handleOpenConfirm}
              variant="outlined"
              size="small"
              color="inherit"
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
          )}

          <Button variant="outlined" size="small" onClick={onCreateBilling}>
            {`Deliver to ${addressData?.address_type || addressData?.contact_person_name} Address`}
          </Button>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
            <strong> {addressData?.contact_person_name || addressData?.address_type} </strong>{' '}
            address?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(addressData?._id);
            }}
          >
            Delete
          </Button>
        }
      />
    </Card>
  );
}
