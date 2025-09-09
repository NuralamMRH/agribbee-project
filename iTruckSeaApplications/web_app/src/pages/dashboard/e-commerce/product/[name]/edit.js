import { useEffect } from 'react';
import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../../redux/store';
import { getProducts } from '../../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../../../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

EcommerceProductEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const {
    query: { name },
  } = useRouter();

  const currentProduct = useSelector((state) =>
    state.product.products.find((product) => paramCase(product.slug) === name)
  );

  return (
    <>
      <Head>
        <title> Request Dock: Edit request | iTruckSea</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Request"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Request Dock',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            { name: currentProduct?.name },
          ]}
        />

        <ProductNewEditForm isEdit currentRequestDock={currentProduct} />
      </Container>
    </>
  );
}
