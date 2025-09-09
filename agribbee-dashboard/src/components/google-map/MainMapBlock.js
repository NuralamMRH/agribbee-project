import React, { useEffect, useState } from 'react';
import RoomIcon from '@mui/icons-material/Room';
import {
  Box,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
  styled,
  Button,
  Autocomplete,
  TextField,
  Grid,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useGeolocated } from 'react-geolocated';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { GoogleApi } from 'src/hooks/react-query/config/googleApi';
import { useSnackbar } from 'notistack';
import LocationEnableCheck from './LocationEnableCheck';
import GoogleMapComponent from './GoogleMapComponent';
import { FacebookCircularProgress } from '../progress/FacebookCircularProgress';

const CssTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    background: theme.palette.whiteContainer.main,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.primary.main,
    background: theme.palette.whiteContainer.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    fontSize: '13px',
    padding: '7px',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const MainMapBlock = ({
  markets,
  handleOnClickMapMarket,
  location,
  setLocation,
  marketId,
  countryHandler,
  regionHandler,
  handleOnChangeCity,
  setValue,
  handleLatLngUpdateFields,
  height,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { global, userLocationUpdate } = useSelector((state) => state.globalSettings);
  const [isEnableLocation, setIsEnableLocation] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const [placeDescription, setPlaceDescription] = useState(undefined);

  const [zoneId, setZoneId] = useState(undefined);
  const [newZoom, setNewZoom] = useState();
  const [isLoadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const [rerenderMap, setRerenderMap] = useState(false);
  const [currentLocationValue, setCurrentLactionValue] = useState({
    description: '',
  });
  const [loadingAuto, setLoadingAuto] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    isLoading: placesIsLoading,
    data: places,
    error,
  } = useQuery(
    ['places', searchKey],
    async () => GoogleApi.placeApiAutocomplete(searchKey),
    { enabled },
    {
      retry: 1,
    }
  );
  if (error) {
    setPredictions([]);
    setEnabled(false);
  }

  const { isLoading: isLoading2, data: placeDetails } = useQuery(
    ['placeDetails', placeId],
    async () => GoogleApi.placeApiDetails(placeId),
    {
      enabled: placeDetailsEnabled,
      onSuccess: () => setLoadingAuto(false),
      onError: (err) => enqueueSnackbar('Place details  cannot get!', { variant: 'error' }),
    },
    {
      retry: 1,
    }
  );

  const {
    isLoading: locationLoading,
    data: zoneData,
    isError: isErrorLocation,
    error: errorLocation,
    refetch: locationRefetch,
  } = useQuery(
    ['zoneId', location],
    async () => GoogleApi.getZoneId(location),
    {
      enabled: locationEnabled,
      onError: (err) => enqueueSnackbar('Place details  cannot get!', { variant: 'error' }),
    },
    {
      retry: 1,
      // cacheTime: 0,
    }
  );
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 1000,
    isGeolocationEnabled: true,
  });

  useEffect(() => {
    setNewZoom(19);
    if (coords) {
      setCurrentLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }
  }, []);

  if (isErrorLocation) {
  }
  const { data: geoCodeResults, refetch: refetchCurrentLocation } = useQuery(
    ['geocode-api', location],
    async () => GoogleApi.geoCodeApi(location)
  );
  useEffect(() => {
    if (geoCodeResults) {
      setCurrentLactionValue({
        description: geoCodeResults?.data?.results[0]?.formatted_address,
      });

      handleLatLngUpdateFields(geoCodeResults?.data?.results[0]?.geometry?.location);
    } else {
      setCurrentLactionValue({
        description: '',
      });
    }
  }, [geoCodeResults]);

  useEffect(() => {
    if (zoneData) {
      console.log('Zone Data: ', zoneData?.data?.zone_data);

      countryHandler(zoneData?.data?.zone_data?.country);
      regionHandler(zoneData?.data?.zone_data?.region?._id);
      handleOnChangeCity(zoneData?.data?.zone_data?._id);

      setValue('zip', zoneData?.data?.zone_id);

      // console.log("Zone Id: ", zoneData?.data?.zone_id);

      //   setZoneId(zoneData?.data?.zone_id);
      //   dispatch(setZoneData(zoneData?.data?.zone_data));

      //  setLocation(undefined)
      //   setLocationEnabled(false);
    } else {
      locationRefetch();
    }
    if (!zoneData) {
      setZoneId(undefined);
    }
  }, [zoneData]);

  useEffect(() => {
    if (placeDetails) {
      setLocation(placeDetails?.data?.result?.geometry?.location);
      setLocationEnabled(true);
    }
  }, [placeDetails]);

  useEffect(() => {
    if (places) {
      setPredictions(places?.data?.predictions);
    }
  }, [places]);

  const [isDisablePickButton, setDisablePickButton] = useState(false);

  const handleLocationSet = (values) => {
    setLocation(values);
  };

  useEffect(() => {
    setValue('address', currentLocationValue?.description);
  }, [currentLocationValue]);

  const handleLocationSelection = (value) => {
    console.log('Place details: ' + JSON.stringify(value));
    setPlaceId(value?.place_id);
    setPlaceDescription(value?.description);
    setValue('address', value?.description);
  };

  const handleAgreeLocation = async () => {
    if (coords) {
      setLocation({ lat: coords?.latitude, lng: coords?.longitude });
      setLoadingCurrentLocation(true);
      setLocationEnabled(true);
      setLoadingCurrentLocation(false);
      if (zoneId) {
        localStorage.setItem('zoneid', zoneId);
      }
      await refetchCurrentLocation();
      setRerenderMap((prevState) => !prevState);
    } else {
      setIsEnableLocation(true);
    }
  };

  const handleZoomIn = () => {
    if (newZoom <= 21) {
      setNewZoom((prevZoom) => Math.min(prevZoom + 1));
    }
  };

  const handleZoomOut = () => {
    if (newZoom >= 1) {
      setNewZoom((prevZoom) => Math.max(prevZoom - 1));
    }
  };

  const ErrorMessage = () => {
    if (isErrorLocation && errorLocation?.response?.data) {
      const { errMessage } = errorLocation.response.data;
      return (
        <Stack>
          <Typography>Error:</Typography>
          <Typography>{errMessage}</Typography>
        </Stack>
      );
    }

    return null;
  };

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <Paper sx={{ outline: 'none' }}>
            {loadingAuto ? (
              <Skeleton width="100%" height="55px" variant="rectangular" />
            ) : (
              <Autocomplete
                fullWidth
                freeSolo
                id="combo-box-demo"
                getOptionLabel={(option) => option.description}
                options={predictions}
                onChange={(event, value) => {
                  if (value) {
                    if (value !== '' && typeof value === 'string') {
                      setLoadingAuto(true);
                      const value = places?.data?.predictions?.[0];
                      handleLocationSelection(value);
                    } else {
                      handleLocationSelection(value);
                    }
                  }
                  setPlaceDetailsEnabled(true);
                }}
                clearOnBlur={false}
                value={currentLocationValue}
                loading={placesIsLoading}
                loadingText={t('Search suggestions are loading...')}
                renderInput={(params) => (
                  <CssTextField
                    label={null}
                    {...params}
                    placeholder={t('Enter address here...')}
                    onChange={(event) => {
                      setSearchKey(event.target.value);
                      if (event.target.value) {
                        setEnabled(true);
                      } else {
                        setEnabled(false);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setSearchKey(e.target.value);
                      }
                    }}
                  />
                )}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box
        position={'relative'}
        sx={{
          mt: 2,
          color: (theme) => theme.palette.neutral[1000],
          Height: '400px',
        }}
      >
        <Stack
          position="absolute"
          zIndex={1}
          bottom="20px"
          left="20px"
          direction="column"
          spacing={1}
        >
          <Stack
            sx={{
              backgroundColor: theme.palette.neutral[1800],
              borderRadius: '50%',
            }}
          >
            <IconButton onClick={handleAgreeLocation}>
              <GpsFixedIcon color="primary" />
            </IconButton>
          </Stack>
          <Stack
            sx={{
              backgroundColor: theme.palette.neutral[1800],
              borderRadius: '8px',
            }}
          >
            <IconButton onClick={handleZoomIn}>
              <AddIcon sx={{ color: theme.palette.neutral[1000] }} />
            </IconButton>
            <Divider variant="middle" sx={{ backgroundColor: 'red', marginInline: '8px' }} />
            <IconButton onClick={handleZoomOut}>
              <RemoveIcon sx={{ color: theme.palette.neutral[1000] }} />
            </IconButton>
          </Stack>
        </Stack>

        {location ? (
          <GoogleMapComponent
            key={rerenderMap}
            setDisablePickButton={setDisablePickButton}
            setLocationEnabled={setLocationEnabled}
            setLocation={handleLocationSet}
            setCurrentLocation={setCurrentLocation}
            locationLoading={locationLoading}
            location={location}
            setPlaceDetailsEnabled={setPlaceDetailsEnabled}
            placeDetailsEnabled={placeDetailsEnabled}
            locationEnabled={locationEnabled}
            setPlaceDescription={setPlaceDescription}
            markets={markets}
            marketId={marketId}
            handleOnClickMapMarket={handleOnClickMapMarket}
            isMapButtonHide={true}
            newZoom={newZoom}
            height={height ? height : false}
          />
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
            <FacebookCircularProgress />
            <Typography nodefaultfont="true">{t('Please wait sometimes')}</Typography>
          </Stack>
        )}

        <Stack justifyContent="center" alignItems="center"></Stack>
        {/*{placeDescription && (*/}
        {/*    <LocationView>{placeDescription}</LocationView>*/}
        {/*)}*/}

        {errorLocation?.response?.data ? (
          <ErrorMessage
            //className="picklocation"
            aria-label="picklocation"
            disabled={locationLoading}
            variant="contained"
            color="error"
          />
        ) : (
          <></>
        )}
      </Box>
      <LocationEnableCheck
        openLocation={isEnableLocation}
        handleCloseLocation={() => setIsEnableLocation(false)}
        isGeolocationEnabled={isGeolocationEnabled}
        t={t}
        coords={coords}
        handleAgreeLocation={handleAgreeLocation}
      />
    </Box>
  );
};

export default MainMapBlock;
