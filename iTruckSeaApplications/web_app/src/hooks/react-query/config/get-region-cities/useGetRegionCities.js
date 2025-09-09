import MainApi from "../../../../api/MainApix";
import { useQuery } from "react-query";

export const zoneList = async (region) => {
  if (region) {
    const { data } = await MainApi.get(`/api/v1/cities?region=${region}`);
    return data;
  }
  const { data } = await MainApi.get("/api/v1/regions");
  return data;
};
export const useGetRegionCities = (onSuccessHandler, region) => {
  return useQuery("region-list", () => zoneList(region), {
    enabled: false,
    onSuccess: onSuccessHandler,
  });
};
