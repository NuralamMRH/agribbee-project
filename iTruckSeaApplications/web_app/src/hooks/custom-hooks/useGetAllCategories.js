import { useQuery } from 'react-query';
import { CategoryApi } from '../react-query/config/categoryApi';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export const useGetAllCategories = (searchKey) => {
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, data, refetch } = useQuery(['category'], () =>
    CategoryApi.categories(searchKey)
  );
  const handleApiCall = async () => await refetch();
  useEffect(() => {
    handleApiCall();
  }, []);
  return data?.data;
};
