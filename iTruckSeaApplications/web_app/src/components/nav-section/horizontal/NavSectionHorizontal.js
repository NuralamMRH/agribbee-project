import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
// utils
import { hideScrollbarY } from '../../../utils/cssStyles';
//
import NavList from './NavList';

// ----------------------------------------------------------------------

NavSectionHorizontal.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
  appStyle: PropTypes.bool,
  isOffset: PropTypes.bool,
};

function NavSectionHorizontal({ appStyle, data, isOffset, sx, ...other }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        // mx: 'auto',
        ...hideScrollbarY,
        ...sx,
      }}
      {...other}
    >
      {data.map((group, groupIndex) => (
        <Items
          appStyle={appStyle}
          key={`nav-group-${groupIndex}-${group.subheader}`}
          items={group.items}
          isOffset={isOffset}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

// ----------------------------------------------------------------------

Items.propTypes = {
  items: PropTypes.array,
  appStyle: PropTypes.bool,
  isOffset: PropTypes.bool,
};

function Items({ appStyle, items, isOffset }) {
  return (
    <>
      {items.map((list, index) => (
        <NavList
          appStyle={appStyle}
          key={`nav-item-${index}-${list.title}-${list.path}`}
          data={list}
          depth={1}
          hasChild={!!list.children}
          isOffset={isOffset}
        />
      ))}
    </>
  );
}
