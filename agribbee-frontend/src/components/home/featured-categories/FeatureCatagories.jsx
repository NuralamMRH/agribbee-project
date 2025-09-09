import React, { memo, useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import Slider from "react-slick";

import FeaturedCategoryCard from "../../featured-category-item/FeaturedCategoryCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import 'react-multi-carousel/lib/styles.css'
import CustomShimmerCategories from "../../CustomShimmer/CustomShimmerCategories";
import { useRouter } from "next/router";
import {
  CustomStackFullWidth,
  CustomViewAll,
} from "@/styled-components/CustomStyles.style";
import { CustomTypography } from "../../custom-tables/Tables.style";
import { useTheme } from "@mui/material/styles";
import { onErrorResponse } from "../../ErrorResponse";
import useScrollSticky from "../Search-filter-tag/useScrollSticky";
import Card from "@mui/material/Card";
import CustomContainer from "../../container";
import { Stack } from "@mui/system";
import { HandleNext, HandlePrev } from "@/components/CustomSliderIcon";
import { useGetCategories } from "@/hooks/react-query/all-categiry/useGetCategory";
import { setFeaturedCategories } from "@/redux/slices/storedData";

const FeatureCatagories = ({ mainBg, categoryBg }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [hoverOn, setHoverOn] = useState(false);
  const { catOffsetElementRef } = useScrollSticky();
  const { global } = useSelector((state) => state.globalSettings);
  const { featuredCategories } = useSelector((state) => state.storedData);
  const { categoryIsSticky, foodTypeIsSticky } = useState(false);
  const sliderRef = useRef(null);
  const searchKey = "";
  const dispatch = useDispatch();

  const handleRequestOnSuccess = (res) => {
    // console.log("Loading categories", res.data.response);
    dispatch(setFeaturedCategories(res.data.response));
  };

  const { data, refetch, isLoading } = useGetCategories(handleRequestOnSuccess);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const settings = {
    dots: false,
    infinite: categoryIsSticky
      ? featuredCategories?.length > 12
        ? true
        : false
      : featuredCategories?.length > 7
        ? true
        : false,
    speed: 500,
    slidesToShow: categoryIsSticky ? 12 : 7,
    slidesToScroll: 3,
    autoplay: true,
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 1,
          infinite: featuredCategories?.length > 8 && true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: featuredCategories?.length > 6 && true,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: featuredCategories?.length > 5 && true,
          // dots: true
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: featuredCategories?.length > 4.5 && true,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: featuredCategories?.length > 7 && true,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: featuredCategories?.length > 5 && true,
        },
      },
    ],
  };

  return (
    <Card
      sx={{
        paddingTop: categoryIsSticky && ".5rem",
        zIndex: 1100,
        paddingY: { xs: "20px", md: "50px" },
        //transform: foodTypeIsSticky ? 'translateY(-100%)':'',
        //transition:"all ease .5s",
        borderRadius: mainBg ? "0px" : "auto",
        background: mainBg ? mainBg : (theme) => theme.palette.neutral[1800],
        boxShadow: categoryIsSticky
          ? "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)"
          : "none",
        // "*":{
        //     animation : 'fadeInRight 2s  1'
        // }
      }}
    >
      <Stack>
        <Grid container gap={{ xs: ".3rem", md: ".5rem" }}>
          {!categoryIsSticky && (
            <Grid item xs={12} md={12}>
              <Stack
                direction="row"
                justifyContent={mainBg ? "center" : "space-between"}
                width="100%"
              >
                <Typography
                  fontSize={{ xs: "16px", md: "20px" }}
                  fontWeight={{ xs: "500", md: "700" }}
                  color={
                    mainBg
                      ? theme.palette.neutral[1800]
                      : (theme) => theme.palette.neutral[1000]
                  }
                >
                  {t("EXPLORE CATEGORY")}
                </Typography>
                {/* <CustomViewAll
                  onClick={() => router.push("/categories")}
                  sx={{ marginInlineEnd: "10px" }}
                >
                  <Typography fontSize="14px" fontWeight="500">
                    {t("Explore More")}
                  </Typography>
                </CustomViewAll> */}
              </Stack>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            md={12}
            onMouseEnter={() => setHoverOn(true)}
            onMouseLeave={() => setHoverOn(false)}
          >
            {featuredCategories?.length > 0 ? (
              <Slider className="slick__slider" {...settings} ref={sliderRef}>
                {featuredCategories.map((categoryItem) => (
                  <FeaturedCategoryCard
                    key={categoryItem?.id}
                    id={categoryItem?.id}
                    categoryImage={categoryItem?.icon}
                    name={categoryItem?.name}
                    categoryImageUrl={global?.base_urls?.category_image_path}
                    height="40px"
                    categoryBg={categoryBg}
                  />
                ))}
              </Slider>
            ) : (
              <CustomShimmerCategories
                noSearchShimmer="true"
                itemCount="7"
                smItemCount="5"
              />
            )}
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

export default memo(FeatureCatagories);
