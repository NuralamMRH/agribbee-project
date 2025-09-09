import { useQuery } from 'react-query';
import MainApi from 'src/api/MainApi';

export const getData = async (params) => {
  const { slug, campaign } = params;
  console.log('params: ', slug);
  const tempUrl = campaign
    ? `/api/v1/products?slug=${slug}?campaign=${campaign}`
    : `/api/v1/products?slug=${slug}`;
  const { data } = await MainApi.get(`${tempUrl}`);
  return data;
};
export const useGetProductDetails = (params, itemSuccess) => {
  return useQuery('product-Details', () => getData(params), {
    enabled: false,
    onSuccess: itemSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
};
