import MainApix from "../../../api/MainApix";

export const ConfigApi = {
  config: () =>
    MainApix.get("/api/v1/config").catch((error) => console.log(error)),
};
