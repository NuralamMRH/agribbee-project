import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../_mock/arrays';
// components
import Iconify from '../../../../components/iconify';
//
import InvoiceAddressListDialog from './InvoiceAddressListDialog';
import { useQuery } from 'react-query';
import { AddressApi } from 'src/hooks/react-query/config/addressApi';
import { CheckoutBillingNewAddressForm } from '../../e-commerce/checkout';

// ----------------------------------------------------------------------

InvoiceNewEditAddress.propTypes = {
  orderDetails: PropTypes.object,
};
export default function InvoiceNewEditAddress({ orderDetails }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { exportFrom, invoiceTo } = values;

  const [openFrom, setOpenFrom] = useState(false);
  const [openNewAddressDialog, setOpenNewAddressDialog] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const handleOpenFrom = () => {
    setOpenFrom(true);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  const handleOpenNewAddressDialog = () => {
    setOpenFrom(false);
    setOpenNewAddressDialog(true);
  };

  const handleCloseNewAddressDialog = () => {
    setOpenNewAddressDialog(false);
    setOpenFrom(true);
  };

  const handleOpenTo = () => {
    setOpenTo(true);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

  const {
    data: addressData,
    isError,
    error,
    refetch: fetchAddress,
  } = useQuery(['addressList'], AddressApi.addressList, {
    onError: (err) => {
      console.error(`Error: ${err}!`);
    },
  });

  useEffect(() => {
    if (!addressData?.data?.addresses?.length) {
      fetchAddress();
    }

    console.log('address list:', addressData?.data?.addresses);
  }, [addressData?.data?.addresses]);

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            From:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={handleOpenFrom}
          >
            {exportFrom ? 'Change' : 'Add'}
          </Button>

          <InvoiceAddressListDialog
            open={openFrom}
            onClose={handleCloseFrom}
            selected={(selectedId) => exportFrom?._id === selectedId}
            onSelect={(address) => setValue('exportFrom', address)}
            addressOptions={addressData?.data?.addresses}
            handleOpenNewAddressForm={handleOpenNewAddressDialog}
          />
        </Stack>

        <AddressInfo {...exportFrom} />
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            To:
          </Typography>
        </Stack>

        <AddressInfo {...orderDetails?.shipping_address} />
      </Stack>
      <CheckoutBillingNewAddressForm
        open={openNewAddressDialog}
        onClose={handleCloseNewAddressDialog}
        onCreateBilling={fetchAddress}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
  address_type: PropTypes.string,
  floor: PropTypes.string,
  house: PropTypes.string,
  road: PropTypes.string,
  street: PropTypes.string,
  address: PropTypes.string,
  zip: PropTypes.string,
  city: PropTypes.objectOf(PropTypes.string),
  region: PropTypes.objectOf(PropTypes.string),
  country: PropTypes.objectOf(PropTypes.string),
  contact_person_email: PropTypes.string,
  contact_person_number: PropTypes.string,
  contact_person_name: PropTypes.string,
};

export function AddressInfo({
  address_type,
  contact_person_name,
  address,
  contact_person_number,
  contact_person_email,
  region,
  zip,
}) {
  return (
    <>
      <Typography variant="subtitle2">{address_type}</Typography>
      <Typography variant="body2">{contact_person_name}</Typography>
      <Typography variant="body2">{contact_person_email}</Typography>
      <Typography variant="body2">{contact_person_number}</Typography>
      <Typography variant="body2">{region.vi?.name || region.name}</Typography>
      <Typography
        variant="caption"
        component="div"
        sx={{
          my: 0.5,
          color: 'info.main',
          fontWeight: 'fontWeightMedium',
        }}
      >
        {zip ? `Zip Code: ${zip}` : ''}
      </Typography>

      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {address}
      </Typography>
    </>
  );
}
