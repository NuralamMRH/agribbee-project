import MainApix from "../../../api/MainApix";

export const RegionsApi = {
  regions: () => {
    return MainApix.get(`/api/v1/regions`);
  },

  countryRegions: (country) => {
    if (country && country !== "") {
      return MainApix.get(`/api/v1/regions?country=${country}`);
    } else {
      return MainApix.get(`/api/v1/regions`);
    }
  },

  regionDetails: (id) => {
    if (id) {
      return MainApix.get(`/api/v1/region/${id}`);
    }
  },
};
