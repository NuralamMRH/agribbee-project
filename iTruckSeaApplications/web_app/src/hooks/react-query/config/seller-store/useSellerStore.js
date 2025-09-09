import MainApi from "../../../../api/MainApix";
import { useMutation } from "react-query";

const storeSellerData = async (sellerJoinData) => {
  let formData = new FormData();

  // Loop through each field in the seller data
  Object.keys(sellerJoinData).forEach((key) => {
    const value = sellerJoinData[key];

    if (value instanceof File) {
      // Append file fields
      formData.append(key, value);
    } else if (typeof value === "object" && value !== null) {
      // Handle language-based fields like "name", "description", etc.
      Object.entries(value).forEach(([field, langValue]) => {
        formData.append(`${key}.${field}`, langValue);
      });
    } else {
      // Append other fields
      formData.append(key, value);
    }
  });

  // Send formData to API
  const { data } = await MainApi.post("/api/v1/seller/register", formData);
  return data;
};

export const useSellerJoin = () => {
  return useMutation("seller_store", storeSellerData);
};
