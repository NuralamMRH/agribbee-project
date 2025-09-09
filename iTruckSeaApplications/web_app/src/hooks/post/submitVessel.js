import MainApi from '@/api/MainApi';
import { useMutation, useQueryClient } from 'react-query';

const createVessel = async (formData) => {
  try {
    console.log('Sending create vessel request with data:', formData);
    const response = await MainApi.post('/api/v1/vessel-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create vessel response:', response);
    return response.data;
  } catch (error) {
    console.error('Create vessel error:', error);
    throw error.response?.data || error.message;
  }
};

const updateVessel = async ({ id, formData }) => {
  try {
    console.log('Sending update vessel request with data:', formData);
    const response = await MainApi.put(`/api/v1/vessel-settings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update vessel response:', response);
    return response.data;
  } catch (error) {
    console.error('Update vessel error:', error);
    throw error.response?.data || error.message;
  }
};

export const submitVessel = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createVessel,
    onSuccess: () => {
      queryClient.invalidateQueries(['vessels']);
    },
    onError: (error) => {
      console.error('Create mutation error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateVessel,
    onSuccess: () => {
      queryClient.invalidateQueries(['vessels']);
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
    },
  });

  return {
    createVessel: createMutation.mutate,
    updateVessel: updateMutation.mutate,
    isLoading: createMutation.isLoading || updateMutation.isLoading,
    error: createMutation.error || updateMutation.error,
  };
};
