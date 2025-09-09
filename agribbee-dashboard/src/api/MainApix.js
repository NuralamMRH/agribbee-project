import axios from 'axios';

export const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

//const baseUrl = 'http://localhost:5000/api/v1/'

const MainApix = axios.create({
  baseURL: baseUrl,
});

MainApix.interceptors.request.use(function (config) {
  let zoneId = undefined;
  let token = undefined;
  let language = undefined;
  let currentLocation = undefined;
  let software_id = 33571750;
  let hostname = process.env.NEXT_CLIENT_HOST_URL;

  if (typeof window !== 'undefined') {
    zoneId = localStorage.getItem('zoneid');
    token = localStorage.getItem('token');
    language = localStorage.getItem('i18nextLng');
    currentLocation = JSON.parse(localStorage.getItem('currentLatLng'));
    //hostname = window.location.hostnam
  }
  if (currentLocation) config.headers.latitude = currentLocation.lat;
  if (currentLocation) config.headers.longitude = currentLocation.lng;
  if (zoneId) config.headers.zoneId = zoneId;
  if (token) config.headers.authorization = `Bearer ${token}`;
  if (language) config.headers['X-localization'] = language;
  if (hostname) config.headers['origin'] = hostname;
  config.headers['X-software-id'] = software_id;

  return config;
});
export default MainApix;
