import MainApix from "@/api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async (auction_type) => {
  const { data } = await MainApix.get(
    `/api/v1/auctions?auction_type=${auction_type}`
  );
  return data;
};
export const useGetAuctions = (handleSuccess, auction_type) => {
  return useQuery("all-auctions", () => getData(auction_type), {
    enabled: false,
    onError: onSingleErrorResponse,
    retry: 1,
    onSuccess: handleSuccess,
  });
};
