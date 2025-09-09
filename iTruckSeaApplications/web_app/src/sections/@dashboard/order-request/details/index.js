import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Scrollbar from '../../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import { useQuery } from 'react-query';
import { OrderRequestApi } from 'src/hooks/react-query/config/orderRequestApi';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import extractTextFromHtml from 'src/utils/extractTextFromHtml';
import { useAuthContext } from 'src/auth/useAuthContext';
import useCopyToClipboard from 'src/hooks/useCopyToClipboard';
import useDoubleClick from 'src/hooks/useDoubleClick';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  viewQr: PropTypes.string,
};

export default function InvoiceDetails({ viewQr }) {
  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();
  const { user } = useAuthContext();
  const showErrorMessage = () => {
    enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
  };

  const {
    isLoading,
    data: invoice,
    isError,
    error,
    refetch: refetchOrderDetails,
  } = useQuery(['order-details', viewQr], () => OrderRequestApi.orderDetails(viewQr), {
    onError: showErrorMessage,
  });

  useEffect(() => {
    refetchOrderDetails();
  }, []);

  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    setQrCodeImage(
      `http://api.qrserver.com/v1/create-qr-code/?data=${
        invoice?.data?.qrCode
      }!&size=${'500'}x${'500'}&bgcolor=${'#fff'}`
    );
  }, [invoice?.data?.qrCode]);

  const downloadImage = () => {
    if (invoice?.data?.order_invoice) {
      const link = document.createElement('a');
      link.href = invoice?.data?.order_invoice;
      link.target = '_blank'; // Opens the link in a new tab
      link.download = link.href; // You can change the file name here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onCopy = (text) => {
    if (text) {
      enqueueSnackbar('Copied!');
      copy(text);
    }
  };

  const handleClick = useDoubleClick({
    doubleClick: () => onCopy(invoice?.data?.qrCode),
  });

  console.log('Order: ', invoice);

  return (
    <>
      {/* <InvoiceToolbar invoice={invoice} /> */}

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image
              onClick={handleClick}
              disabledEffect
              alt="logo"
              src={qrCodeImage}
              sx={{ maxWidth: 120, cursor: 'pointer' }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant="soft"
                color={
                  (invoice?.data?.payment_status === 'paid' && 'success') ||
                  (invoice?.data?.payment_status === 'unpaid' && 'warning') ||
                  (invoice?.data?.payment_status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {invoice?.data?.payment_status}
              </Label>

              <Typography
                onClick={handleClick}
                variant="h6"
              >{`#${invoice?.data?.qrCode}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {user.id == invoice?.data?.buyer_id ? 'My details' : ' Buyer details'}
            </Typography>

            <Typography variant="body2">
              {invoice?.data?.shipping_address?.contact_person_name}
            </Typography>

            <Typography textTransform={'capitalize'} variant="body2">{`${
              invoice?.data?.shipping_address?.address_type &&
              invoice?.data?.shipping_address?.address_type + ' '
            }address: ${invoice?.data?.shipping_address?.address}`}</Typography>

            <Typography variant="body2">
              Phone: {invoice?.data?.shipping_address?.contact_person_number}
            </Typography>
          </Grid>
          {user.id == invoice?.data?.buyer_id ? (
            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Seller details
              </Typography>

              <Typography variant="body2">{invoice?.data?.seller?.name}</Typography>

              <Typography variant="body2">{''}</Typography>

              <Typography variant="body2">Phone: {''}</Typography>
            </Grid>
          ) : (
            ''
          )}

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              date create
            </Typography>

            <Typography variant="body2">{fDate(invoice?.data?.createdAt)}</Typography>
          </Grid>
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Description</TableCell>

                  <TableCell align="left">Qty</TableCell>

                  <TableCell align="right">Unit price</TableCell>

                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invoice?.data?.orderItems?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.product?.vi.name}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {extractTextFromHtml(row.product?.vi.description)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="left">{row?.quantity}</TableCell>

                    <TableCell align="right">{fCurrency(row?.price)}</TableCell>

                    <TableCell align="right">{fCurrency(row?.price * row?.quantity)}</TableCell>
                  </TableRow>
                ))}

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    Subtotal
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    {fCurrency(invoice?.data?.itemsPrice)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Discount
                  </TableCell>

                  <TableCell
                    align="right"
                    width={120}
                    sx={{ color: 'error.main', typography: 'body1' }}
                  >
                    {invoice?.data?.discount ? fCurrency(-invoice?.data?.discount) : 0}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Taxes
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {invoice?.data?.taxes ? fCurrency(invoice?.data?.taxes) : 0}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Total
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(invoice?.data?.totalPrice)}
                  </TableCell>
                </StyledRowResult>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>

            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>

            <Typography variant="body2">support@agribbee.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
