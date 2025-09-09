import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Link,
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  key: PropTypes.string,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const {
    shipping_address,
    orderItems,
    payment_status,
    order_req_status,
    buyer,
    totalPrice,
    createdAt,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={buyer?.name} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {buyer?.name}
              </Typography>

              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {`zip: ${shipping_address?.zip}, ${shipping_address?.address}`}
              </Link>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{fDate(createdAt)}</TableCell>

        <TableCell align="left">{orderItems?.length > 0 ? orderItems.length : '0'}</TableCell>

        <TableCell align="center">{fCurrency(totalPrice)}</TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {`#${row?.qrCode}`}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (payment_status === 'paid' && 'success') ||
              (payment_status === 'unpaid' && 'warning') ||
              (payment_status === 'overdue' && 'error') ||
              'default'
            }
          >
            {payment_status}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (order_req_status === 'accepted' && 'success') ||
              (order_req_status === 'pending' && 'warning') ||
              (order_req_status === 'canceled' && 'error') ||
              'default'
            }
          >
            {order_req_status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Accept
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
