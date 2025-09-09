import MainApix from "@/api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async () => {
  const { data } = await MainApix.get(`/api/v1/sellers?seller_type=kiosk`);
  return data;
};
export const useGetKiosks = (handleSuccess, id) => {
  return useQuery("all-kiosks", () => getData(), {
    enabled: false,
    onError: onSingleErrorResponse,
    retry: 1,
    onSuccess: handleSuccess,
  });
};
