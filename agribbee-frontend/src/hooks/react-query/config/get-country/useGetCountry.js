import MainApi from "../../../../api/MainApix";
import { useQuery } from "react-query";

export const zoneList = async () => {
  const { data } = await MainApi.get("/api/v1/countries");
  return data;
};
export const useGetCountry = (onSuccessHandler) => {
  return useQuery("country-list", () => zoneList(), {
    enabled: false,
    onSuccess: onSuccessHandler,
  });
};
