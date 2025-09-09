import React, { memo, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Stack, Typography } from "@mui/material";
import { IconButton, Grid, CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useTranslation } from "react-i18next";

import { AllRoutes } from "../../../AllRoutes";
import {
  CustomStackFullWidth,
  CustomViewAll,
  SliderCustom,
} from "../../../styled-components/CustomStyles.style";
import { useRouter } from "next/router";
import CustomImageContainer from "../../CustomImageContainer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  CustomGridWithBgColor,
  CustomIconButton,
  CustomSideOverLay,
} from "./FeaturedAuction.style";
import fire_image from "../../../../public/static/fire.svg";
import FoodCardShimmer from "../../food-card/FoodCarShimmer";
import { HandleNext, HandlePrev } from "../../CustomSliderIcon";
import Skeleton from "@mui/material/Skeleton";
import AuctionCard from "@/components/auction-cards/AuctionCard";
import CustomContainer from "@/components/container";
import { useQuery } from "react-query";
import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi";
import { onSingleErrorResponse } from "@/components/ErrorResponse";
//import SliderCustom from "../../custom-slider/SliderCustom";
const RecommendationAuctions = ({}) => {
  const [hoverOn, setHoverOn] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { global } = useSelector((state) => state.globalSettings);
  const theme = useTheme();

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
  const featuredSliderRef = useRef(null);
  // const languageDirection = localStorage.getItem("direction");

  const auction_type = "live-auction";

  const {
    data: recommendedAuctionsData,
    refetch: refetchFeaturedAuctions,
    isLoading: featuredIsLoading,
  } = useQuery(
    ["live_auction"],
    () => AuctionsApi.auctions(auction_type), // Pass offset and limit as well
    {
      enabled: false,
      staleTime: 1000 * 60 * 8,
      onError: onSingleErrorResponse,
    }
  );

  useEffect(async () => {
    await refetchFeaturedAuctions();
  }, []);

  const settings = {
    slidesToShow: 4.1,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    autoplay: false,
    responsive: [
      {
        breakpoint: 3600,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 3200,
        settings: {
          slidesToShow: 4.1,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 2800,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 2400,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4.2,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 3.9,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 1075,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2.6,
          slidesToScroll: 1,
          // initialSlide: 2
          infinite: false,
        },
      },
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 2,
          initialSlide: 0,
          infinite: false,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,

          // dots: true
          initialSlide: 0,
          infinite: false,
        },
      },
    ],
  };

  return (
    <CustomGridWithBgColor
      padding="23px 0 0 23px"
      xs={12}
      md={12}
      sm={12}
      lg={12}
      onMouseEnter={() => setHoverOn(true)}
      onMouseLeave={() => setHoverOn(false)}
      bgColor={theme.palette.background.green}
      marginTop={"20px"}
    >
      <CustomContainer>
        {recommendedAuctionsData?.data?.auctions?.length > 0 && (
          <Stack
            direction="row"
            paddingTop="20px"
            paddingBottom="20px"
            paddingInlineStart="5px"
            spacing={1}
            justifyContent={"center"}
          >
            <Typography
              fontSize={{ xs: "16px", md: "20px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={theme.palette.text.primary}
              textTransform={"uppercase"}
            >
              {t("Recommendations")}
            </Typography>
          </Stack>
        )}

        <CustomStackFullWidth>
          {!featuredIsLoading ? (
            <CustomStackFullWidth>
              <SliderCustom
                gap="12px"
                paddingBottom={isSmall ? "10px" : "20px"}
                // languageDirection={languageDirection}
                onMouseEnter={() => setHoverOn(true)}
                onMouseLeave={() => setHoverOn(false)}
              >
                <Slider {...settings}>
                  {recommendedAuctionsData?.data?.auctions?.map((auction) => {
                    return (
                      <AuctionCard
                        key={auction?.id}
                        auction={auction}
                        auctionImageUrl={global?.base_urls?.product_image_path}
                        auctionType={auction.auction_type}
                        pageType={"home_page"}
                        image={auction?.product_id?.image}
                        hasBackGroundSection="false"
                      />
                    );
                  })}
                </Slider>
              </SliderCustom>
            </CustomStackFullWidth>
          ) : (
            <Stack marginTop="40px" spacing={2}>
              <Skeleton variant="rectangular" width="40%" height="20px" />
              <SliderCustom>
                <Slider {...settings}>
                  <FoodCardShimmer />
                  <FoodCardShimmer />
                  <FoodCardShimmer />
                  <FoodCardShimmer />
                  <FoodCardShimmer />
                </Slider>
              </SliderCustom>
            </Stack>
          )}
        </CustomStackFullWidth>
      </CustomContainer>
    </CustomGridWithBgColor>
  );
};

export default memo(RecommendationAuctions);
