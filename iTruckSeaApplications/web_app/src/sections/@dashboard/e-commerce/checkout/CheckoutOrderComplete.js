import PropTypes from 'prop-types';
// @mui
import { Link, Button, Divider, Typography, Stack, Box } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { DialogAnimate } from '../../../../components/animate';
// assets
import { OrderCompleteIllustration } from '../../../../assets/illustrations';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { borderRadius } from '@mui/system';

// ----------------------------------------------------------------------

CheckoutOrderComplete.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  onDownloadPDF: PropTypes.func,
};

export default function CheckoutOrderComplete({ open, onReset, onDownloadPDF }) {
  const { orderInvoice } = useSelector((state) => state.storedData);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    setQrCode(
      `http://api.qrserver.com/v1/create-qr-code/?data=${
        orderInvoice?.order_invoice
      }!&size=${'100'}x${'100'}&bgcolor=${'#fff'}`
    );
  }, [orderInvoice?.order_invoice]);

  const downloadImage = () => {
    if (orderInvoice?.order_invoice) {
      const link = document.createElement('a');
      link.href = orderInvoice?.order_invoice;
      link.target = '_blank'; // Opens the link in a new tab
      link.download = link.href; // You can change the file name here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DialogAnimate
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          maxWidth: { md: 'calc(100% - 50px)' },
          maxHeight: { md: 'calc(100% - 50px)' },
          borderRadius: '20px',
        },
      }}
    >
      <Stack
        spacing={5}
        sx={{
          m: 'auto',
          maxWidth: 400,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Thank you for your Products Order!</Typography>

        <OrderCompleteIllustration sx={{ height: 160 }} />

        <Typography>
          Check your PO
          <br />
          <br />
          <Box
            id="order-rq-qrcode"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img src={qrCode} alt="" />
          </Box>
          <br />
          <br />
          We will send you a notification within 5 days when it ships.
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack
          spacing={2}
          justifyContent="space-between"
          direction={{ xs: 'column-reverse', sm: 'row' }}
        >
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Continue Shopping
          </Button>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Iconify icon="ant-design:file-pdf-filled" />}
            onClick={downloadImage}
          >
            Download as PDF
          </Button>
        </Stack>
      </Stack>
    </DialogAnimate>
  );
}

export function InvoiceQRCode({ orderInvoice }) {
  return (
    <QRCode
      size={100} // Adjust this as needed
      style={{ height: '100px', maxWidth: '100px', width: '100px' }}
      value={orderInvoice?.order_invoice || 'Invalid Invoice'}
      viewBox="0 0 100 100"
    />
  );
}
