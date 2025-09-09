import MainApi from "../../../api/MainApi";
import MainApix from "../../../api/MainApix";

export const GoogleApi = {
  placeApiAutocomplete: (search) => {
    if (search && search !== "") {
      return MainApix.get(
        `/api/v1/config/place-api-autocomplete?search_text=${search}`
      );
    }
  },

  placeApiDetails: (placeId) => {
    return MainApix.get(`/api/v1/config/place-api-details?placeid=${placeId}`);
  },

  // getZoneId: (location) => {
  //   return MainApi.get(
  //     `/api/v1/config/get-zone-id?lat=${location?.lat}&lng=${location?.lng}`
  //   );
  // },

  getZoneId: (location) => {
    return MainApix.get(
      `/api/v1/config/get-nearby-city?lat=${location?.lat}&lng=${location?.lng}`
    );
  },
  distanceApi: (origin, destination) => {
    return MainApix.get(
      `/api/v1/config/distance-api?origin_lat=${origin.latitude}&origin_lng=${
        origin.longitude
      }&destination_lat=${
        destination.lat ? destination?.lat : destination?.latitude
      }&destination_lng=${
        destination.lng ? destination?.lng : destination?.longitude
      }`
    );
  },
  geoCodeApi: (location) => {
    if (!location.lat || !location.lng) return;
    return MainApix.get(
      `/api/v1/config/geocode-api?lat=${location?.lat}&lng=${location?.lng}`
    );
  },
};
