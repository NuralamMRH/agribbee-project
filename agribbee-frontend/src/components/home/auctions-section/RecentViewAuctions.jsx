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
import styled from "styled-components";
//import SliderCustom from "../../custom-slider/SliderCustom";

const SliderCustom = styled(Stack)(
  ({ theme, languageDirection, gap, paddingBottom, isCenter, isXSmall }) =>
    isCenter && {
      // height: "100%",
      // paddingY: '1rem',
      justifyContent: "center",
      "& .custom-slide ": {
        transform: "scale(.9)",
        transition: "all 500ms ease-in-out",
      },
      "& .custom-active-slide ": {
        transform: "scale(1)",
        zIndex: "1000",
        transition: "all 500ms ease-in-out",
        opacity: 1,
      },
      "& .slick-list": {
        display: "flex",
      },
      "& .slick-slider": {
        "& .slick-list": {
          "& .slick-track": {
            float: languageDirection === "rtl" ? "right" : "left",
            gap: gap ? gap : "8px",
            paddingBottom: paddingBottom || 0,
            "& .slick-active": {
              maxWidth: "250px",
            },
            "& .slick-active.slick-center + .slick-active": {
              maxWidth: "900px",
              width: "570px !important",
            },
          },
        },
        "& .slick-dots": {
          bottom: "-22px !important",
          textAlign: "center !important",
          left: "0 !important",
          right: "0 !important",

          "& li": {
            "& .slick-active": {
              "& button": {
                "&::before": {
                  content: '" "',
                  fontSize: "12px !important",
                },
              },
            },
          },
        },
      },
      "& .slick-track": {
        marginLeft: "10px !important",
        gap: "30px !important",
        "@media screen and (max-width: 450px)": {
          marginLeft: "85px !important",
        },
      },
    }
);

const RecentViewAuctions = ({}) => {
  const [hoverOn, setHoverOn] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { global } = useSelector((state) => state.globalSettings);
  const theme = useTheme();

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const featuredSliderRef = useRef(null);
  // const languageDirection = localStorage.getItem("direction");
  const [imageIndex, setImageIndex] = useState(null);

  const auction_type = "live-auction";

  const {
    data: recentViewAuctionsData,
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
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    slidesToScroll: 1,
    dots: true,
    initialSlide: 1,
    infinite: false,
    centerPadding: "0px",
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    autoplay: false,
    beforeChange: (current, next) => {
      setImageIndex(isXSmall ? current : next + 1);
    },

    // rtl:true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          initialSlide: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 3,
          initialSlide: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1075,
        settings: {
          slidesToShow: 3,
          initialSlide: 1,
          dots: true,
        },
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 3,
          dots: true,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 2.1,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1.3,
          initialSlide: 1,
          dots: false,
          // infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.3,
          initialSlide: 0,
          dots: false,
          // infinite: false,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1.3,
          initialSlide: 0,
          dots: false,
          // infinite: false,
        },
      },
    ],
  };

  useEffect(() => {
    setImageIndex(isXSmall ? 0 : 2);
  }, []);

  return (
    <CustomGridWithBgColor
      padding="23px 0 0 23px"
      bgColor={"#fff"}
      xs={12}
      md={12}
      sm={12}
      lg={12}
      onMouseEnter={() => setHoverOn(true)}
      onMouseLeave={() => setHoverOn(false)}
    >
      <CustomContainer>
        {recentViewAuctionsData?.data?.auctions?.length > 0 && (
          <Stack
            direction="row"
            paddingTop="20px"
            paddingBottom="20px"
            paddingInlineStart="5px"
            spacing={1}
          >
            <Typography
              fontSize={{ xs: "16px", md: "20px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={theme.palette.text.primary}
            >
              {t("Recently Viewed")}
            </Typography>
          </Stack>
        )}

        <CustomStackFullWidth>
          {!featuredIsLoading ? (
            <CustomStackFullWidth>
              <SliderCustom
                gap="0px !important"
                paddingBottom={isSmall ? "10px" : "20px"}
                // languageDirection={languageDirection}
                isCenter={true}
                isXSmall={isXSmall}
              >
                <Slider {...settings} ref={featuredSliderRef}>
                  {recentViewAuctionsData?.data?.auctions?.map(
                    (auction, index) => {
                      return (
                        <AuctionCard
                          key={auction?.id}
                          className={
                            index === imageIndex
                              ? "custom-active-slide"
                              : "custom-slide"
                          }
                          width={index === imageIndex ? "900px" : "250px"}
                          contentHide={index === imageIndex ? true : false}
                          auction={auction}
                          auctionImageUrl={
                            global?.base_urls?.product_image_path
                          }
                          auctionType={auction.auction_type}
                          pageType={"home-page"}
                          image={auction?.product_id?.image}
                          hasBackGroundSection="false"
                        />
                      );
                    }
                  )}
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

export default memo(RecentViewAuctions);
