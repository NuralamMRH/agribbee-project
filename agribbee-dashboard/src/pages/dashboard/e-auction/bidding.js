import { useState, useEffect } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// next
import Head from 'next/head';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts, setSourcerCheckoutId, setSourcerName } from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import FormProvider from '../../../components/hook-form';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterDrawer,
  ShopProductSearch,
} from '../../../sections/@dashboard/e-auction/bidding';
import CartWidget from '../../../sections/@dashboard/e-auction/CartWidget';
import { getConfig } from 'src/redux/slices/global';
import { ProfileFriends } from 'src/sections/@dashboard/user/profile';
import { _userFriends } from 'src/_mock/arrays';
import SourcerList from 'src/sections/@dashboard/e-auction/bidding/SourcerList';
import { sellerApi } from 'src/hooks/react-query/config/sellerApi';
import { useSnackbar } from 'notistack';
import MainApi from 'src/api/MainApi';
import { setSourcer } from 'src/redux/slices/storedData';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

EcommerceShopPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function EcommerceShopPage() {
  const { global } = useSelector((state) => state.globalSettings);
  const { sourcer } = useSelector((state) => state.storedData);
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const [openFilter, setOpenFilter] = useState(false);
  const [sourcers, setSourcers] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchSourcers, setSearchSourcers] = useState('');

  useEffect(() => {
    // Ensure sourcer is defined and has an _id before calling the function
    if (sourcer && sourcer._id) {
      handleClickGetSellerProducts(sourcer._id);
    }
  }, [sourcer, sourcer._id]);

  const handleClickGetSellerProducts = async (id) => {
    try {
      const getProducts = await MainApi.get(`/api/v1/sourcers-products/${id}`);
      console.log('Products', getProducts);
      if (getProducts?.data?.length > 0) {
        setProducts(getProducts.data);
      } else {
        enqueueSnackbar(
          'Products not found with this sourcer. Please try again with another.',
          'error'
        );
        setProducts([]);
        // Optionally call another function if needed
        // handleClickGetSellers();
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
      setProducts([]); // Ensure the products are reset in case of an error
    }
  };

  const handleClickGetSellers = async () => {
    const sellSourcers = await MainApi.get(`/api/v1/sellers?seller_type=sourcer`);
    console.log('Seller', sellSourcers);
    if (sellSourcers.data?.sellers?.length > 0) {
      setSourcers(sellSourcers.data?.sellers);
    } else {
      enqueueSnackbar('An error occurred. Please try again.', 'error');
      // handleClickGetSellers();
    }
  };

  useEffect(() => {
    dispatch(setSourcer(''));
    if (sourcers.length === 0) {
      handleClickGetSellers();
    }
  }, []);

  useEffect(() => {
    dispatch(getConfig());
  }, [dispatch]);

  const defaultValues = {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: [0, 200],
    rating: '',
    sortBy: 'featured',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const isDefault =
    (!dirtyFields.gender &&
      !dirtyFields.category &&
      !dirtyFields.colors &&
      !dirtyFields.priceRange &&
      !dirtyFields.rating) ||
    false;

  const values = watch();

  const dataFiltered = applyFilter(products, values);

  const handleResetFilter = () => {
    reset();
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleRemoveSourcers = () => {
    dispatch(setSourcer(''));
    dispatch(setSourcerCheckoutId(''));
    dispatch(setSourcerName(''));
    handleClickGetSellers();
    setProducts([]);
  };

  return (
    <>
      <Head>
        <title> Ecommerce: Shop | {global?.business_name}</title>
      </Head>

      <FormProvider methods={methods}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="VIP Products Ordering"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Auctions',
                href: PATH_DASHBOARD.eCommerce.root,
              },
              { name: 'Bidding' },
              { name: sourcer?.name },
            ]}
            action={
              sourcer &&
              sourcer._id && (
                <Button
                  onClick={handleRemoveSourcers}
                  variant="contained"
                  startIcon={<Iconify icon="ion:caret-back" />}
                >
                  Back to sourcers
                </Button>
              )
            }
          />

          {!sourcer && !sourcer._id ? (
            <>
              <SourcerList
                sourcers={sourcers}
                searchSourcers={searchSourcers}
                onSearchSourcers={(event) => setSearchSourcers(event.target.value)}
              />
            </>
          ) : (
            sourcer &&
            sourcer._id && (
              <>
                <Stack
                  spacing={2}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ sm: 'center' }}
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <ShopProductSearch />

                  <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                    <ShopFilterDrawer
                      isDefault={isDefault}
                      open={openFilter}
                      onOpen={handleOpenFilter}
                      onClose={handleCloseFilter}
                      onResetFilter={handleResetFilter}
                    />
                    <ShopProductSort />
                  </Stack>
                </Stack>

                <Stack sx={{ mb: 3 }}>
                  {!isDefault && (
                    <>
                      <Typography variant="body2" gutterBottom>
                        <strong>{dataFiltered.length}</strong>
                        &nbsp;Products found
                      </Typography>

                      <ShopTagFiltered isFiltered={!isDefault} onResetFilter={handleResetFilter} />
                    </>
                  )}
                </Stack>

                <ShopProductList products={dataFiltered} loading={!products.length && isDefault} />

                <CartWidget totalItems={checkout.totalItems} />
              </>
            )
          )}
        </Container>
      </FormProvider>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, filters) {
  const { name, description, priceRange, category, sortBy } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }

  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }

  // FILTER PRODUCTS
  // if (gender.length) {
  //   products = products.filter((product) => gender.includes(product.gender));
  // }

  // if (category !== 'All') {
  //   products = products.filter((product) => product.category === category);
  // }

  // if (colors.length) {
  //   products = products.filter((product) => product.colors.some((color) => colors.includes(color)));
  // }

  if (min !== 0 || max !== 200) {
    products = products.filter((product) => product.price >= min && product.price <= max);
  }

  return products;
}
