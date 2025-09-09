import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import MainApi from 'src/api/MainApi';

const createAuction = async (formData) => {
  const { data } = await MainApi.post('/api/v1/seller/create/auction', formData);
  return data;
};

export const sellerAuctionSubmit = () => {
  return useMutation(createAuction, {
    mutationKey: 'seller_auction',
    onError: (error) => {
      console.error('Auction creation failed:', error?.response?.data || error.message);
      toast.error('Failed to create auction. Please try again.');
    },
  });
};
