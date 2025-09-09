import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useSelector } from 'react-redux';
const DynamicFavicon = (props) => {
  const { global } = useSelector((state) => state.globalSettings);
  const favicon = '/logo/i-truck-sea.png';
  // const favicon = `${global?.base_urls?.business_logo_path}/${global?.fav_icon}`;
  //`${global?.fav_icon_full_url}`
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href={favicon} />
      <link rel="icon" href={favicon} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
    </Head>
  );
};

DynamicFavicon.propTypes = {};

export default DynamicFavicon;
