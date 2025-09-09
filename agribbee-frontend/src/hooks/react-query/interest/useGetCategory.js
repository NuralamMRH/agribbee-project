import MainApix from "../../../api/MainApix";
import { useQuery } from "react-query";

export const categoryList = async () => {
  const { data } = await MainApix.get("/api/v1/categories");
  return data;
};
export const useGetCategory = (onSuccessHandler) => {
  return useQuery("category-list", () => categoryList(), {
    onSuccess: onSuccessHandler,
  });
};
