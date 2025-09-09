import Router from 'next/router';

import { setWelcomeModal } from '@/redux/slices/utils';
import { removeToken } from '../redux/slices/userToken';
import { store } from '../redux/store';
import { useSnackbar } from 'notistack';
// import { CustomToaster, CustomToasterTokenExpired } from './custom-toaster/CustomToaster';
const { enqueueSnackbar, closeSnackbar } = useSnackbar();

const handleTokenExpire = (status) => {
  if (status === 401) {
    if (window?.localStorage.getItem('token')) {
      CustomToasterTokenExpired(
        'Session Time Out',
        'Though it is a development site, our system automatically reset after one hour and that’s why you logged out'
      );
      window?.localStorage.removeItem('token');
      store.dispatch(removeToken());
      store.dispatch(setWelcomeModal(false));
      Router.push('/');
    }
  }
};

export const onErrorResponse = (error) => {
  error?.response?.data?.errors?.forEach((item) => {
    enqueueSnackbar(item?.errMessage, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });

    console.log('ErrorResponse: ', item?.errMessage);
  });
  // handleTokenExpire(error?.response?.status);
};
export const onSingleErrorResponse = (error) => {
  const message = error?.response?.data;
  if (message?.errMessage) {
    enqueueSnackbar(message?.errMessage, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  } else {
    enqueueSnackbar(error, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  }
};
