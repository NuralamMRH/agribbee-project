import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  Stack,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  Box,
  styled,
} from '@mui/material';
import { fCurrency } from 'src/utils/formatNumber';
import extractTextFromHtml from 'src/utils/extractTextFromHtml';
import Scrollbar from 'src/components/scrollbar/Scrollbar';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));
const ItemsTableList = ({ orderDetails }) => {
  return (
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
            {orderDetails?.orderItems?.map((row, index) => (
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
                {fCurrency(orderDetails?.itemsPrice)}
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
                {orderDetails?.discount ? fCurrency(-orderDetails?.discount) : 0}
              </TableCell>
            </StyledRowResult>

            <StyledRowResult>
              <TableCell colSpan={3} />

              <TableCell align="right" sx={{ typography: 'body1' }}>
                Taxes
              </TableCell>

              <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                {orderDetails?.taxes ? fCurrency(orderDetails?.taxes) : 0}
              </TableCell>
            </StyledRowResult>

            <StyledRowResult>
              <TableCell colSpan={3} />

              <TableCell align="right" sx={{ typography: 'h6' }}>
                Total
              </TableCell>

              <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                {fCurrency(orderDetails?.totalPrice)}
              </TableCell>
            </StyledRowResult>
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

ItemsTableList.propTypes = {};

export default ItemsTableList;
