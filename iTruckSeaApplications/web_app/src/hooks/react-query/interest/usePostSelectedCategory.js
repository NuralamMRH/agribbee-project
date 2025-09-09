import { useMutation } from "react-query";
import MainApi from "../../../api/MainApix";

const postHandle = async (values) => {
  console.log(values);
  const { data } = await MainApi.post("/api/v1/user/update-interest", values);
  return data;
};

export const usePostSelectedCategory = () => {
  return useMutation("store_selected_category", postHandle);
};
