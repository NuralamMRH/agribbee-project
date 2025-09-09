import MainApi from "../../../api/MainApi";
import MainApix from "../../../api/MainApix";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../components/ErrorResponse";

export const getData = async (searchValue) => {
  if (searchValue.trim().length >= 1) {
    const { data } = await MainApix.get(`/api/v1/search?name=${searchValue}`);
    return data;
  }
};
export const useGetSuggestSearchResult = (searchValue) => {
  return useQuery("suggest-search", () => getData(searchValue), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
};
