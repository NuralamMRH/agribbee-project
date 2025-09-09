import PropTypes from 'prop-types';
// @mui
import { Card, Button, Typography, CardHeader, CardContent } from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};

export default function CheckoutBillingInfo({ billing, onBackStep }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Shipping To"
        action={
          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onBackStep}>
            Edit
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {billing?.contact_person_name || billing?.address_label || billing?.address_type}&nbsp;
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            ({billing?.address_type || billing?.zip})
          </Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          {billing?.address}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {billing?.contact_person_number}
        </Typography>
      </CardContent>
    </Card>
  );
}
