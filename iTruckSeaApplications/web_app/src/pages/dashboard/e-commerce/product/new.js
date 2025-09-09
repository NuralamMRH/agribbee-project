// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../../../sections/@dashboard/e-commerce/ProductNewEditForm';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

EcommerceProductCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function EcommerceProductCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { global } = useSelector((state) => state.globalSettings);

  return (
    <>
      <Head>
        <title> Trip: Request to Departure | iTruckSea</title>
      </Head>

      <Container maxWidth={themeStretch ? 'md' : 'sm'}>
        <CustomBreadcrumbs
          heading="Create a new request"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Request Dock',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'New request' },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </>
  );
}
