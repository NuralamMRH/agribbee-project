import MainApi from "../../../../api/MainApix";
import { useQuery } from "react-query";

export const zoneList = async (city) => {
  if (city) {
    const { data } = await MainApi.get(`/api/v1/markets?city=${city}`);
    return data;
  }
  const { data } = await MainApi.get("/api/v1/markets");
  return data;
};
export const useGetMarkets = (onSuccessHandler, city) => {
  return useQuery("markets-list", () => marketList(city), {
    enabled: false,
    onSuccess: onSuccessHandler,
  });
};
