import { useQuery } from "react-query";
import MainApix from "../../../api/MainApix";

export const kiosksApi = {
  sellers: ({ offset, page_limit, searchKey }) => {
    return MainApix.get(
      `/api/v1/sellers?name=${searchKey}&offset=${offset}&limit=${page_limit}`
    );
  },

  kioskDetails: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/seller/${id}`);
    }
  },
  locationWiseKioskList: ({ sellerType, locationType, id }) => {
    return MainApix.get(
      `/api/v1/sellers?seller_type=${sellerType}&${locationType}?=${id}`
    );
  },
  regionWiseKioskList: ({ sellerType, id }) => {
    return MainApix.get(
      `/api/v1/sellers/location?seller_type=${sellerType}&region=${id}`
    );
  },
  cityWiseKioskList: ({ sellerType, type, id }) => {
    return MainApix.get(
      `/api/v1/sellers/location?seller_type=${sellerType}&${type}=${id}`
    );
  },
  marketWiseKioskList: (sellerType, id) => {
    return MainApix.get(
      `/api/v1/sellers?seller_type=${sellerType}&market=${id}`
    );
  },
};
