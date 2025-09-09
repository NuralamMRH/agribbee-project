// i18n
import '../locales/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
/* eslint-disable import/no-unresolved */
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
// next
import Head from 'next/head';
// redux
import { Provider as ReduxProvider } from 'react-redux';
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// redux
import { store } from '../redux/store';
// utils
import createEmotionCache from '../utils/createEmotionCache';
// theme
import ThemeProvider from '../theme';
// locales
import ThemeLocalization from '../locales';

import i18n, { t } from 'i18next';

// components
import { StyledChart } from '../components/chart';
import ProgressBar from '../components/progress-bar';
import SnackbarProvider from '../components/snackbar';
import { MotionLazyContainer } from '../components/animate';
import { ThemeSettings, SettingsProvider } from '../components/settings';

// Check our docs
// https://docs.minimals.cc/authentication/js-version

import { AuthProvider } from '../auth/JwtContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import DynamicFavicon from 'src/components/favicon/DynamicFavicon';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Import the setSession function
import { setSession } from '../auth/utils';
// import { AuthProvider } from '../auth/Auth0Context';
// import { AuthProvider } from '../auth/FirebaseContext';
// import { AuthProvider } from '../auth/AwsCognitoContext';

// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache();

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
  emotionCache: PropTypes.object,
};

export default function MyApp(props) {
  const queryClient = new QueryClient();
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const router = useRouter();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    // Check for token in URL parameters (for cross-domain login)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      if (tokenFromUrl) {
        // Store the token and clean the URL
        localStorage.setItem('accessToken', tokenFromUrl);
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('agribbeeUserToken', tokenFromUrl);
        setSession(tokenFromUrl);
        
        // Remove token from URL to avoid security issues
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Check for existing token
        const globalUserToken = localStorage.getItem('agribbeeUserToken');
        if (globalUserToken) {
          localStorage.setItem('accessToken', globalUserToken);
          localStorage.setItem('token', globalUserToken);
          setSession(globalUserToken);
        }
      }
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <AuthProvider>
          <ReduxProvider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <MotionLazyContainer>
                  <ThemeProvider>
                    <ThemeSettings>
                      <ThemeLocalization>
                        <SnackbarProvider>
                          <Head>
                            <title>{t('Agribbee')}</title>
                          </Head>
                          <DynamicFavicon />
                          <StyledChart />
                          <ProgressBar />
                          {getLayout(<Component {...pageProps} />)}
                        </SnackbarProvider>
                      </ThemeLocalization>
                    </ThemeSettings>
                  </ThemeProvider>
                </MotionLazyContainer>
              </SettingsProvider>
            </LocalizationProvider>
          </ReduxProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}
