import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import MainApi from 'src/api/MainApi';

const updateVessel = async ({ id, formData }) => {
  const { data } = await MainApi.put(`/api/v1/itrucksea/vessel/${id}`, formData);
  return data;
};

export const vesselUpdate = () => {
  return useMutation(updateVessel, {
    mutationKey: 'vessel_update',
    onError: (error) => {
      console.error('Vessel update failed:', error?.response?.data || error.message);
    },
  });
};
