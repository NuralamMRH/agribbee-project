import MainApix from "@/api/MainApix";

export const MarketsApiNearBy = {
  markets: ({ offset, page_limit, searchKey }) => {
    return MainApix.get(
      `/api/v1/markets?name=${searchKey}&offset=${offset}&limit=${page_limit}`
    );
  },
};
