import React, { memo } from "react";
import CustomContainer from "../container";
import FeatureCatagories from "../home/featured-categories/FeatureCatagories";
import { useTheme } from "@emotion/react";
import PushNotificationLayout from "../PushNotificationLayout";
import HomePageHero from "../hero-banner/home-page-hero";
import MuaTanGoc from "../home/mua-tan-goc/MuaTanGoc";
import { useSelector } from "react-redux";
import AuctionProducts from "./AuctionProducts";

const AuctionsPage = (configData) => {
  const { global } = useSelector((state) => state.globalSettings);
  const { landingPageData } = useSelector((state) => state.storedData);
  const theme = useTheme();
  return (
    <>
      <PushNotificationLayout>
        <HomePageHero
          banner_section_bg={`${global?.base_urls?.home_page_image_path}/${landingPageData?.response?.hero_banner_bg}`}
          banner_section_title={landingPageData?.response?.platformName}
          banner_tagline={landingPageData?.response?.tagline}
          banner_search_placeholder={
            landingPageData?.response?.searchPlaceholder
          }
        />
        <MuaTanGoc section_title={landingPageData?.response?.greenBarTitle} />
        <CustomContainer>
          <AuctionProducts />
        </CustomContainer>
        <FeatureCatagories
          mainBg={theme.palette.blue[200]}
          categoryBg={theme.palette.background.default}
        />
      </PushNotificationLayout>
    </>
  );
};

export default memo(AuctionsPage);
