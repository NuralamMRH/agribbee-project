import MainApi from "../../../api/MainApi";
import { useQuery } from "react-query";

// export const landingPagedata = async () => {
//     const { data } = await MainApi.get('/api/v1/react-landing-page')
//     return data
// }
export const landingPagedata = async () => {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "vi";
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/react-landing-page`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );

  // Parse the JSON data from the response
  const data = await response.json();

  // console.log('Data:', data)
  return data;
};
export const useGetLandingPageData = (onSuccessHandler) => {
  return useQuery("landing_page_data", () => landingPagedata(), {
    onSuccess: onSuccessHandler,
    enabled: false,
  });
};
