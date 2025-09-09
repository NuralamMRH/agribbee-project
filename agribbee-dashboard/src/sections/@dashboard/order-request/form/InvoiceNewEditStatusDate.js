// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  'pending',
  'accepted',
  'canceled',
  'failed',
  'in transit',
  'completed',
  'confirm',
  'processing',
  'draft',
];

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext();

  const values = watch();

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ p: 3, bgcolor: 'background.neutral' }}
      >
        <RHFTextField
          disabled
          name="orderRequestId"
          label="Request Id"
          value={`${values.orderRequestId}`}
        />

        <RHFSelect fullWidth name="orderStatus" label="Status" InputLabelProps={{ shrink: true }}>
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

        <Controller
          name="exportAt"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Export At"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
              )}
            />
          )}
        />

        <Controller
          name="arrivalAt"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Arrival At"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
              )}
            />
          )}
        />
      </Stack>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
        <RHFTextField name="truckId" label="Truck Id" />
        <RHFTextField name="trackingCompany" label="Tracking Company" />
        <RHFTextField name="truckCompanyPhone" label="Tracking Company Phone" />
      </Stack>
    </>
  );
}
