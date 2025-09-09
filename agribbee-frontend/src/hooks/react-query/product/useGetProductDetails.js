import MainApix from "../../../api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async (params) => {
  const { id, campaign, page_limit, offset } = params;
  const tempUrl = campaign
    ? `/api/v1/products/${id}?campaign=${campaign}`
    : `/api/v1/products/${id}`;
  const { data } = await MainApix.get(`${tempUrl}`);
  return data;
};
export const useGetProductDetails = (params, itemSuccess) => {
  return useQuery("product-Details", () => getData(params), {
    enabled: false,
    onSuccess: itemSuccess,
    onError: onSingleErrorResponse,
  });
};
