import MainApix from 'src/api/MainApix';

export const MostReviewedApi = {
  reviewed: () => MainApix.get('/api/v1/auctions/most-reviewed'),
};
export const PopularAuctionNearbyApi = {
  popularAuction: () => MainApix.get('/api/v1/auctions/popular'),
};
export const AuctionApis = {
  auctionBySlug: (slug) => {
    return MainApix.get(`/api/v1/get/auction/${slug}`);
  },

  latestAuctions: ({ seller_id, category_id, auction_type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/auctions?seller_id=${seller_id}&category_id=${category_id}&auction_type=${auction_type}&offset=${offset}&limit=${page_limit}`
    );
  },

  searchLatestAuctions: ({ seller_id, searchKey, auction_type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/auctions/search?seller_id=${seller_id}&name=${searchKey}&auction_type=${auction_type}&offset=${offset}&limit=${page_limit}`
    );
  },
};

export const AuctionsApi = {
  myAuctions: () => MainApix.get(`/api/v1/me/auctions`),

  reviewed: () => MainApix.get('/api/v1/auctions/most-reviewed'),
  popularAuction: () => MainApix.get('/api/v1/auctions/popular'),

  latestAuctions: ({ seller_id, category_id, auction_type, pageOffset, pageLimit }) => {
    return MainApix.get(
      `/api/v1/auctions?auction_type=${auction_type}&seller_id=${seller_id}&category_id=${category_id}&offset=${pageOffset}&limit=${pageLimit}`
    );
  },

  auctions: (auction_type, limit, offset) =>
    MainApix.get(`/api/v1/auctions?auction_type=${auction_type}&limit=${limit}&offset=${offset}`),

  regionAuctions: (auction_type, category_id, region_id, keyword, shipping_date, limit, offset) =>
    MainApix.get(
      `/api/v1/auctions?auction_type=${auction_type}${
        category_id && `&category_id=${category_id}`
      }${region_id ? `&region=${region_id}` : ''}${keyword ? `&keyword=${keyword}` : ''}${
        shipping_date ? `&shipping_date[lte]=${shipping_date}` : ''
      }&limit=${limit}&offset=${offset}`
    ),

  auctionSearch: (search_type, value, offset, page_limit, filterData) => {
    const type = filterData?.filterBy?.surplus
      ? 'surplus_auction'
      : filterData?.filterBy?.live
      ? 'live_auction'
      : filterData?.filterBy?.future
      ? 'future_delivery'
      : filterData?.filterBy?.catch_auction
      ? 'catch_auction'
      : null;
    if (value !== '') {
      return MainApix.get(
        `/api/v1/${search_type}/search?auction_type=${type}name=${
          value === undefined ? null : value
        }&offset=${offset}&limit=${page_limit}&new=${filterData?.filterBy?.new ? 1 : 0}&popular=${
          filterData?.filterBy?.popular ? 1 : 0
        }&rating_4_plus=${filterData?.filterBy?.rating ? 1 : 0}&rating_3_plus=${
          filterData?.filterBy?.ratings ? 1 : 0
        }&rating_5=${filterData?.filterBy?.rating5 ? 1 : 0}&discounted=${
          filterData?.filterBy?.discounted ? 1 : 0
        }&sort_by=${filterData?.sortBy}`
      );
    }
  },

  addFavoriteAuction: (auction_id) => {
    return MainApix.post(`/api/v1/customer/wish-list/add?auction_id=${auction_id}`);
  },
  suggestedAuctions: () => MainApix.get(`/api/v1/customer/suggested-foods`),
};

export const ProductApis = {
  latestProduct: ({ seller_id, category_id, type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/products/latest?seller_id=${seller_id}&category_id=${category_id}&type=${type}&offset=${offset}&limit=${page_limit}`
    );
  },
  latestAuctions: ({ seller_id, category_id, type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/auctions/latest?seller_id=${seller_id}&category_id=${category_id}&type=${type}&offset=${offset}&limit=${page_limit}`
    );
  },
  searchLatestProducts: ({ seller_id, searchKey, type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/products/search?seller_id=${seller_id}&name=${searchKey}&type=${type}&offset=${offset}&limit=${page_limit}`
    );
  },
  searchLatestAuctions: ({ seller_id, searchKey, type, offset, page_limit }) => {
    return MainApix.get(
      `/api/v1/auctions/search?seller_id=${seller_id}&name=${searchKey}&type=${type}&offset=${offset}&limit=${page_limit}`
    );
  },
};

export const ProductsApi = {
  reviewed: () => MainApix.get('/api/v1/products/most-reviewed'),
  popularFood: () => MainApix.get('/api/v1/products/popular'),
  latestProducts: ({ seller_id, category_id, type, pageOffset, pageLimit }) => {
    return MainApix.get(
      `/api/v1/products/latest?seller_id=${seller_id}&category_id=${category_id}&type=${type}&offset=${pageOffset}&limit=${pageLimit}`
    );
  },
  latestAuctions: ({ seller_id, category_id, type, pageOffset, pageLimit }) => {
    return MainApix.get(
      `/api/v1/auctions/latest?seller_id=${seller_id}&category_id=${category_id}&type=${type}&offset=${pageOffset}&limit=${pageLimit}`
    );
  },

  products: (product_type, offset, page_limit, type) =>
    MainApix.get(
      `/api/v1/products/${product_type}?offset=${offset}&limit=${page_limit}&type=${type}`
    ),
  auctions: (auction_type, offset, page_limit, type) =>
    MainApix.get(
      `/api/v1/auctions/auction_type=${auction_type}?offset=${offset}&limit=${page_limit}&type=${type}`
    ),
  productSearch: (search_type, value, offset, page_limit, filterData) => {
    if (value !== '') {
      return MainApix.get(
        `/api/v1/${search_type}/search?name=${
          value === undefined ? null : value
        }&offset=${offset}&limit=${page_limit}&new=${filterData?.filterBy?.new ? 1 : 0}&popular=${
          filterData?.filterBy?.popular ? 1 : 0
        }&rating_4_plus=${filterData?.filterBy?.rating ? 1 : 0}&rating_3_plus=${
          filterData?.filterBy?.ratings ? 1 : 0
        }&rating_5=${filterData?.filterBy?.rating5 ? 1 : 0}&discounted=${
          filterData?.filterBy?.discounted ? 1 : 0
        }&sort_by=${filterData?.sortBy}`
      );
    }
  },
  auctionSearch: (search_type, value, offset, page_limit, filterData) => {
    const type = filterData?.filterBy?.surplus
      ? 'surplus_auction'
      : filterData?.filterBy?.live
      ? 'live_auction'
      : filterData?.filterBy?.future
      ? 'future_delivery'
      : filterData?.filterBy?.catch_auction
      ? 'catch_auction'
      : null;
    if (value !== '') {
      return MainApix.get(
        `/api/v1/${search_type}/search?auction_type=${type}name=${
          value === undefined ? null : value
        }&offset=${offset}&limit=${page_limit}&new=${filterData?.filterBy?.new ? 1 : 0}&popular=${
          filterData?.filterBy?.popular ? 1 : 0
        }&rating_4_plus=${filterData?.filterBy?.rating ? 1 : 0}&rating_3_plus=${
          filterData?.filterBy?.ratings ? 1 : 0
        }&rating_5=${filterData?.filterBy?.rating5 ? 1 : 0}&discounted=${
          filterData?.filterBy?.discounted ? 1 : 0
        }&sort_by=${filterData?.sortBy}`
      );
    }
  },

  addFavorite: (product_id) => {
    return MainApix.post(`/api/v1/customer/wish-list/add?product_id=${product_id}`);
  },
  addFavoriteAuction: (auction_id) => {
    return MainApix.post(`/api/v1/customer/wish-list/add?auction_id=${auction_id}`);
  },
  suggestedProducts: () => MainApix.get(`/api/v1/customer/suggested-foods`),
  suggestedAuctions: () => MainApix.get(`/api/v1/customer/suggested-foods`),
};
