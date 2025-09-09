import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import MainApi from 'src/api/MainApi';

const updateProduct = async ({ id, formData }) => {
  const { data } = await MainApi.put(`/api/v1/seller/update/product/${id}`, formData);
  return data;
};

export const sellerProductUpdate = () => {
  return useMutation(updateProduct, {
    mutationKey: 'seller_product_update',
    onError: (error) => {
      console.error('Product update failed:', error?.response?.data || error.message);
      toast.error('Failed to update product. Please try again.');
    },
  });
};
