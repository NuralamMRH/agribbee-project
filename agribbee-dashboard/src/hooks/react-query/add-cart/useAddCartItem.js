import { useMutation } from "react-query";
import MainApi from "../../../api/MainApix";

const addData = async (postData) => {
  const { data } = await MainApi.post("api/v1/customer/cart/add", postData);
  return data;
};

export default function useAddCartItem() {
  return useMutation("add-address", addData);
}
