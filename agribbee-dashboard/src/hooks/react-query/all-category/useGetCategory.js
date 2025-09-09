import { useQuery } from 'react-query';
import { useSnackbar } from 'notistack';
import MainApix from 'src/api/MainApix';

const getData = async (searchKey) => {
  if (searchKey && searchKey !== '') {
    return MainApix.get(`/api/v1/categories?name=${searchKey}`);
  } else {
    return MainApix.get(`/api/v1/categories`);
  }
  return 0;
};
export const useGetCategories = (handleRequestOnSuccess) => {
  console.log('MainApix :', MainApix);
  const { enqueueSnackbar } = useSnackbar();
  return useQuery('get_categories_list', () => getData(), {
    onSuccess: handleRequestOnSuccess,
    onError: enqueueSnackbar('Categories cannot get!', { variant: 'error' }),
  });
};
