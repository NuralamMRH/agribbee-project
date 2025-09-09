import MainApix from "../../../api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async () => {
  const { data } = await MainApix.get("/api/v1/packages");
  return data;
};
export const useGetPackages = (itemSuccess) => {
  return useQuery("packages-list", () => getData(), {
    enabled: false,
    onSuccess: itemSuccess,
    onError: onSingleErrorResponse,
  });
};
