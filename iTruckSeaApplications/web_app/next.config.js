/**
 * @type {import('next').NextConfig}
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    '@fullcalendar/common',
    '@fullcalendar/daygrid',
    '@fullcalendar/interaction',
    '@fullcalendar/list',
    '@fullcalendar/react',
    '@fullcalendar/timegrid',
    '@fullcalendar/timeline',
  ],
  trailingSlash: true,
  env: {
    HOST_API_KEY: 'https://server.itrucksea.com',
    NEXT_PUBLIC_BASE_SERVER_URL: 'https://server.itrucksea.com',
    MAPBOX_API: '',
    FIREBASE_API_KEY: '',
    FIREBASE_AUTH_DOMAIN: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_STORAGE_BUCKET: '',
    FIREBASE_MESSAGING_SENDER_ID: '',
    FIREBASE_APPID: '',
    FIREBASE_MEASUREMENT_ID: '',
    AWS_COGNITO_USER_POOL_ID: '',
    AWS_COGNITO_CLIENT_ID: '',
    AUTH0_DOMAIN: '',
    AUTH0_CLIENT_ID: '',
    NEXT_PUBLIC_GOOGLE_MAP_KEY: '',
  },
};

module.exports = nextConfig;
