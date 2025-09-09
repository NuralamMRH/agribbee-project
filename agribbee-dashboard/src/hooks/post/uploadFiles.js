import { useMutation } from 'react-query';
import MainApi from 'src/api/MainApi';

const uploadFile = async (formData) => {
  const { data } = await MainApi.post('/api/v1/upload-file', formData);
  return data;
};

export const uploadFiles = () => {
  return useMutation('upload-files', uploadFile);
};
