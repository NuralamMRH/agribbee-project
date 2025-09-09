import MainApi from "../../../../api/MainApix";
import { useQuery } from "react-query";

export const getCities = async () => {
  const { data } = await MainApi.get("/api/v1/cities");
  return data;
};

export const useGetCities = (onSuccessHandler) => {
  return useQuery("city-list", () => getCities(), {
    onSuccess: onSuccessHandler,
  });
};
