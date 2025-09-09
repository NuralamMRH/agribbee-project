import PropTypes from 'prop-types';
// @mui
import {
  Link,
  Button,
  Divider,
  Typography,
  Stack,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
} from '@mui/material';
// components
// assets
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { borderRadius } from '@mui/system';
import Iconify from '@/components/iconify';
import { OrderCompleteIllustration } from '@/assets/illustrations';
import { DialogAnimate } from '@/components/animate';

// ----------------------------------------------------------------------

VesselCreatedComplete.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  onDownloadPDF: PropTypes.func,
  setOpen: PropTypes.func,
  vesselId: PropTypes.string,
};

export default function VesselCreatedComplete({ open, setOpen, onReset, onDownloadPDF, vesselId }) {
  const { orderInvoice } = useSelector((state) => state.storedData);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    if (vesselId) {
      setQrCode(
        `http://api.qrserver.com/v1/create-qr-code/?data=${vesselId}&size=100x100&bgcolor=#fff`
      );
    }
  }, [vesselId]);

  const downloadImage = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.target = '_blank';
      link.download = `vessel-${vesselId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [fullWidth, setFullWidth] = useState(true);

  const [maxWidth, setMaxWidth] = useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <>
      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle textAlign={'center'}>Thank you for your vessel registration!</DialogTitle>
        <DialogContent>
          <Stack
            spacing={5}
            sx={{
              m: 'auto',
              textAlign: 'center',
              px: { xs: 2, md: 5 },
            }}
          >
            {/* <OrderCompleteIllustration sx={{ height: 100 }} /> */}

            <Box
              id="order-rq-qrcode"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {qrCode && <img src={qrCode} alt="Vessel QR Code" />}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} justifyContent="space-between" direction={'row'}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="ant-design:file-pdf-filled" />}
              onClick={downloadImage}
            >
              Download QR Code
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={onReset}
              endIcon={<Iconify icon="iconamoon:send-fill" />}
            >
              Continue
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
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
