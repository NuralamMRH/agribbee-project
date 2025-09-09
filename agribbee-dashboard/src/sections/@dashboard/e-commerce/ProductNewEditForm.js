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
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
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

  console.log('currentProduct', currentProduct?._id);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      introduction: currentProduct?.introduction || '',
      description: currentProduct?.description || '',
      image: null,
      images: [],
      slug: currentProduct?.slug || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      isNegotiable: currentProduct?.isNegotiable || false,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: currentProduct?.inStock || true,
      quantity: currentProduct?.quantity || '',
      weight: currentProduct?.weight || '',
      weight_unit: currentProduct?.weight_unit || WEIGHT_UNIT_NAME_OPTION[0].value,
      package: currentProduct?.package || PACKAGE_NAME_OPTION[0].value,
      status: currentProduct?.status || STATUS_NAME_OPTION[0].value,
      min: currentProduct?.min || '',
      max: currentProduct?.max || 0,
      taxes: true,
      category_id: currentProduct?.category_id || '',
      isProductInWarehouse: currentProduct?.isProductInWarehouse || false,
      addressInfo: currentProduct?.warehouse_address
        ? addressData?.data?.addresses.find(
            (item) => item._id === currentProduct?.warehouse_address
          )
        : null,
      seller_phone: currentProduct?.seller_phone || '',
      zip_code: currentProduct?.zip_code || '',
      production_date:
        currentProduct?.production_date || new Date(currentProduct?.production_date) || new Date(),
      expiration_date:
        currentProduct?.expiration_date || new Date(currentProduct?.expiration_date) || new Date(),
      //Auction details
      isAuction: false,
      isReserve: false,
      auction_type: AUCTION_NAME_OPTION[0].value,
      starting_bid_price: 0,
      reserve_bid_price: 0,
      min_bid_price: 0,
      max_bid_price: 0,
      market_price: 0,
      selling_quantity: 0,
      quantity_min: 0,
      quantity_max: 0,
      lot_number: '',
      starting_time: new Date(),
      ending_time: new Date(),
      shipping_start_date: new Date(),
      shipping_end_date: new Date(),
    }),
    [currentProduct]
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
  }, [isEdit, currentProduct, defaultValues, reset]);

  const scanBarCode = () => {
    // TODO: Implement barcode scanning logic
    console.log('Scanning barcode...');

    setValue('slug', values);
  };

  const onSubmit = async (data) => {
    try {
      // Step 1: Extract and upload images
      const descriptionImages = await extractImagesFromHtml(data.description);
      console.log('descriptionImages: ', descriptionImages);

      const uploadedImages = await Promise.all(
        descriptionImages.map(async (image) => {
          if (image.startsWith('data:image')) {
            return await uploadImageToServer(image);
          }
          return image; // Use existing URLs as-is
        })
      );

      const updatedDescription = await replaceImageUrlsInHtml(data.description, uploadedImages);

      // Step 2: Create the payload after the description is updated
      const payload = { ...data, description: updatedDescription };

      console.log('payload:', payload);

      const formData = new FormData();

      // Append form fields
      Object.keys(payload).forEach((key) => {
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

      // Step 3: Perform create or update mutation
      if (isEdit) {
        updateProduct(
          { id: currentProduct._id, formData },
          {
            onSuccess: () => {
              enqueueSnackbar('Product updated successfully!', { variant: 'success' });
              push(PATH_DASHBOARD.eCommerce.list);
            },
            onError: (err) => {
              console.error('Error updating product:', err);
              enqueueSnackbar('An error occurred while updating the product.', {
                variant: 'error',
              });
            },
          }
        );
      } else {
        createProduct(formData, {
          onSuccess: () => {
            enqueueSnackbar('Product created successfully!', { variant: 'success' });
            reset();
            // push(PATH_DASHBOARD.eCommerce.list);
          },
          onError: (err) => {
            console.error('Error creating product:', err);
            enqueueSnackbar('An error occurred while creating the product.', { variant: 'error' });
          },
        });
      }
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
                <RHFTextField name="name" label="Product Name" />

                <RHFTextField name="introduction" label="Introduction" />

                <RHFTextField name="description" label="Description" multiline rows={5} />

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Product Brochure
                  </Typography>

                  <RHFUpload
                    name="image"
                    maxSize={3145728435678654}
                    onDrop={handleCoverDrop}
                    onDelete={handleRemoveCoverFile}
                    file={
                      !values?.image &&
                      currentProduct?.image &&
                      `${global?.base_urls?.product_image_path}/${currentProduct?.image}`
                    }
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Product Brochures
                  </Typography>

                  <RHFUpload
                    multiple
                    thumbnail
                    name="images"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
                    onUpload={false}
                    files={
                      currentProduct?.image &&
                      values?.images?.length === 0 &&
                      currentProduct?.images.map(
                        (image) => `${global?.base_urls?.product_image_path}/${image?.file}`
                      )
                    }
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <RHFSwitch name="inStock" label="In stock" />

                <Stack spacing={3} mt={2}>
                  <RHFTextField
                    name="slug"
                    label="Product QR Code"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Iconify sx={{ cursor: 'pointer' }} icon="iconoir:scan-qr-code" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <RHFTextField name="sku" label="Product SKU" />
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Weight Unit
                    </Typography>

                    <RHFRadioGroup
                      row
                      spacing={4}
                      name="weight_unit"
                      options={WEIGHT_UNIT_NAME_OPTION}
                    />
                  </Stack>
                  <RHFTextField
                    name="weight"
                    label="Product weight"
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{values.weight_unit || 'Kg'}</InputAdornment>
                      ),
                    }}
                  />

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Package Type
                    </Typography>

                    <RHFRadioGroup row spacing={4} name="package" options={PACKAGE_NAME_OPTION} />
                  </Stack>

                  <RHFTextField
                    name="quantity"
                    label="Product quantity"
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{values.package || 'Case'}</InputAdornment>
                      ),
                    }}
                  />

                  <Autocomplete
                    name="category_id"
                    fullWidth
                    freeSolo
                    disableClearable
                    options={categories}
                    getOptionLabel={(option) =>
                      typeof option === 'string' ? option : `${option.name}`
                    }
                    value={
                      categories.find((category) => category._id === values.category_id) || null
                    }
                    onChange={(event, newValue) => {
                      console.log('New Value:', newValue); // Log the new value
                      if (typeof newValue === 'string') {
                        // If the user typed a custom value, you might want to handle it differently
                        setValue('category_id', newValue); // or handle it as needed
                      } else if (newValue && newValue._id) {
                        // If a valid option is selected
                        setValue('category_id', newValue._id);
                      } else {
                        // Handle the case where no valid option is selected
                        setValue('category_id', ''); // or set to null
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        name="category_id"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                    )}
                  />

                  <RHFAutocomplete
                    name="tags"
                    label="Tags"
                    multiple
                    freeSolo
                    options={TAGS_OPTION.map((option) => option)}
                    ChipProps={{ size: 'small' }}
                  />
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={2}>
                  <RHFTextField
                    name="price"
                    label="Regular Price"
                    placeholder="0.00"
                    onChange={(event) =>
                      setValue('price', Number(event.target.value), { shouldValidate: true })
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            $
                          </Box>
                        </InputAdornment>
                      ),
                      type: 'number',
                    }}
                  />

                  {/* <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  onChange={(event) => setValue('priceSale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                /> */}
                </Stack>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <MobileDatePicker
                    orientation="portrait"
                    label="Production date"
                    value={values.production_date}
                    onChange={(value) => setValue('production_date', value)}
                    renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  />
                  <MobileDatePicker
                    orientation="portrait"
                    label="Expiration date"
                    value={values.expiration_date}
                    onChange={(value) => setValue('expiration_date', value)}
                    renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  />
                </Box>

                <RHFSwitch name="isNegotiable" label="Price negotiable" />
                <RHFSwitch name="taxes" label="Price includes taxes" />
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Typography variant="subtitle2">Warehouse order picking settings</Typography>

                  {values.isProductInWarehouse === true ? (
                    <Stack>
                      {values.addressInfo && <AddressInfo {...values.addressInfo} />}
                      <InvoiceAddressListDialog
                        open={openWarehouse}
                        onClose={handleCloseFrom}
                        selected={(selectedId) => values.addressInfo?._id === selectedId}
                        onSelect={(address) => setValue('addressInfo', address)}
                        addressOptions={addressData?.data?.addresses}
                        handleOpenNewAddressForm={handleOpenNewWarehouseDialog}
                      />

                      <CheckoutBillingNewAddressForm
                        open={openNewWarehouseDialog}
                        onClose={handleCloseNewWarehouseDialog}
                        onCreateBilling={fetchAddress}
                      />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="body2">
                        Shipping Warehouse1:Same as your address/warehouse
                      </Typography>
                      <RHFTextField name="zip_code" label="Zip code" type="text" />
                      <RHFTextField name="seller_phone" label="Your phone" type="text" />
                    </>
                  )}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 1 }}
                  >
                    <RHFSwitch
                      name="isProductInWarehouse"
                      label="Product at warehouse 2/other address"
                    />

                    {values.isProductInWarehouse === true && (
                      <Button
                        size="small"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={handleOpenWarehouse}
                      >
                        {values.addressInfo ? 'Change' : 'Add'}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Card>

              <RHFSwitch
                name="isAuction"
                label={`Product ${currentProduct ? 'update' : 'publish'} with add new auction`}
              />

              {values.isAuction && (
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mb={2}>
                    <RHFSelect native name="auction_type" label="Auction type">
                      <option value="" />
                      {AUCTION_NAME_OPTION?.map((type) => (
                        <option key={type?.value} value={type?.value}>
                          {type?.label}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFTextField name="starting_bid_price" label="Starting price" type="number" />
                    <RHFSwitch name="isReserve" label="Reserve auction" />
                    {values.isReserve && (
                      <RHFTextField name="reserve_bid_price" label="Reserve price" type="number" />
                    )}

                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <RHFTextField name="min_bid_price" label="Min bid price" type="number" />
                      <RHFTextField name="max_bid_price" label="Max bid price" type="number" />
                      <RHFTextField name="market_price" label="Market price" type="number" />
                      <RHFTextField
                        name="selling_quantity"
                        label="Auction quantity"
                        type="number"
                      />
                      <RHFTextField name="quantity_min" label="Min bid quantity" type="number" />
                      <RHFTextField name="quantity_max" label="Max bid quantity" type="number" />
                      <MobileDateTimePicker
                        renderInput={(props) => (
                          <TextField name="starting_time" {...props} fullWidth />
                        )}
                        label="Auction start time"
                        value={values.starting_time}
                        onChange={(value) => setValue('starting_time', value)}
                      />
                      <MobileDateTimePicker
                        renderInput={(props) => (
                          <TextField name="ending_time" {...props} fullWidth />
                        )}
                        label="Auction end time"
                        value={values.ending_time}
                        onChange={(value) => setValue('ending_time', value)}
                      />
                    </Box>

                    {values.auction_type === 'future-delivery-auction' && (
                      <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                      >
                        <MobileDateTimePicker
                          renderInput={(props) => (
                            <TextField name="shipping_start_date" {...props} fullWidth />
                          )}
                          label="Delivery start time"
                          value={values.shipping_start_date}
                          onChange={(value) => setValue('shipping_start_date', value)}
                        />
                        <MobileDateTimePicker
                          renderInput={(props) => (
                            <TextField name="shipping_end_date" {...props} fullWidth />
                          )}
                          label="Delivery end time"
                          value={values.shipping_end_date}
                          onChange={(value) => setValue('shipping_end_date', value)}
                        />
                      </Box>
                    )}
                  </Stack>
                </Card>
              )}

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit
                  ? `Create ${
                      values.isAuction && values.auction_type ? `Product & Auction` : 'Product'
                    }`
                  : `Save Changes`}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
