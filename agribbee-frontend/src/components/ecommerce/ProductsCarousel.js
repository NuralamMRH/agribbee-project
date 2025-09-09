import React, { memo, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Stack, Typography } from "@mui/material";
import { IconButton, Grid, CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useTranslation } from "react-i18next";

import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  CustomGridWithBgColor,
  CustomIconButton,
  CustomSideOverLay,
} from "./ProductsCarousel.style";

import Skeleton from "@mui/material/Skeleton";
import FoodCardShimmer from "../food-card/FoodCarShimmer";
import { HandleNext, HandlePrev } from "../CustomSliderIcon";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "@/styled-components/CustomStyles.style";
import FoodCard from "../food-card/FoodCard";
import ProductCard from "../product-card/ProductCard";
//import SliderCustom from "../../custom-slider/SliderCustom";
const ProductsCarousel = ({ products, isLoading }) => {
  const [hoverOn, setHoverOn] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { global } = useSelector((state) => state.globalSettings);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
  const foodCampaignSliderRef = useRef(null);
  const languageDirection = localStorage.getItem("direction");
  const settings = {
    speed: 500,
    slidesToShow: 4.1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    responsive: [
      {
        breakpoint: 3600,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
          infinite: false,
          // dots: true
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
    <>
      <Grid
        container
        paddingTop={products?.length > 0 && { xs: "0.5rem", sm: "1.9rem" }}
      >
        <CustomGridWithBgColor
          foodsize={products?.length}
          padding="23px 0 0 23px"
          item
          container
          xs={12}
          md={12}
          sm={12}
          lg={12}
          onMouseEnter={() => setHoverOn(true)}
          onMouseLeave={() => setHoverOn(false)}
        >
          <CustomStackFullWidth justifyContent="right">
            {!isLoading ? (
              <CustomStackFullWidth>
                <SliderCustom
                  gap="12px"
                  paddingBottom={isSmall ? "10px" : "20px"}
                  languageDirection={languageDirection}
                >
                  <Slider ref={foodCampaignSliderRef} {...settings}>
                    {products?.map((product) => {
                      return (
                        <ProductCard
                          key={product?.id}
                          product={product}
                          productImageUrl={
                            global?.base_urls?.product_image_path
                          }
                          hasBackGroundSection="true"
                        />
                      );
                    })}
                    {/*{foodCount(products) > 5 && (*/}
                    {/*    <FoodCardMoreButton route="/campaigns" />*/}
                    {/*)}*/}
                  </Slider>
                </SliderCustom>
              </CustomStackFullWidth>
            ) : isLoading ? (
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
            ) : products?.length === 0 || products === "undefined" ? (
              <Typography>{t("No any products found")}</Typography>
            ) : null}
          </CustomStackFullWidth>
        </CustomGridWithBgColor>
      </Grid>
    </>
  );
};

export default memo(ProductsCarousel);
