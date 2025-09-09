import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Button, CardContent, Typography } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// components
import Image from '../../../../components/image';
import Carousel, { CarouselDots } from '../../../../components/carousel';
import { useSelector } from 'react-redux';
import { SingleFilePreview } from 'src/components/upload';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  ...bgGradient({
    startColor: `${alpha(theme.palette.common.black, 0)} 0%`,
    endColor: `${theme.palette.common.black} 75%`,
  }),
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
}));

// ----------------------------------------------------------------------

EcommerceNewProducts.propTypes = {
  list: PropTypes.array,
};

export default function EcommerceNewProducts({ list, ...other }) {
  const theme = useTheme();

  const carouselSettings = {
    speed: 1000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({
      sx: {
        right: 24,
        bottom: 24,
        position: 'absolute',
      },
    }),
  };

  return (
    <Card {...other}>
      <Carousel {...carouselSettings}>
        {list.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
};

function CarouselItem({ item }) {
  const { image, name } = item;
  const { global } = useSelector((state) => state.globalSettings);
  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        sx={{
          left: 0,
          bottom: 0,
          zIndex: 9,
          maxWidth: '80%',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>

        <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
          {name}
        </Typography>

        <Button variant="contained">View</Button>
      </CardContent>

      <StyledOverlay />

      <SingleFilePreview
        autoPlay
        controllers={false}
        muted={true}
        alt={name}
        loop={true}
        file={`${global?.base_urls?.product_image_path}/${image}`}
        sx={{
          borderRadius: 1.5,
          height: { xs: 280, xl: 320 },
          position: 'relative !important',
          backgroundColor: '#eee',
          borderRadius: 1,
          objectFit: 'cover',
          overflow: 'hidden',
          padding: '0px',
        }}
      />
    </Box>
  );
}
