import { useQuery } from "react-query";
import MainApix from "../../../api/MainApix";

export const MarketsApi = {
  markets: ({ offset, page_limit, searchKey }) => {
    return MainApix.get(
      `/api/v1/markets?name=${searchKey}&offset=${offset}&limit=${page_limit}`
    );
  },

  marketDetails: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/market/${id}`);
    }
  },
  locationWiseMarketList: ({ locationType, id }) => {
    return MainApix.get(`/api/v1/markets?${locationType}?=${id}`);
  },
  regionWiseMarketList: (id) => {
    return MainApix.get(`/api/v1/markets/regions?region=${id}`);
  },
  cityWiseMarketList: (type, zip) => {
    return MainApix.get(`/api/v1/markets/cities?${type}=${zip}`);
  },
  marketsUnderCity: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/markets/cities?city=${id}`);
    } else {
      return MainApix.get(`/api/v1/markets`);
    }
  },
};
