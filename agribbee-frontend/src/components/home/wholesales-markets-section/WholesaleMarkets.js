import React, { useEffect, useRef, useState } from "react";
import CustomContainer from "../../container";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "../../../styled-components/CustomStyles.style";
import toast from "react-hot-toast";
import {
  Grid,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  IconButton,
  Typography,
} from "@mui/material";
import InfoSectionHeader from "../HomeInfo/InfoSectionHeader";
import { useSelector } from "react-redux";
import { Stack } from "@mui/system";
import WholesalesMarketsMap from "./WholesalesMarketsMap";
import WholesaleMarketList from "./WholesaleMarketList";

import CloseIcon from "@mui/icons-material/Close";
import RoomIcon from "@mui/icons-material/Room";

import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import FindNearbyIcon from "../../../assets/images/icons/FindNearbyIcon";
import { HandleNext, HandlePrev } from "../../CustomSliderIcon";
import { getToken } from "../../checkout-page/functions/getGuestUserId";
import CustomModal from "../../custom-modal/CustomModal";
import { MarketsApi } from "@/hooks/react-query/config/marketApi";
import CustomShimmerCard from "@/components/customShimmerForProfile/CustomShimmerCard";
import styled from "styled-components";
import { useGetMarkets } from "@/hooks/react-query/market/useGetMarkets";
import FoodCardShimmer from "@/components/food-card/FoodCarShimmer";
import MarketBoxCard from "@/components/market/MarketBoxCard";
import KioskBoxCard from "@/components/kiosk/KioskBoxCard";
import { useGetKiosks } from "@/hooks/react-query/kiosk/useGetKiosks";
import { kiosksApi } from "@/hooks/react-query/config/kioskApi";
import MarketKioskPop from "./MarketKioskPop";
import NearByMarkets from "./NearByMarkets";
import { useJsApiLoader } from "@react-google-maps/api";
import { CitiesApi } from "@/hooks/react-query/config/cityApi";

const Puller = styled("div")(({ theme }) => ({
  width: "80px",
  height: "4px",
  borderRadius: 3,
  position: "absolute",
  backgroundColor: "#000",
  top: 20,
}));

function WholesaleMarkets() {
  const { landingPageData } = useSelector((state) => state.storedData);

  const theme = useTheme();
  const drawerBleeding = 0;
  const [zip, setZip] = useState(null);
  const [allMarkets, setAllMarkets] = useState([]);
  const [kiosks, setKiosks] = useState([]);
  const [hoverOn, setHoverOn] = useState(false);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  // const languageDirection = localStorage.getItem("direction");
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { global } = useSelector((state) => state.globalSettings);
  const token = getToken();
  const [userData, setUserData] = useState(null);
  const [text, setText] = useState({ title: "", subTitle: "" });
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const marketSliderRef = useRef(null);
  const kioskSliderRef = useRef(null);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState(""); // e.g., city name

  useEffect(() => {
    setImageIndex(0);
  }, []);

  const handleSuccess = (response) => {
    setAllMarkets(response.markets);
    if (response?.length === 0) {
    }
  };

  const handleSuccessKiosk = (response) => {
    setKiosks(response.sellers);
  };

  const { data, isLoading, refetch, isRefetching } =
    useGetMarkets(handleSuccess);

  const {
    data: kioskData,
    isLoading: kioskIsLoading,
    refetch: kioskRefetch,
    isRefetching: kioskIsRefetch,
  } = useGetKiosks(handleSuccessKiosk);

  useEffect(() => {
    refetch();
    kioskRefetch();
  }, []);

  // console.log("kioskData loaded successfully ", kioskData);

  const handleClickOnMap = async (name, zip) => {
    const city = await CitiesApi.cityByZip(zip);

    console.log(city.data.cities[0].location);
    if (city.data?.cities?.length > 0) {
      setLocation({
        lat: city.data.cities[0].location?.coordinates[1],
        lng: city.data.cities[0].location?.coordinates[0],
      });
    }

    const markets = await MarketsApi.cityWiseMarketList("zip", zip);

    if (markets.data?.markets?.length > 0) {
      setAllMarkets(markets.data?.markets);
    } else {
      toast.error(`${t("Markets not found in the ")}${name}`);
      refetch();
    }
    setZip(zip);
    setAddress(name);

    if (isXSmall) {
      setOpenDrawer(true);
    } else {
      setOpen(true);
    }
  };

  const handleClickOnMarket = async (id) => {
    const kioskData = await kiosksApi.marketWiseKioskList("kiosk", id);
    if (kioskData.data?.sellers?.length > 0) {
      setKiosks(kioskData.data?.sellers);
    } else {
      toast.error(`${t("Kiosk not found in this market")}`);

      kioskRefetch();
    }
  };

  const handleClickOnKiosk = (e) => {
    toast.success(e);
  };

  const toggleDrawer = () => () => {
    setOpenDrawer(!openDrawer);
  };

  const settings = {
    speed: 500,
    autoplay: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: hoverOn && <HandleNext />,
    prevArrow: hoverOn && <HandlePrev />,
    beforeChange: (current, next) => {
      console.log(current), setImageIndex(next);
    },

    // rtl:true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 2,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 2,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 1075,
        settings: {
          slidesToShow: 2,
          initialSlide: 0,
          dots: true,
        },
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 2,
          dots: true,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 1.09,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1.07,
          initialSlide: 1,
          dots: false,
          // infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.005,
          initialSlide: 0,
          dots: false,
          // infinite: false,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          initialSlide: 0,
          dots: false,
          // infinite: false,
        },
      },
    ],
  };

  const settingsFoKiosk = {
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
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <InfoSectionHeader
          topText={
            landingPageData?.response?.wholesalesMarketHeading?.topTagline
          }
          topTextColor={(theme) => theme.palette.primary.blue}
          topTextFontSize={{ xs: "24px", md: "32px" }}
          topTextFontWidth={{ xs: "600", md: "700" }}
          bottomText={
            landingPageData?.response?.wholesalesMarketHeading?.tagline
          }
          bottomTextColor={(theme) => theme.palette.text.dark}
          bottomTextFontSize={{ xs: "16px", md: "24px" }}
          bottomTextFontWidth={{ xs: "500", md: "500" }}
        />
        <Grid
          container
          spacing={2}
          sx={{
            marginY: "20px",
            padding: "10px",
            background: (theme) => theme.palette.background.gray,
          }}
        >
          <Grid item xs={12} md={4} align="start">
            <Stack
              width="100%"
              justifyContent="center"
              alignItems={"center"}
              sx={{
                paddingInline: "20px",
                paddingY: "20px",
                background: (theme) => theme.palette.background.default,
                height: "100%",
                borderRadius: "15px",
              }}
            >
              <WholesalesMarketsMap handleClick={handleClickOnMap} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={8} align="start">
            <WholesaleMarketList />
          </Grid>
        </Grid>

        {isLoading ? (
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack
                flexDirection="row"
                gap="25px"
                alignItems="center"
                padding="0px 30px"
              >
                <FoodCardShimmer
                  cardWidth={"100%"}
                  cardHeight={!isXSmall ? "100px" : "270px"}
                />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12} md={12}>
              <SliderCustom
                gap="12px"
                paddingBottom={isSmall ? "10px" : "20px"}
                // languageDirection={languageDirection}
                onMouseEnter={() => setHoverOn(true)}
                onMouseLeave={() => setHoverOn(false)}
              >
                <Slider ref={marketSliderRef} {...settings}>
                  {allMarkets?.map((marketData, index) => {
                    return (
                      <MarketBoxCard
                        // className={isSmall? "" : (index === imageIndex ? "custom-active-slide" : "custom-slide")}
                        className={
                          index === imageIndex
                            ? "custom-active-slide"
                            : "custom-slide"
                        }
                        id={marketData._id}
                        image={marketData?.image}
                        name={marketData?.name}
                        marketImagePath={global?.base_urls?.market_image_path}
                        zone_id={marketData?.address?.city.zip}
                        handleClickOnMarket={handleClickOnMarket}
                      />
                    );
                  })}
                </Slider>
              </SliderCustom>
            </Grid>
          </Grid>
        )}

        {kioskIsLoading ? (
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack
                flexDirection="row"
                gap="25px"
                alignItems="center"
                padding="0px 30px"
              >
                {!isXSmall && (
                  <FoodCardShimmer cardWidth="280px" cardHeight="230px" />
                )}
                <FoodCardShimmer cardWidth="350px" cardHeight="270px" />
                {!isXSmall && (
                  <FoodCardShimmer cardWidth="280px" cardHeight="230px" />
                )}
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12} md={12}>
              <SliderCustom
                gap="12px"
                paddingBottom={isSmall ? "10px" : "20px"}
                // languageDirection={languageDirection}
                onMouseEnter={() => setHoverOn(true)}
                onMouseLeave={() => setHoverOn(false)}
              >
                <Slider ref={kioskSliderRef} {...settingsFoKiosk}>
                  {kiosks?.map((kioskData, index) => {
                    return (
                      <KioskBoxCard
                        // className={isSmall? "" : (index === imageIndex ? "custom-active-slide" : "custom-slide")}
                        className={
                          index === imageIndex
                            ? "custom-active-slide"
                            : "custom-slide"
                        }
                        item={kioskData}
                        id={kioskData._id}
                        image={kioskData?.image}
                        name={kioskData?.name}
                        kioskImagePath={global?.base_urls?.seller_image_path}
                        handleClickOnKiosk={handleClickOnKiosk}
                      />
                    );
                  })}
                </Slider>
              </SliderCustom>
            </Grid>
          </Grid>
        )}

        {open && (
          <CustomModal
            openModal={open}
            setModalOpen={setOpen}
            maxWidth={{ xs: "90%", sm: "98vw", md: "1000px" }}
          >
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="center"
              height="65%"
              sx={{ position: "relative" }}
            >
              <IconButton
                sx={{ position: "absolute", top: 3, right: 3 }}
                onClick={() => setOpen(false)}
              >
                <CloseIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              <NearByMarkets
                markets={allMarkets}
                zipCode={address}
                location={location}
              />
            </CustomStackFullWidth>
          </CustomModal>
        )}
        {openDrawer && (
          <SwipeableDrawer
            anchor="bottom"
            open={openDrawer}
            onClose={toggleDrawer()}
            onOpen={toggleDrawer()}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                borderRadius: "20px 20px 0 0",
              },
            }}
          >
            <CustomStackFullWidth>
              <CustomStackFullWidth
                sx={{
                  position: "absolute",
                  top: -drawerBleeding,
                  alignItems: "center",
                  zIndex: 300,
                  height: "45px",
                  background: `linear-gradient(179deg, #FFF 1.26%, rgba(255, 255, 255, 0.00) 98.74%)`,
                }}
              >
                <Puller />
              </CustomStackFullWidth>
              <Stack
                sx={{
                  overflow: "auto",
                  height: "93vh",
                  borderRadius: "20px",
                }}
              >
                <NearByMarkets
                  markets={allMarkets}
                  zipCode={address}
                  location={location}
                />
              </Stack>
            </CustomStackFullWidth>
          </SwipeableDrawer>
        )}
      </CustomStackFullWidth>
    </CustomContainer>
  );
}

export default WholesaleMarkets;
