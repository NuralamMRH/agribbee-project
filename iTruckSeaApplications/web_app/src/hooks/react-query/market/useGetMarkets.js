import MainApix from "@/api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async () => {
  const { data } = await MainApix.get(`/api/v1/markets`);
  return data;
};
export const useGetMarkets = (handleSuccess, id) => {
  return useQuery("all-markets", () => getData(), {
    enabled: false,
    onError: onSingleErrorResponse,
    retry: 1,
    onSuccess: handleSuccess,
  });
};
