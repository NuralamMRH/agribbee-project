import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import MainApi from 'src/api/MainApi';

const createProduct = async (formData) => {
  const { data } = await MainApi.post('/api/v1/seller/create/product', formData);
  return data;
};

export const sellerProductSubmit = () => {
  return useMutation(createProduct, {
    mutationKey: 'seller_product',
    onError: (error) => {
      console.error('Product creation failed:', error?.response?.data || error.message);
      toast.error('Failed to create product. Please try again.');
    },
  });
};
