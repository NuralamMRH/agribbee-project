import MainApix from "../../../api/MainApix";

export const PackageApi = {
  packages: () => {
    return MainApix.get(`/api/v1/packages`);
  },
  package: (id) => {
    return MainApix.get(`/api/v1/packages/${id}`);
  },
};
