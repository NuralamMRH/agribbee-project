import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import MainApi from 'src/api/MainApi';

const updateAuction = async ({ id, formData }) => {
  const { data } = await MainApi.put(`/api/v1/seller/update/auction/${id}`, formData);
  return data;
};

export const sellerAuctionUpdate = () => {
  return useMutation(updateAuction, {
    mutationKey: 'seller_auction_update',
    onError: (error) => {
      console.error('Auction update failed:', error?.response?.data || error.message);
      toast.error('Failed to update auction. Please try again.');
    },
  });
};
