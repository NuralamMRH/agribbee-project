import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSelector } from 'react-redux';
import { SingleFilePreview } from 'src/components/upload';
import { borderRadius } from '@mui/system';
import { AuctionCountdown } from 'src/utils/AuctionCountdown';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    name,
    image,
    createdAt,
    starting_time,
    ending_time,
    shipping_start_date,
    shipping_end_date,
    auction_type,
    current_bid_price,
    starting_bid_price,
  } = row;

  const { global } = useSelector((state) => state.globalSettings);

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

  let language;
  if (typeof window !== 'undefined') {
    language = localStorage.getItem('i18nextLng');
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SingleFilePreview
              autoPlay
              controllers={false}
              muted={true}
              loop={true}
              file={`${global?.base_urls?.product_image_path}/${image || row?.product?.image}`}
              sx={{
                borderRadius: 1.5,
                width: 48,
                height: 48,
                position: 'relative !important',
                backgroundColor: '#eee',
                borderRadius: 1,
                objectFit: 'cover',
                overflow: 'hidden',
              }}
            />

            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {name}
            </Link>
          </Stack>
        </TableCell>
        <TableCell>
          <Label variant="soft" color={'success'} sx={{ textTransform: 'capitalize' }}>
            <AuctionCountdown
              auctionStartTime={starting_time || createdAt}
              auctionEndTime={ending_time}
              isHelpText="Start at"
              isEndText="End"
            />
          </Label>
        </TableCell>
        <TableCell>
          <Label variant="soft" color={'warning'} sx={{ textTransform: 'capitalize' }}>
            {shipping_start_date && shipping_end_date ? (
              <AuctionCountdown
                auctionStartTime={shipping_start_date || ending_time}
                auctionEndTime={shipping_end_date}
                isHelpText="Shipping Date"
                isEndText="Shipped"
              />
            ) : (
              '/'
            )}
          </Label>
        </TableCell>

        <TableCell>{row?.category?.name}</TableCell>
        <TableCell>
          <Label variant="soft" color={'success'} sx={{ textTransform: 'capitalize' }}>
            {row?.warehouse?.zip}
          </Label>
        </TableCell>

        <TableCell align="start">
          <Label variant="soft" color={'success'} sx={{ textTransform: 'capitalize' }}>
            {auction_type ? sentenceCase(auction_type) : ''}
          </Label>
        </TableCell>

        <TableCell align="right">
          {current_bid_price ? 'Bid' + fCurrency(current_bid_price) : fCurrency(starting_bid_price)}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
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
