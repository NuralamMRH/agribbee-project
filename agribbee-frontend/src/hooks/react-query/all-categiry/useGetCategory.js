import { useQuery } from "react-query";
import MainApix from "../../../api/MainApix";
import { onErrorResponse } from "../../../components/ErrorResponse";

const getData = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    return MainApix.get(`/api/v1/categories?name=${searchKey}`);
  } else {
    return MainApix.get(`/api/v1/categories`);
  }
  return 0;
};
export const useGetCategories = (handleRequestOnSuccess) => {
  return useQuery("get_categories_list", () => getData(), {
    onSuccess: handleRequestOnSuccess,
    onError: onErrorResponse,
  });
};
