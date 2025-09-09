import MainApix from "../../../api/MainApix";

export const CitiesApi = {
  cities: ({ offset, page_limit, searchKey }) => {
    return MainApix.get(
      `/api/v1/cities?name=${searchKey}&offset=${offset}&limit=${page_limit}`
    );
  },

  cityByZip: (zip) => {
    return MainApix.get(`/api/v1/cities?zip=${zip}`);
  },

  region: (region) => {
    if (region && region !== "") {
      return MainApix.get(`/api/v1/cities?region=${region}`);
    } else {
      return MainApix.get(`/api/v1/cities`);
    }
  },

  cityDetails: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/city/${id}`);
    }
  },
  locationWiseCityList: ({ locationType, type }) => {
    return MainApix.get(`/api/v1/cities/${locationType}?type=${type}`);
  },
  regionWiseCityList: (id) => {
    return MainApix.get(`/api/v1/cities/region=${id}`);
  },
};
