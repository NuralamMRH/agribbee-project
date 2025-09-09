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
import AuctionNewEditForm from '../../../../sections/@dashboard/e-auction/AuctionNewEditForm';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

AuctionProductCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function AuctionProductCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { global } = useSelector((state) => state.globalSettings);

  return (
    <>
      <Head>
        <title> Auction: Create new | {global?.business_name}</title>
      </Head>

      <Container maxWidth={themeStretch ? 'md' : 'sm'}>
        <CustomBreadcrumbs
          heading="Create a new auction"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'e-auction',
              href: PATH_DASHBOARD.auction.root,
            },
            { name: 'New auction' },
          ]}
        />
        <AuctionNewEditForm />
      </Container>
    </>
  );
}
