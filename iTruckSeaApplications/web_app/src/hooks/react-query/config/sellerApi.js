import { useQuery } from 'react-query';
import MainApix from '../../../api/MainApix';

export const sellerApi = {
  sellers: ({ offset, page_limit, searchKey }) => {
    return MainApix.get(`/api/v1/sellers?name=${searchKey}&offset=${offset}&limit=${page_limit}`);
  },
  sellerType: ({ sellerType }) => {
    return MainApix.get(`/api/v1/sellers?seller_type=${sellerType}`);
  },

  sellerDetails: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/seller/${id}`);
    }
  },
  locationWiseSellerList: ({ sellerType, locationType, id }) => {
    return MainApix.get(`/api/v1/sellers?seller_type=${sellerType}&${locationType}?=${id}`);
  },
  regionWiseSellerList: ({ sellerType, id }) => {
    return MainApix.get(`/api/v1/sellers/location?seller_type=${sellerType}&region=${id}`);
  },
  cityWiseSellerList: ({ sellerType, type, id }) => {
    return MainApix.get(`/api/v1/sellers/location?seller_type=${sellerType}&${type}=${id}`);
  },
  marketWiseSellerList: (sellerType, id) => {
    return MainApix.get(`/api/v1/sellers?seller_type=${sellerType}&market=${id}`);
  },
};
