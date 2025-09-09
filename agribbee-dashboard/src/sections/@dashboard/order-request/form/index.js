import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// mock
import { _invoiceAddressFrom } from '../../../../_mock/arrays';
// components
import FormProvider from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';
import { useSnackbar } from 'notistack';
import useCopyToClipboard from 'src/hooks/useCopyToClipboard';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useMutation, useQuery } from 'react-query';
import { OrderRequestApi } from 'src/hooks/react-query/config/orderRequestApi';
import ItemsTableList from '../details/ItemsTableList';
import MainApi from 'src/api/MainApi';
import { OrderApi } from 'src/hooks/react-query/config/orderApi';

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  isApproval: PropTypes.bool,
  viewQr: PropTypes.string,
};

export default function InvoiceNewEditForm({ isApproval, viewQr, isOwnTransfer = false }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [orderDetails, setOrderDetails] = useState();

  const { copy } = useCopyToClipboard();
  const { user } = useAuthContext();
  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const showErrorMessage = () => {
    enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
  };

  const {
    isLoading,
    data: currentRequest,
    isError,
    error,
    refetch: refetchOrderDetails,
  } = useQuery(['order-details', viewQr], () => OrderRequestApi.orderDetails(viewQr), {
    onError: showErrorMessage,
  });

  useEffect(() => {
    if (!orderDetails) {
      refetchOrderDetails();
    }
    setOrderDetails(currentRequest?.data);
    console.log('Current req', currentRequest);
  }, [currentRequest, orderDetails]);

  const NewUserSchema = Yup.object().shape({
    orderStatus: Yup.string().nullable().required('OrderStatus is required'),
    orderStatus: Yup.string().nullable().required('OrderStatus is required'),
    exportAt: Yup.mixed().nullable().required('Export At is required'),
    arrivalAt: Yup.mixed().nullable().required('Arrival At is required'),
  });

  const defaultValues = useMemo(
    () => ({
      orderRequestId: viewQr || '17099',
      orderStatus: orderDetails?.order_req_status || 'accepted',
      exportFrom: null,
      exportAt: orderDetails?.createdAt ? orderDetails?.createdAt : new Date(),
      arrivalAt: new Date(),
      truckId: '',
      trackingCompany: '',
      truckCompanyPhone: '',
    }),
    [orderDetails]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = async (data) => {
    setLoadingSave(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSave(false);
      push(PATH_DASHBOARD.invoice.list);
      console.log('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSave(false);
    }
  };

  const { mutate: orderApprovalMutation, isLoading: orderLoading } = useMutation(
    'order-approval',
    OrderApi.orderRequestApproval
  );

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      setLoadingSend(orderLoading);
      // push(PATH_DASHBOARD.invoice.list);
      console.log(data);
      console.log('DATA', JSON.stringify(data, null, 2));

      orderApprovalMutation(data, {
        onSuccess: () => {
          enqueueSnackbar('Submitted successfully!', { variant: 'success' });
          reset();
          setLoadingSend(orderLoading);
          push(PATH_DASHBOARD.orderRequest.list);
        },
        onError: (error) => {
          console.error(error);
          setLoadingSend(orderLoading);
        },
      });
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress orderDetails={orderDetails} />
        <InvoiceNewEditStatusDate orderDetails={orderDetails} />

        {isOwnTransfer ? <InvoiceNewEditDetails /> : <ItemsTableList orderDetails={orderDetails} />}
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          Save as Draft
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isApproval ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
