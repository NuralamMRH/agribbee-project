import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Stack,
  Avatar,
  MenuItem,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
// _mock

import SearchNotFound from '../../../../components/search-not-found';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import { CustomTextField } from 'src/components/custom-input';
import { useDispatch, useSelector } from 'react-redux';
import { setSourcer } from 'src/redux/slices/storedData';
import { setSourcerCheckout, setSourcerCheckoutId, setSourcerName } from 'src/redux/slices/product';

// ----------------------------------------------------------------------

SourcerList.propTypes = {
  sourcers: PropTypes.array,
  onSearchSourcers: PropTypes.func,
  searchSourcers: PropTypes.string,
};

export default function SourcerList({ sourcers, searchSourcers, onSearchSourcers }) {
  const dataFiltered = applyFilter(sourcers, searchSourcers);

  const isNotFound = !dataFiltered.length && !!searchSourcers;

  return (
    <>
      <Stack
        spacing={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ my: 5 }}
      >
        <Typography variant="h4">Sourcers</Typography>

        <CustomTextField
          width={220}
          size="small"
          value={searchSourcers}
          onChange={onSearchSourcers}
          placeholder="Search sourcers..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {isNotFound ? (
        <SearchNotFound query={searchSourcers} sx={{ mt: 10 }} />
      ) : (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {dataFiltered.map((sourcer) => (
            <SourcerCard key={sourcer._id} sourcer={sourcer} />
          ))}
        </Box>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

SourcerCard.propTypes = {
  sourcer: PropTypes.object,
};

function SourcerCard({ sourcer }) {
  const { name, role, image } = sourcer;
  const { global } = useSelector((state) => state.globalSettings);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDelete = () => {
    handleClosePopover();
    console.log('DELETE', sourcer);
  };

  const dispatch = useDispatch();
  const handleSetSourcer = (sour) => {
    dispatch(setSourcer(sour));

    dispatch(setSourcerCheckout(sour));
    dispatch(setSourcerCheckoutId(sour?._id));
    dispatch(setSourcerName(sour?.name));
  };

  return (
    <>
      <Card
        sx={{
          py: 5,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => handleSetSourcer(sourcer)}
      >
        <Avatar
          alt={name}
          src={`${global?.base_urls?.seller_image_path}/${image}`}
          sx={{ width: 64, height: 64, mb: 3 }}
        />

        <Link variant="subtitle1" color="text.primary">
          {name}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, mt: 0.5 }}>
          {role}
        </Typography>

        <IconButton
          color={openPopover ? 'inherit' : 'default'}
          onClick={handleOpenPopover}
          sx={{ top: 8, right: 8, position: 'absolute' }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Card>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Hide
        </MenuItem>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(inputData, query) {
  if (query) {
    return inputData.filter(
      (sourcer) => sourcer.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
