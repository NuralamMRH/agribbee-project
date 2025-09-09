import React, { useEffect, useRef, useState } from "react";
import FoodCampaign from "./food-campaign/FoodCampaign";
import BestReviewedFood from "./food-campaign/best-reviewed-foods/BestReviewedFood";
import NearbyPopularFood from "./new-popular-food/NearbyPopularFood";
import { Stack } from "@mui/system";
import { styled, Tab, Tabs } from "@mui/material";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { foodTabData } from "./foodTabData";
import ScrollSpy from "react-ui-scrollspy";
import FeaturedAuction from "./auctions-section/FeaturedAuction";
import RecentViewAuctions from "./auctions-section/RecentViewAuctions";
import RecommendationAuctions from "./auctions-section/RecommendationAuctions";

const DifferentAuctionComponent = ({ featuredIsLoading }) => {
  return (
    <Stack margin={"0px"}>
      <FeaturedAuction isLoading={featuredIsLoading} />
      <RecentViewAuctions />
      <RecommendationAuctions />
    </Stack>
  );
};

export default DifferentAuctionComponent;
