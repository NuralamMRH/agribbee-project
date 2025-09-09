// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _invoices } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import InvoiceDetails from '../../../../sections/@dashboard/order-request/details';
import NextLink from 'next/link';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

InvoiceDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const {
    query: { id },
  } = useRouter();
  const { push } = useRouter();
  const formattedQrCode = (qrCode) => {
    // Convert the qrCode format from "WA/2/PA/25/11/24/001" to "WA-2-PA-25-11-24-001"
    return qrCode?.replaceAll('-', '/');
  };

  const viewQr = formattedQrCode(id);

  const handleApproval = () => {
    push(PATH_DASHBOARD.orderRequest.approval(id));
  };

  return (
    <>
      <Head>
        <title> Order Request: View | iTruckSea</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Request Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Order Request',
              href: PATH_DASHBOARD.orderRequest.root,
            },
            { name: `#${viewQr}` },
          ]}
          action={
            <Button
              onClick={handleApproval}
              variant="contained"
              startIcon={<Iconify icon="lsicon:submit-filled" />}
            >
              Accept Request
            </Button>
          }
        />

        <InvoiceDetails viewQr={viewQr} />
      </Container>
    </>
  );
}
