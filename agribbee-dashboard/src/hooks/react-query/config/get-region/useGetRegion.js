import { onSingleErrorResponse } from "@/components/ErrorResponse";
import MainApi from "../../../../api/MainApix";
import { useQuery } from "react-query";

export const fetchRegions = async (country) => {
  const endpoint = country
    ? `/api/v1/regions?country=${country}`
    : "/api/v1/regions";
  const { data } = await MainApi.get(endpoint);
  return data;
};

// Custom hook to fetch regions
export const useGetRegion = (country, onSuccessHandler) => {
  return useQuery(["region-list", country], () => fetchRegions(country), {
    enabled: Boolean(country), // Automatically fetch when country exists
    onSuccess: onSuccessHandler,
    onError: onSingleErrorResponse,
  });
};
