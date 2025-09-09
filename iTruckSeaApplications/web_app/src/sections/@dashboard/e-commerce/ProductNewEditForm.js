import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  Autocomplete,
  Button,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';
import { sellerProductSubmit } from 'src/hooks/post/sellerProductSubmit';
import { sellerProductUpdate } from 'src/hooks/update/sellerProductUpdate';
import { uploadFiles } from 'src/hooks/post/uploadFiles';
import { useGetAllCategories } from 'src/hooks/custom-hooks/useGetAllCategories';

import { TextField } from '@mui/material';
import { MobileDateTimePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { Block } from 'src/sections/_examples/Block';
import InvoiceAddressListDialog from '../order-request/form/InvoiceAddressListDialog';
import { useQuery } from 'react-query';
import { AddressApi } from 'src/hooks/react-query/config/addressApi';
import Iconify from 'src/components/iconify';
import { AddressInfo } from '../order-request/form/InvoiceNewEditAddress';
import { CheckoutBillingNewAddressForm } from './checkout';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

const TAGS_OPTION = ['ecommerce', 'food', 'beef', 'meat'];

const WEIGHT_UNIT_NAME_OPTION = [
  { label: 'Gt', value: 'Gt' },
  { label: 'Mt', value: 'Mt' },
  { label: 'T', value: 'T' },
  { label: 'Kg', value: 'Kg' },
  { label: 'G', value: 'G' },
  { label: 'Lb', value: 'Lb' },
  { label: 'Oz', value: 'Oz' },
];
const PACKAGE_NAME_OPTION = [
  { label: 'Case', value: 'Case' },
  { label: 'Box', value: 'Box' },
  { label: 'Ps', value: 'Ps' },
  { label: 'LG', value: 'LG' },
];
const STATUS_NAME_OPTION = [
  { label: 'Warehouse storage', value: 'Warehouse storage' },
  { label: 'Company storage', value: 'Company storage' },
  { label: 'Store', value: 'Store' },
  { label: 'Buyer Storage', value: 'Buyer Storage' },
  { label: 'Up Coming', value: 'Up Coming' },
];
const AUCTION_NAME_OPTION = [
  { label: 'Live Auction', value: 'live-auction' },
  { label: 'Surplus Auction', value: 'surplus-auction' },
  { label: 'Daily Catch Auction', value: 'daily-catch-auction' },
  { label: 'Future Delivery Auction', value: 'future-delivery-auction' },
];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRequestDock: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentRequestDock }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { global } = useSelector((state) => state.globalSettings);
  const [categories, setCategories] = useState([]);

  const [isScanStart, setIsScanStart] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openNewWarehouseDialog, setOpenNewWarehouseDialog] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const handleOpenWarehouse = () => {
    setOpenWarehouse(true);
  };

  const handleCloseFrom = () => {
    setOpenWarehouse(false);
  };

  const handleOpenNewWarehouseDialog = () => {
    setOpenWarehouse(false);
    setOpenNewWarehouseDialog(true);
  };

  const handleCloseNewWarehouseDialog = () => {
    setOpenNewWarehouseDialog(false);
    setOpenWarehouse(true);
  };

  const {
    data: addressData,
    isError,
    error,
    refetch: fetchAddress,
  } = useQuery(['addressList'], AddressApi.addressList, {
    onError: (err) => {
      console.error(`Error: ${err}!`);
    },
  });

  useEffect(() => {
    if (!addressData?.data?.addresses?.length) {
      fetchAddress();
    }

    console.log('address list:', addressData?.data?.addresses);
  }, [addressData?.data?.addresses]);

  const categoryData = useGetAllCategories();
  useEffect(() => {
    if (categoryData?.response?.length > 0) {
      setCategories(categoryData?.response);
    }
    console.log(categoryData);
  }, [categoryData]);

  const { mutate: createProduct, isLoading: isCreating } = sellerProductSubmit();
  const { mutate: updateProduct, isLoading: isUpdating } = sellerProductUpdate();
  const { mutate: uploadFileMutate, isLoading: isFileUploading } = uploadFiles();

  const NewProductSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // image: Yup.mixed().required('Cover image is required').nullable(true),
    // images: Yup.array().min(1, 'At least one image is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    sku: Yup.string().required('SKU is required'),
    description: Yup.string().required('Description is required'),
  });

  console.log('currentRequestDock', currentRequestDock?._id);

  const defaultValues = useMemo(
    () => ({
      vesselId: currentRequestDock?.vesselId || 'BV-94171-TS',
      owner: currentRequestDock?.owner || 'LỆ THI NGỌC LÝ',
      address:
        currentRequestDock?.address ||
        'KP. Hải Phong 2, thị trấn Long Hải, huyện Long Điền, tỉnh BR. Vũng Tàu',
      numberOfCrews: currentRequestDock?.numberOfCrews || 7,
      vesselType: currentRequestDock?.vesselType || 'Fishing vessel',
      departureProvince: currentRequestDock?.departureProvince || 'BR. Vũng Tàu',
      placeOfDeparture: currentRequestDock?.placeOfDeparture || '47',
      toRegion: currentRequestDock?.toRegion || 'A. Cà Mau - Kẻn Giang',
      departureDate: currentRequestDock?.departureDate || new Date(),
      tripPeriodDays: currentRequestDock?.tripPeriodDays || 30,
    }),
    [currentRequestDock]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [isEdit, currentRequestDock, defaultValues, reset]);

  const scanBarCode = () => {
    // TODO: Implement barcode scanning logic
    console.log('Scanning barcode...');

    setValue('slug', values);
  };

  const onSubmit = async (data) => {
    try {
      console.log('payload:', data);

      const formData = new FormData();

      // Append form fields
      Object.keys(data).forEach((key) => {
        const value = data[key];

        // Skip empty or undefined values
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return;
        }

        if (key === 'addressInfo') {
          formData.append('warehouse_address', value._id);
        } else if (key === 'tags') {
          formData.append(key, value); // Add other fields
        } else if (key === 'images') {
          // Append each image file individually
          value.forEach((file) => {
            formData.append(key, file); // Appends each file with the key 'images'
          });
        } else {
          formData.append(key, value);
        }
      });

      enqueueSnackbar('Request to Departure successfully!', { variant: 'success' });

      // Step 3: Perform create or update mutation
      // if (isEdit) {
      //   updateProduct(
      //     { id: currentRequestDock._id, formData },
      //     {
      //       onSuccess: () => {
      //         enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      //         push(PATH_DASHBOARD.eCommerce.list);
      //       },
      //       onError: (err) => {
      //         console.error('Error updating product:', err);
      //         enqueueSnackbar('An error occurred while updating the product.', {
      //           variant: 'error',
      //         });
      //       },
      //     }
      //   );
      // } else {
      //   createProduct(formData, {
      //     onSuccess: () => {
      //       enqueueSnackbar('Product created successfully!', { variant: 'success' });
      //       reset();
      //       // push(PATH_DASHBOARD.eCommerce.list);
      //     },
      //     onError: (err) => {
      //       console.error('Error creating product:', err);
      //       enqueueSnackbar('An error occurred while creating the product.', { variant: 'error' });
      //     },
      //   });
      // }
    } catch (error) {
      console.error('Form submission error:', error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  };

  const extractImagesFromHtml = async (html) => {
    const imageSources = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const images = tempDiv.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const src = images[i].getAttribute('src');
      if (src) {
        imageSources.push(src);
      }
    }

    return imageSources;
  };

  const replaceImageUrlsInHtml = async (html, uploadedImages) => {
    // Parse the HTML to find image tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    let imageIndex = 0;

    // Iterate through each image tag and replace the src attribute
    imgTags.forEach((img) => {
      if (imageIndex < uploadedImages.length) {
        const currentImageUrl = uploadedImages[imageIndex];
        img.setAttribute('src', currentImageUrl);
        imageIndex++;
      }
    });

    // Return the updated HTML as a string
    return doc.body.innerHTML;
  };

  const uploadImageToServer = (imageBase64) => {
    return new Promise((resolve, reject) => {
      try {
        const base64Data = imageBase64.split(',')[1]; // Extract base64 data
        const contentType = imageBase64.match(/data:(.*);base64/)[1]; // Extract content type
        const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
          type: contentType,
        });

        const formData = new FormData();
        formData.append('file', blob, 'description_image.png'); // Provide a filename

        // Upload the file
        uploadFileMutate(formData, {
          onSuccess: (response) => {
            console.log('Upload successful:', response);
            resolve(response.file_full_url); // Resolve with the file URL
          },
          onError: (error) => {
            console.error('Upload error:', error);
            reject(error); // Reject with the error
          },
        });
      } catch (error) {
        console.error('Failed to process image upload:', error);
        reject(error);
      }
    });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    setValue(
      'images',
      values.images?.filter((file) => file !== inputFile)
    );
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  const handleCoverDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue('image', Object.assign(file, { preview: URL.createObjectURL(file) }), {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const handleRemoveCoverFile = () => {
    setValue('image', null);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Vessel Information Section */}
                <Typography variant="h6">Thông tin tàu (Vessel info)</Typography>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFTextField name="vesselId" label="Số đồng ký (Vessel ID)" disabled />
                  <RHFTextField name="owner" label="Chủ phương tiện (Owner)" disabled />
                  <RHFTextField
                    name="address"
                    label="Địa chỉ (Address)"
                    multiline
                    rows={2}
                    disabled
                  />
                  <RHFTextField
                    name="numberOfCrews"
                    label="Số thuyền viên (#Crews)"
                    type="number"
                    disabled
                  />
                  <RHFTextField name="vesselType" label="Kiểu tàu (Type of Vessel)" disabled />
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFTextField
                    name="departureProvince"
                    label="Tỉnh/TP xuất cảng (Deporture province/city)"
                  />
                  <RHFTextField
                    name="placeOfDeparture"
                    label="Nơi xuất cảng (Place of Deporture)"
                  />
                  <RHFTextField name="toRegion" label="Đến Ngư Trưởng (To Region A.B.C.D)" />

                  <MobileDatePicker
                    orientation="portrait"
                    label="Ngày xuất cảng (Deporture date)"
                    value={values.departureDate}
                    onChange={(value) => setValue('departureDate', value)}
                    renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  />
                  <RHFTextField
                    name="tripPeriodDays"
                    label="Thời gian chuyến (Trip period)"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">ngày</InputAdornment>,
                    }}
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Other existing sections */}
          <Grid item xs={12} md={12}>
            <Stack spacing={3}>
              {/* ... (rest of your existing form sections) ... */}

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Tạo mới (Create New)' : 'Lưu thay đổi (Save Changes)'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
