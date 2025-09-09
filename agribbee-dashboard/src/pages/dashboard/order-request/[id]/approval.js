// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// _mock_
import { _invoices } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import OrderRequestApprovalForm from '../../../../sections/@dashboard/order-request/form';

// ----------------------------------------------------------------------

InvoiceEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InvoiceEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { id },
  } = useRouter();

  const formattedQrCode = (qrCode) => {
    // Convert the qrCode format from "WA/2/PA/25/11/24/001" to "WA-2-PA-25-11-24-001"
    return qrCode?.replaceAll('-', '/');
  };
  const viewQr = formattedQrCode(id);

  return (
    <>
      <Head>
        <title> Invoice: Edit | RANCODED UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Approval Request"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.orderRequest.list,
            },
            { name: `#${viewQr}` },
          ]}
        />

        <OrderRequestApprovalForm isApproval viewQr={viewQr} />
      </Container>
    </>
  );
}
