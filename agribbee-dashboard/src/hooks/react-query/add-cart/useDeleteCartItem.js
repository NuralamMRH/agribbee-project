import { useMutation } from "react-query";
import MainApi from "../../../api/MainApix";

const deleteItem = async (cartIdAndGuestId) => {
  const url = `api/v1/customer/cart/remove-item?cart_id=${cartIdAndGuestId?.cart_id}`;
  const fullUrl = cartIdAndGuestId?.guestId
    ? `${url}&guest_id=${cartIdAndGuestId.guestId}`
    : url;
  const { data } = await MainApi.delete(fullUrl);
  return data;
};

export default function useDeleteCartItem() {
  return useMutation("delete-all-cart-item", deleteItem);
}
