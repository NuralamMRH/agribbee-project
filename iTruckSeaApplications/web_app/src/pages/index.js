import { m, useScroll, useSpring } from 'framer-motion';
// next
import Head from 'next/head';
// @mui

import { Box } from '@mui/material';
// layouts
import MainLayout from '../layouts/main';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeForDesigner,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from '../sections/home';
import { CustomHeader } from '../api/Headers';
import currentLang from '../locales/current-lang';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGlobalSettings } from '../redux/slices/global';
import PropTypes from 'prop-types';
import Meta from 'src/utils/Meta';
import { useRouter } from 'next/router';
import Home4Block from '@/sections/home/Home4Block';
import HomeMoreDetails from '@/sections/home/HomeMoreDetails';

// ----------------------------------------------------------------------

HomePage.getLayout = (page) => <MainLayout> {page} </MainLayout>;

// ----------------------------------------------------------------------

// HomePage.propTypes = {
//   configData: PropTypes.array,
// };

export default function HomePage(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { configData, landingPageData } = props;

  // useEffect(() => {
  //   dispatch(setGlobalSettings(configData));
  // });

  // useEffect(() => {
  //   if (configData && landingPageData) {
  //     // Check if both are empty arrays
  //     if (configData.length === 0 && landingPageData.length === 0) {
  //       router.push('/404');
  //       return; // Prevent further execution
  //     }
  //     if (configData.maintenance_mode) {
  //       router.push('/maintenance');
  //       //return;
  //     }
  //     // dispatch(setGlobalSettings(configData));
  //   }
  // }, [configData, landingPageData, router, dispatch]);

  // const siteLogo = `${configData?.base_urls?.business_logo_path}/${configData?.logo}`;

  // const business_name = configData?.business_name;

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progress = (
    <m.div
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1999,
        position: 'fixed',
        transformOrigin: '0%',
        backgroundColor: (theme) => theme.palette.primary.main,
        scaleX,
      }}
    />
  );

  return (
    <>
      <Meta
        title={'iTruckSea'} //configData?.business_name
        ogImage={'/logo/i-truck-sea.png'}
        keywords={'iTruckSea'}
      />

      {progress}

      <Home4Block />

      {/* <HomeHero /> */}

      {/* <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {' '}
      </Box> */}
      <HomeMinimal />

      <HomeMoreDetails />

      {/* <HomeLookingFor /> */}

      {/* <HomeAdvertisement /> */}
    </>
  );
}

// export const getServerSideProps = async (context) => {
//   try {
//     // const { req } = context;
//     const language = currentLang();
//     console.log('language: ', language);
//     // Fetch config data
//     const configRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/config`, {
//       method: 'GET',
//       headers: {
//         'X-software-id': 33571750,
//         'X-server': 'server',
//         'X-localization': language,
//         origin: process.env.NEXT_CLIENT_HOST_URL,
//       },
//     });

//     if (!configRes.ok) {
//       throw new Error(`Failed to fetch config data: ${configRes.statusText}`);
//     }

//     const config = await configRes.json();

//     // Fetch landing page data
//     const landingPageRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/landing-page`,
//       {
//         method: 'GET',
//         headers: CustomHeader, // Assuming CustomHeader is defined
//       }
//     );

//     if (!landingPageRes.ok) {
//       throw new Error(`Failed to fetch landing page data: ${landingPageRes.statusText}`);
//     }

//     const landingPageData = await landingPageRes.json();

//     // console.log('/api/v1/config: ', config);

//     return {
//       props: {
//         configData: config,
//         landingPageData,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//     return {
//       props: {
//         configData: null,
//         landingPageData: null,
//         error: error.message, // Pass the error message to handle it in the component
//       },
//     };
//   }
// };
