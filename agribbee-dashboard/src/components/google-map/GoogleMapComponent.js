import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, CircularProgress, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { UilMapMarkerEdit } from '@iconscout/react-unicons';
import Skeleton from '@mui/material/Skeleton';
import MapMarker from './MapMarker';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconWrapper, grayscaleMapStyles } from './Map.style';
import { useSelector } from 'react-redux';

const GoogleMapComponent = ({
  setDisablePickButton,
  setLocationEnabled,
  setLocation,
  setCurrentLocation,
  locationLoading,
  location,
  setPlaceDetailsEnabled,
  placeDetailsEnabled,
  locationEnabled,
  setPlaceDescription,
  height,
  isGps,
  markets,
  marketId,
  handleOnClickMapMarket,
  isMapButtonHide,
  newZoom,
}) => {
  const theme = useTheme();
  const { global } = useSelector((state) => state.globalSettings);
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const containerStyle = {
    width: '100%',
    height: height ? height : isSmall ? '350px' : '400px',
    borderRadius: '10px',
    border: `1px solid ${theme.palette.neutral[300]}`,
  };

  const mapRef = useRef(GoogleMap);
  const center = useMemo(
    () => ({
      lat: location?.lat ? parseFloat(location.lat) : 0, // Use fallback values if invalid
      lng: location?.lng ? parseFloat(location.lng) : 0,
    }),
    [location]
  );

  const options = useMemo(
    () => ({
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    []
  );
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const [mapSetup, setMapSetup] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(19);
  const [centerPosition, setCenterPosition] = useState(center);

  const onLoad = useCallback(function callback(map) {
    setZoom(19);
    setMap(map);
  }, []);
  useEffect(() => {
    if (location && placeDetailsEnabled) {
      setCenterPosition(location);
    }
    if (map?.center && mapSetup) {
      setCenterPosition({
        lat: map.center.lat(),
        lng: map.center.lng(),
      });
    }

    setIsMounted(true);
  }, [map, mapSetup, placeDetailsEnabled, location]);

  // Google Map Positioning
  const updateMapPosition = useCallback(() => {
    if (map && location) {
      setCenterPosition(location);
      map.panTo({ lat: location.lat, lng: location.lng });
    }
  }, [map, location]);

  // Trigger Map Position Update on Location Change
  useEffect(() => {
    if (isMapButtonHide) {
      setZoom(newZoom);
    }

    updateMapPosition();
  }, [updateMapPosition, location, newZoom]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
    // setMapSetup(false)
  }, []);

  const handleZoomIn = () => {
    if (map && zoom <= 21) {
      setZoom((prevZoom) => Math.min(prevZoom + 1));
    }
  };

  const handleZoomOut = () => {
    if (map && zoom >= 1) {
      setZoom((prevZoom) => Math.max(prevZoom - 1));
    }
  };

  return isLoaded ? (
    <Stack position="relative" className="map">
      {isMapButtonHide ? null : (
        <Stack
          position="absolute"
          zIndex={1}
          right="15px"
          bottom={isGps ? '18%' : '6%'}
          direction="column"
          spacing={1}
        >
          <IconWrapper
            padding={{ xs: '3px', sm: '5px' }}
            onClick={handleZoomIn}
            disabled={zoom > 21}
          >
            <AddIcon color="primary" />
          </IconWrapper>
          <IconWrapper
            padding={{ xs: '3px', sm: '5px' }}
            onClick={handleZoomOut}
            disabled={zoom < 1}
          >
            <RemoveIcon color="primary" />
          </IconWrapper>
        </Stack>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerPosition}
        onLoad={onLoad}
        zoom={zoom}
        onUnmount={onUnmount}
        onMouseDown={(e) => {
          setMapSetup(true);
          setDisablePickButton(true);
        }}
        onMouseUp={(e) => {
          setMapSetup(false);
          setDisablePickButton(false);
          setLocationEnabled(true);
          if (map && map.center) {
            setLocation({
              lat: map.center.lat(),
              lng: map.center.lng(),
            });
            setCenterPosition({
              lat: map.center.lat(),
              lng: map.center.lng(),
            });
          } else {
            console.error('Map or map center is not defined');
          }

          setPlaceDetailsEnabled(false);
          setPlaceDescription(undefined);
        }}
        onZoomChanged={() => {
          if (map) {
            setLocationEnabled(true);
            setLocation({
              lat: map.center.lat(),
              lng: map.center.lng(),
            });
            setCenterPosition({
              lat: map.center.lat(),
              lng: map.center.lng(),
            });
          }
        }}
        options={{ ...options, styles: grayscaleMapStyles }}
      >
        {!locationLoading ? (
          <Stack
            style={{
              zIndex: 3,
              position: 'absolute',
              marginTop: -63,
              marginLeft: -32,
              left: '50%',
              top: '50%',
            }}
          >
            <MapMarker width="60px" height="70px" />
          </Stack>
        ) : (
          <Stack
            alignItems="center"
            style={{
              zIndex: 3,
              position: 'absolute',
              marginTop: -37,
              marginLeft: -11,
              left: '50%',
              top: '50%',
            }}
          >
            <CircularProgress />
          </Stack>
        )}

        {markets?.length > 0
          ? markets.map((market) => (
              <Marker
                key={`${market.name}-${parseFloat(market.location?.coordinates[1])}-${parseFloat(
                  market.location?.coordinates[0]
                )}`}
                position={{
                  lat: parseFloat(market.location?.coordinates[1]),
                  lng: parseFloat(market.location?.coordinates[0]),
                }}
                icon={{
                  url: 'static/location-pins/map-live.gif',
                  scaledSize:
                    marketId === market._id
                      ? new window.google.maps.Size(60, 60)
                      : new window.google.maps.Size(45, 45),
                }}
                onClick={() => handleOnClickMapMarket(market._id)}
              >
                {marketId === market._id && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(market?.location?.coordinates[1]),
                      lng: parseFloat(market?.location?.coordinates[0]),
                    }}
                    pixelOffset={new window.google.maps.Size(0, -30)}
                  >
                    <Box
                      sx={{
                        color: theme.palette.neutral[800],
                        svg: { color: theme.palette.primary.main },
                      }}
                      onClick={() => handleOnClickMapMarket(market._id)}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: { sm: '80px', md: '90px', lg: '100px' },
                          transition: `${theme.transitions.create(
                            ['background-color', 'transform'],
                            {
                              duration: theme.transitions.duration.standard,
                            }
                          )}`,
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                          marginBottom: '10px',
                        }}
                      >
                        <Image
                          alt="product"
                          src={`${global?.base_urls?.market_image_path}/${market?.image}`}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          borderRadius="10px"
                          sx={{ cursor: 'zoom-in' }}
                        />
                      </Box>
                      <Stack direction="row" gap={1} mb={1}>
                        <Box width="0" flexGrow="1" sx={{ cursor: 'pointer' }}>
                          <Typography sx={{ fontWeight: '600' }}>{market.name}</Typography>
                          <Box component="small" color="primary.main">
                            {/* ({(market.distance / 1000).toFixed(2)}km {t("away")}) */}
                          </Box>
                        </Box>
                      </Stack>
                      <Stack direction="row" gap={1} fontSize="0.75rem">
                        <Box width="0" flexGrow="1">
                          {market?.address?.address}
                        </Box>
                      </Stack>
                    </Box>
                  </InfoWindow>
                )}
              </Marker>
            ))
          : null}
      </GoogleMap>
    </Stack>
  ) : (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '400px',
        [theme.breakpoints.down('sm')]: {
          minHeight: '250px',
        },
      }}
    >
      <Skeleton width="100%" height="100%" variant="rectangular" animation="wave" />
    </Stack>
  );
};

export default GoogleMapComponent;
