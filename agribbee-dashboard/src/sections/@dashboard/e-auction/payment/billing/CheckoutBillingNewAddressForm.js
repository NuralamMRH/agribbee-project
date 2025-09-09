import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// assets
import { countries } from '../../../../../assets/data';
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from '../../../../../components/hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useCallback, useEffect, useState } from 'react';
import { RegionsApi } from 'src/hooks/react-query/config/regionApi';
import { CitiesApi } from 'src/hooks/react-query/config/cityApi';
import { useGetCountry } from 'src/hooks/react-query/config/get-country/useGetCountry';
import MainMapBlock from 'src/components/google-map/MainMapBlock';
import MainApi from 'src/api/MainApi';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

CheckoutBillingNewAddressForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function CheckoutBillingNewAddressForm({ open, onClose, onCreateBilling }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
  });
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const NewAddressSchema = Yup.object().shape({
    contact_person_name: Yup.string().required('Fullname is required'),
    contact_person_number: Yup.string().required('Phone number is required'),
    contact_person_email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
  });

  const defaultValues = {
    address_type: 'Warehouse',
    addressId: '',
    contact_person_name: user ? user?.f_name : '',
    contact_person_number: user ? user?.phone : '',
    contact_person_email: user ? user?.email : '',
    lat: '',
    lng: '',
    road: '',
    house: '',
    floor: '',
    address: '',
    city: '',
    region: '',
    country: '',
    zip: '',
    isDefault: false,
    isAssignManagerUser: false,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (formData) => {
    try {
      if (values.address_type === 'Warehouse' && values.isAssignManagerUser) {
        const { data } = await MainApi.post('/api/v1/create/warehouse', formData);
        if (data.success) {
          onClose();
          onCreateBilling();
          enqueueSnackbar(`${values.address_type} added successfully!`);
        }
      } else if (values.address_type === 'Warehouse') {
        const { data } = await MainApi.post('/api/v1/create-own-warehouse', formData);
        if (data.success) {
          onClose();
          onCreateBilling();
          enqueueSnackbar(`${values.address_type} added successfully!`);
        }
      } else {
        const { data } = await MainApi.post('/api/v1/me/address/add', formData);
        if (data.success) {
          onClose();
          onCreateBilling();
          enqueueSnackbar(`${values.address_type} added successfully!`);
        }
      }

      // onCreateBilling({
      //   contact_person_name: data.contact_person_name,
      //   contact_person_number: data.contact_person_number,
      //   address: `${data.address}, ${data.zip}`,
      //   address_type: data.address_type,
      //   isDefault: data.isDefault,
      // });
    } catch (error) {
      console.error(error);
    }
  };

  const { refetch: getCountries, data: countriesData } = useGetCountry();

  // Fetch country-based regions when country changes
  const getRegions = useCallback(async () => {
    const response = await RegionsApi.countryRegions(values.country);
    setRegions(response.data?.regions || []);
  }, [values.country]);

  // Fetch region-based cities when region changes
  const getCities = useCallback(async () => {
    const response = await CitiesApi.region(values.region);
    setCities(response.data?.cities || []);
  }, [values.region]);

  useEffect(() => {
    getCountries();
    console.log(`Country`, countriesData);
  }, []);

  useEffect(() => {
    if (values.country) getRegions();
  }, [values.country, getRegions]);

  useEffect(() => {
    if (values.region) getCities();
  }, [values.region, getCities]);

  const countryHandler = async (value) => {
    setValue('country', value);
    setRegions([]);
    setCities([]);
    await getRegions(); // Fetch regions based on selected country
  };

  const regionHandler = async (value) => {
    setValue('region', value);
    setCities([]);
    await getCities(); // Fetch cities based on selected region
  };

  const handleOnChangeCity = async (value) => {
    setValue('city', value);
  };

  const handleLatLngUpdateFields = (lngLat) => {
    console.log('Current Locations: ', lngLat);
    setValue('lat', parseFloat(lngLat?.lat));
    setValue('lng', parseFloat(lngLat?.lng));
  };

  useEffect(() => {
    let zipValue = values.zip;
    if (typeof zipValue === 'string' && zipValue.startsWith('["') && zipValue.endsWith('"]')) {
      try {
        const parsedZip = JSON.parse(zipValue); // Convert stringified array to an array
        zipValue = Array.isArray(parsedZip) && parsedZip.length > 0 ? parsedZip[0] : ''; // Extract the first element
      } catch (error) {
        console.error('Error parsing zip value:', error.message);
        zipValue = ''; // Default to empty string if parsing fails
      }
    }
    setValue('zip', zipValue);
  }, [values.zip]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add new address</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFRadioGroup
              row
              name="address_type"
              options={[
                { label: 'Warehouse', value: 'Warehouse' },
                { label: 'Home', value: 'Home' },
                { label: 'Office', value: 'Office' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="contact_person_name" label="Name" />

              <RHFTextField name="contact_person_number" label="Phone Number" />
            </Box>

            <RHFTextField name="contact_person_email" label="Email Address" />
            {/* <RHFTextField name="address" label="Address" /> */}
            <RHFSelect native name="country" label="Country">
              <option value="" />
              {countriesData?.countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </RHFSelect>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFSelect native name="region" label="Region">
                <option value="" />
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="city" label="Town / City">
                <option value="" />
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="zip" label="Zip/Code" />
              <RHFTextField name="road" label="Road" />
              <RHFTextField name="house" label="House" />
              <RHFTextField name="floor" label="Floor" />
            </Box>

            <MainMapBlock
              location={location}
              setLocation={setLocation}
              countryHandler={countryHandler}
              regionHandler={regionHandler}
              handleOnChangeCity={handleOnChangeCity}
              setValue={setValue}
              handleLatLngUpdateFields={handleLatLngUpdateFields}
            />

            {values.address_type === 'Warehouse' && (
              <RHFCheckbox
                name="isAssignManagerUser"
                label={`Want to assign a warehouse manager with ${values.contact_person_email} ?`}
              />
            )}
            <RHFCheckbox name="isDefault" label="Use this address as default." />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>

          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
