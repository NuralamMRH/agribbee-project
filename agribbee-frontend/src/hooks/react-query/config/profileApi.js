import MainApix from "../../../api/MainApix";
import { getToken } from "../../../components/checkout-page/functions/getGuestUserId";

export const ProfileApi = {
  profileInfo: () => {
    const token = getToken();
    if (token) {
      return MainApix.get("/api/v1/me");
    }
  },
  profileUpdate: (profileData) =>
    MainApix.put("/api/v1/me/update", profileData),
};
