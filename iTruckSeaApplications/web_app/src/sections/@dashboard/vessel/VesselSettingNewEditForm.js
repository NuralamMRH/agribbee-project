import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Slider,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
import { countries } from '../../../assets/data';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import Iconify from '@/components/iconify';
import BarcodeQRScanner from '@/sections/_examples/BarcodeQRScanner';
import { MobileDatePicker } from '@mui/x-date-pickers';
import Block from '@/components/settings/drawer/Block';
import { G } from '@react-pdf/renderer';
import { TableHeadCustom } from '@/components/table';
import VesselCreatedComplete from './VesselCreatedComplete';
import { submitVessel } from '@/hooks/post/submitVessel';

// ----------------------------------------------------------------------

VesselSettingNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function VesselSettingNewEditForm({ isEdit = false, currentUser }) {
  const { createVessel, updateVessel, isLoading: isSubmitting, error } = submitVessel();
  const [completed, setCompleted] = useState(false);
  const [vesselId, setVesselId] = useState('');
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleContinue = () => {
    if (completed) {
      push(PATH_DASHBOARD.vessel.list);
    }
  };

  const NewVesselSchema = Yup.object().shape({
    owner: Yup.string().required('Vessel owner is required'),
    ownerId: Yup.string().required('Owner ID is required'),
    residentialAddress: Yup.string().required('Residential Address is required'),
    vesselId: Yup.string().required('Vessel ID is required'),
    type: Yup.string().required('Type of vessel is required'),
    grossTonnage: Yup.number().required('Gross Tonnage is required'),
    lengthOverall: Yup.number().required('Length overall is required'),
    breadth: Yup.number().required('Breadth is required'),
    draft: Yup.number().required('Draft is required'),
    materials: Yup.string().required('Materials is required'),
    numberOfEngines: Yup.number().required('Number of Engines is required'),
    totalPower: Yup.number().required('Total power is required'),
    machineType: Yup.string().required('Type of machine is required'),
    engineSerialNumber: Yup.string().required('Engine serial number is required'),
    portRegistry: Yup.string().required('Port Registry is required'),
    fisheryPermit: Yup.string().required('Fishery permit is required'),
    expirationDate: Yup.date().required('Expiration date is required'),
    fishingMethod: Yup.array().required('Fishing method is required'),
    document_image: Yup.string().required('Image is required').nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      owner: currentUser?.vessel?.name || '',
      ownerId: currentUser?.vessel?.ownerId || '',
      residentialAddress: currentUser?.vessel?.residentialAddress || '',
      vesselId: currentUser?.vessel?.vesselId || '',
      type: currentUser?.vessel?.type || '',
      grossTonnage: currentUser?.vessel?.grossTonnage || 0,
      lengthOverall: currentUser?.vessel?.lengthOverall || 0,
      breadth: currentUser?.vessel?.breadth || 0,
      draft: currentUser?.vessel?.draft || 0,
      materials: currentUser?.vessel?.materials || '',
      numberOfEngines: currentUser?.vessel?.numberOfEngines || 0,
      totalPower: currentUser?.vessel?.totalPower || 0,
      machineType: currentUser?.vessel?.machineType || '',
      engineSerialNumber: currentUser?.vessel?.engineSerialNumber || '',
      portRegistry: currentUser?.vessel?.portRegistry || '',
      fisheryPermit: currentUser?.vessel?.fisheryPermit || '',
      expirationDate: currentUser?.vessel?.expirationDate || null,
      document_image: currentUser?.vessel?.document_image || null,

      // Fishing Methods
      fishingMethods: {
        primary: {
          purseSeine: false,
          hook: false,
          net: false,
          trawl: false,
        },
        secondary1: {
          purseSeine: false,
          hook: false,
          net: false,
          trawl: false,
        },
        secondary2: {
          purseSeine: false,
          hook: false,
          net: false,
          trawl: false,
        },
      },

      // Gear Size
      gearLength: 0,
      gearHeight: 0,
      gearCircumference: 0,
      hookPosition: 0,

      // Tank Info
      numberOfTanks: 1.8,

      // Crew Information
      captainName: '',
      captainLicense: '',
      captainPhone: '',
      mechanicName: '',
      mechanicLicense: '',
      crewCertifications: [
        { id: 1, checked: false, name: '' },
        { id: 2, checked: false, name: '' },
        { id: 3, checked: false, name: '' },
        { id: 4, checked: false, name: '' },
        { id: 5, checked: false, name: '' },
      ],
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewVesselSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting: formSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      console.log('Form Data Before Processing:', data);

      const formData = new FormData();

      // Append form fields
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value === null || value === undefined || value === '') {
          return;
        }

        // Handle nested objects
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      // Log form data for debugging
      console.log('Form Data After Processing:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Check if we have the required fields
      const requiredFields = [
        'owner',
        'ownerId',
        'residentialAddress',
        'vesselId',
        'type',
        'grossTonnage',
        'lengthOverall',
        'breadth',
        'draft',
        'materials',
        'numberOfEngines',
        'totalPower',
        'machineType',
        'engineSerialNumber',
        'portRegistry',
        'fisheryPermit',
        'expirationDate',
        'document_image',
      ];

      const missingFields = requiredFields.filter((field) => !formData.has(field));
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        enqueueSnackbar(`Missing required fields: ${missingFields.join(', ')}`, {
          variant: 'error',
        });
        return;
      }

      if (isEdit) {
        console.log('Updating vessel with ID:', currentUser._id);
        updateVessel(
          { id: currentUser._id, formData },
          {
            onSuccess: (response) => {
              console.log('Update success:', response);
              setVesselId(response.vesselId);
              enqueueSnackbar('Vessel updated successfully!', { variant: 'success' });
              setCompleted(true);
            },
            onError: (err) => {
              console.error('Error updating vessel:', err);
              enqueueSnackbar(err?.message || 'An error occurred while updating the vessel.', {
                variant: 'error',
              });
            },
          }
        );
      } else {
        console.log('Creating new vessel');
        createVessel(formData, {
          onSuccess: (response) => {
            console.log('Create success:', response);
            setVesselId(response.vesselId);
            enqueueSnackbar('Vessel created successfully!', { variant: 'success' });
            setCompleted(true);
          },
          onError: (err) => {
            console.error('Error creating vessel:', err);
            enqueueSnackbar(err?.message || 'An error occurred while creating the vessel.', {
              variant: 'error',
            });
          },
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('document_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const TABLE_HEAD = [
    { id: '' },
    { id: 'purseSeine', label: ' Purse Seine', align: 'left' },
    { id: 'hook', label: 'Hook', align: 'left' },
    { id: 'net', label: 'Net', align: 'left' },
    { id: 'trawl', label: 'Trawl', align: 'center' },
  ];

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {isEdit && (
                <Label
                  color={values.status === 'active' ? 'success' : 'error'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar
                  uploadDocument
                  name="document_image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Scan your vessel document here
                    </Typography>
                  }
                />
              </Box>

              <Stack alignItems="center" sx={{ mt: 3 }}>
                <LoadingButton
                  startIcon={<Iconify sx={{ cursor: 'pointer' }} icon="iconoir:scan-qr-code" />}
                  onClick={() => {
                    console.log('Scan QR code');
                  }}
                  variant="contained"
                  loading={false}
                >
                  AI Document Scan
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin tàu (Vessel info)
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="owner" label="Vessel Owner" />
                <RHFTextField name="ownerId" label="Owner ID" />
                <RHFTextField name="residentialAddress" label="Residential Address" />
                <RHFTextField name="vesselId" label="Vessel ID" />
                <RHFTextField name="type" label="Type of Vessel" />
                <RHFTextField name="grossTonnage" label="Gross Tonnage" type="number" />
                <RHFTextField name="lengthOverall" label="Length Overall (m)" type="number" />
                <RHFTextField name="breadth" label="Breadth (m)" type="number" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="draft" label="Draft (m)" type="number" />
                <RHFTextField name="materials" label="Materials" />
                <RHFTextField name="numberOfEngines" label="Number of Engines" type="number" />
                <RHFTextField name="totalPower" label="Total Power (KW)" type="number" />
                <RHFTextField name="machineType" label="Machine Type" />
                <RHFTextField name="engineSerialNumber" label="Engine Serial Number" />
                <RHFTextField name="portRegistry" label="Port Registry" />
                <RHFTextField name="fisheryPermit" label="Fishery Permit" />
                <MobileDatePicker
                  orientation="portrait"
                  label="Expiration Date"
                  value={values.expirationDate}
                  onChange={(value) => setValue('expirationDate', value)}
                  renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                />
              </Box>

              {/* Fishing Methods Section */}

              <Block sx={{ mt: 3 }}>
                <Typography variant="h6">Fishing Methods</Typography>
                <Table size="medium">
                  <TableHeadCustom rowCount={3} headLabel={TABLE_HEAD} />
                  <TableBody>
                    {['primary', 'secondary1', 'secondary2'].map((methodType, index) => (
                      <TableRow key={methodType}>
                        <TableCell>
                          <Typography variant="body2">
                            {index === 0 ? 'Primary Method' : `Secondary Method ${index}`}
                          </Typography>
                        </TableCell>
                        {TABLE_HEAD.slice(1).map((method) => (
                          <TableCell key={method.id} align={method.align}>
                            <Checkbox
                              checked={values.fishingMethods[methodType][method.id]}
                              onChange={() =>
                                setValue(
                                  `fishingMethods.${methodType}.${method.id}`,
                                  !values.fishingMethods[methodType][method.id]
                                )
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Block>

              {/* Gear Size Section */}
              <Block title="Gear Dimensions" sx={{ mb: 3 }}>
                <RHFTextField name="gearLength" label="Length (m)" type="number" />
                <RHFTextField name="gearHeight" label="Height (m)" type="number" />
                <RHFTextField name="gearCircumference" label="Circumference (m)" type="number" />
                <RHFTextField name="hookPosition" label="Hook Position" type="number" />
              </Block>

              {/* Tank Info */}
              {/* <RHFTextField name="numberOfTanks" label="Number of Tanks" type="number" step="0.1" /> */}
              <Block title="Number of Tanks" sx={{ mt: 3 }}>
                <Slider
                  size="medium"
                  marks
                  min={1}
                  step={1}
                  max={10}
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  getAriaValueText={(value) => {
                    `${value} tanks`;
                  }}
                  onChange={(event, value) => setValue('numberOfTanks', value)}
                />
              </Block>

              {/* Crew Information Section */}
              <Block title="Crew Details" sx={{ mt: 3 }}>
                <RHFTextField name="captainName" label="Captain Name" />
                <RHFTextField name="captainLicense" label="License Number" />
                <RHFTextField name="captainPhone" label="Phone Number" />

                <RHFTextField name="mechanicName" label="Mechanic Name" />
                <RHFTextField name="mechanicLicense" label="Mechanic License" />

                <Block title="Crew Certifications" sx={{ mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Checkbox name={`crewCertifications[${num - 1}].checked`} />
                      <RHFTextField
                        name={`crewCertifications[${num - 1}].name`}
                        label={`Certification ${num}`}
                        sx={{ flex: 1 }}
                      />
                    </div>
                  ))}
                </Block>
              </Block>
            </Card>
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formSubmitting}
            endIcon={<Iconify icon="eva:arrow-forward-fill" />}
          >
            {!isEdit ? 'Submit' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
      <VesselCreatedComplete
        open={completed}
        setOpen={setCompleted}
        onReset={handleContinue}
        vesselId={vesselId}
      />
    </>
  );
}
