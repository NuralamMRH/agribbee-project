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
import AuctionNewEditForm from '../../../../../sections/@dashboard/e-auction/AuctionNewEditForm';
import { useQuery } from 'react-query';
import { AuctionApis } from 'src/hooks/react-query/config/auctionsApi';
import { useSnackbar } from 'notistack';
import LoadingScreen from 'src/components/loading-screen';

// ----------------------------------------------------------------------

AuctionProductEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function AuctionProductEditPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const {
    query: { name },
  } = useRouter();

  const {
    data: getAuctionsData,
    refetch: refetchAuctions,
    isLoading,
  } = useQuery(
    ['live_auction'],
    () => AuctionApis.auctionBySlug(name), // Pass offset and limit as well
    {
      enabled: false,
      staleTime: 1000 * 60 * 8,
      onError: (err) => {
        enqueueSnackbar('Auctions not found', 'error');
      },
    }
  );

  useEffect(() => {
    if (name) refetchAuctions();
  }, [name]);

  return (
    <>
      <Head>
        <title> Auction: Edit auction | iTruckSea</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'e-auction',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'edit auction' },
          ]}
        />

        {!isLoading ? (
          <AuctionNewEditForm isEdit currentProduct={!isLoading && getAuctionsData?.data} />
        ) : (
          <LoadingScreen />
        )}
      </Container>
    </>
  );
}
