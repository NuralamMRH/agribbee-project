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
import MuaTanGocCard from "@/components/mua-tan-goc-block-item/MuaTanGocCard";
import { useGetGreenBarTabs } from "@/hooks/react-query/landing-page/useGetGreenBarTabs";
// import { setPageTabs } from '@/redux/slices/storedData'
import { setPageTabs } from "@/redux/slices/landingpagetabs";
import { setHandleHomePage } from "@/redux/slices/global";

const MuaTanGoc = ({ section_title }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [hoverOn, setHoverOn] = useState(false);
  const [featuredCategories, setFeaturedCategories] = useState(null);
  const { catOffsetElementRef } = useScrollSticky();
  const { global } = useSelector((state) => state.globalSettings);

  const dispatch = useDispatch();
  // const { featuredCategories } = useSelector((state) => state.storedData)

  // const featuredCategories = [
  //     {
  //         id: 1,
  //         name: 'Chợ Đầu Mối',
  //         image: '/farmproductssvgrepocom-1.svg',
  //     },
  //     {
  //         id: 2,
  //         name: 'Thương Lái',
  //         image: '/marketsvgrepocom-1.svg',
  //     },
  //     {
  //         id: 3,
  //         name: 'OCOP Farmer',
  //         image: '/frame.svg',
  //     },
  //     {
  //         id: 4,
  //         name: 'Imported Food',
  //         image: '/vector6.svg',
  //     },
  //     {
  //         id: 4,
  //         name: 'Restaurant Supplier',
  //         image: '/group29.svg',
  //     },
  // ]

  const onSuccessHandler = (res) => {
    dispatch(setPageTabs(res));
  };

  const { data, refetch, isLoading } = useGetGreenBarTabs(onSuccessHandler);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const pageTabs = useSelector((state) => state.pageTabs.pageTabs);
  useEffect(() => {
    if (pageTabs) {
      setFeaturedCategories(pageTabs?.data);
    }
  }, [pageTabs]);

  //   console.log("Tabs res: ", featuredCategories);

  const { categoryIsSticky, foodTypeIsSticky } = useSelector(
    (state) => state.scrollPosition
  );

  const handleTabClick = (tab) => {
    // console.log(tab);
    router.push(`/${tab?.link}`);
    dispatch(setHandleHomePage(false));
  };

  const sliderRef = useRef(null);
  const searchKey = "";
  const settings = {
    dots: false,
    infinite: categoryIsSticky
      ? featuredCategories?.length > 12
        ? true
        : false
      : featuredCategories?.length > 7
        ? true
        : false,
    speed: 5000,
    slidesToShow: categoryIsSticky ? 5 : 5,
    slidesToScroll: 3,
    autoplay: true,
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 8 && true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 4 && true,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 4 && true,
          // dots: true
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 4 && true,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 4 && true,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: featuredCategories?.length > 4 && true,
        },
      },
    ],
  };

  return (
    <Card
      sx={{
        paddingTop: { xs: categoryIsSticky && ".5rem" },
        position: "sticky",
        top: { xs: "69px", md: router.pathname === "/home" ? "64px" : "0px" },
        zIndex: 1100,
        //transform: foodTypeIsSticky ? 'translateY(-100%)':'',
        //transition:"all ease .5s",
        borderRadius: "0px",
        background: (theme) => theme.palette.primary.green,
        boxShadow: categoryIsSticky
          ? "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)"
          : "none",
        // "*":{
        //     animation : 'fadeInRight 2s  1'
        // }
      }}
    >
      <>
        <Grid
          ref={catOffsetElementRef}
          gap={{ xs: ".3rem", md: ".5rem" }}
          sx={{ padding: categoryIsSticky ? "0px" : "30px 0" }}
        >
          {!categoryIsSticky && (
            <Grid item xs={12} md={12}>
              <Stack direction="row" justifyContent="center" width="100%">
                <Typography
                  fontSize={{ xs: "20px", md: "35px" }}
                  fontWeight={{ xs: "500", md: "700" }}
                  color={(theme) => theme.palette.primary.black}
                >
                  {section_title}
                </Typography>
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
                {featuredCategories.map((tab) => (
                  <MuaTanGocCard
                    key={tab?.id}
                    id={tab?.id}
                    tab={tab}
                    categoryImage={`${global?.base_urls?.home_tabs_image_path}/${tab.icon_image}`}
                    name={tab?.text}
                    height="40px"
                    categoryIsSticky={categoryIsSticky}
                    handleTabClick={() => handleTabClick(tab)}
                  />
                ))}
              </Slider>
            ) : (
              <CustomShimmerCategories
                noSearchShimmer="true"
                itemCount="5"
                smItemCount="5"
              />
            )}
          </Grid>
        </Grid>
      </>
    </Card>
  );
};

export default memo(MuaTanGoc);
