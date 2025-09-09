import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi";
import { useWishListDelete } from "@/hooks/react-query/config/wish-list/useWishListDelete";
import { addWishList, removeWishListAuction } from "@/redux/slices/wishList";
import { getConvertDiscount, handleBadge } from "@/utils/customFunctions";
import { useTheme } from "@mui/material/styles";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import LiveAuctionDetails from "./LiveAuctionDetails";
import FutureDeliveryAuctionDetails from "./FutureDeliveryAuctionDetails";
import SurplusDailyAuctionDetails from "./SurplusDailyAuctionDetails";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";

// //////////////// Surplus Default Images //////////////
import surplusBanner from "@/assets/images/banners/bannerlogoblock@3x.png";
import surplusLogo from "@/assets/images/banners/surpluslogo.png";
import surplusImage1 from "@/assets/images/banners/bannercat1@3x.png";
import surplusImage2 from "@/assets/images/banners/bannercat2@3x.png";
import surplusImage3 from "@/assets/images/banners/bannercat4@3x.png";
import surplusImage4 from "@/assets/images/banners/bannercat3@3x.png";
import surplusImage5 from "@/assets/images/banners/cat12@2x.png";
import surplusImage6 from "@/assets/images/banners/cat22@2x.png";
import surplusImage7 from "@/assets/images/banners/cat21@2x.png";
import surplusImage8 from "@/assets/images/banners/cat11@2x.png";
import surplusImage9 from "@/assets/images/banners/bannercat7@3x.png";

// //////////////// DailyCatchAuctions Default Images //////////////
import dailyCatchBanner from "@/assets/images/banners/rectangle-245@2x.png";
import dailyCatchLogo from "@/assets/images/banners/whatsapp-image-20240621-at-50448-pm-1@2x.png";
import dailyCatchImage1 from "@/assets/images/banners/cardimage@2x.png";
import dailyCatchImage2 from "@/assets/images/banners/image-333@2x.png";
import dailyCatchImage3 from "@/assets/images/banners/cardimage16@2x.png";
import dailyCatchImage4 from "@/assets/images/banners/image-562@2x.png";
import dailyCatchImage5 from "@/assets/images/banners/cardimage@2x.png";
import dailyCatchImage6 from "@/assets/images/banners/cardimage18@2x.png";
import dailyCatchImage7 from "@/assets/images/banners/cardimage@2x.png";
import dailyCatchImage8 from "@/assets/images/banners/cardimage@2x.png";
import dailyCatchImage9 from "@/assets/images/banners/cardimage@2x.png";
// import FutureAuctionBanner from "../banner/FutureAuctionBanner"

// //////////////// Future Delivery Auction Default Images //////////////
import futureDeliveryBanner from "@/assets/images/banners/rectangle-245@2x.png";
import futureDeliveryBanner2 from "@/assets/images/banners/rectangle-245@2x.png";
import futureDeliveryLogo from "@/assets/images/banners/whatsapp-image-20240621-at-50447-pm-1@2x.png";
import futureDeliveryCalender from "@/assets/images/banners/bannerlogoblock2@3x.png";
import futureDeliveryImage1 from "@/assets/images/banners/cardimage@2x.png";

// //////////////// Future Delivery Auction Default Images //////////////
import liveAuctionBanner from "@/assets/images/banners/rectangle-245@2x.png";
import liveAuctionLogo from "@/assets/images/banners/whatsapp-image-20240621-at-50447-pm-1@2x.png";
import liveAuctionBigBanner from "@/assets/images/banners/banner@3x.png";
import liveAuctionImage1 from "@/assets/images/banners/cardimage@2x.png";
import HomePageHero from "../hero-banner/home-page-hero";
import SurplusDailyAuctionBanner from "../banner/SurplusDailyAuctionBanner";
import FutureAuctionBanner from "../banner/FutureAuctionBanner";
import LiveAuctionBanner from "../banner/LiveAuctionBanner";
import { useRouter } from "next/router";
import CustomContainer from "../container";
import { Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import TopTabContainer from "./TopTabContainer";
import { setLocation } from "@/redux/slices/addressData";
import { MarketsApi } from "@/hooks/react-query/config/marketApi";
import { CitiesApi } from "@/hooks/react-query/config/cityApi";
import WholesalesMarketsMap from "../home/wholesales-markets-section/WholesalesMarketsMap";
// import LiveAuctionBanner from "../banner/LiveAuctionBanner"

const AuctionDetails = ({ auction, auctionType, isSellerDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { landingPageData } = useSelector((state) => state.storedData);

  const { t } = useTranslation();
  const { global } = useSelector((state) => state.globalSettings);
  const { token } = useSelector((state) => state.userToken);
  const [currentTab, setCurrentTab] = useState("auctioner");

  const [zip, setZip] = useState(null);
  const [allMarkets, setAllMarkets] = useState([]);
  const [kiosks, setKiosks] = useState([]);
  const [hoverOn, setHoverOn] = useState(false);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  // const languageDirection = localStorage.getItem("direction");
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState(""); // e.g., city name

  if (typeof window !== "undefined") {
    setLocation(localStorage.getItem("location"));
  }

  //   const { bidList } = useSelector((state) => state.bid);
  const { wishLists } = useSelector((state) => state.wishList);

  let currencySymbol;
  let currencySymbolDirection;
  let digitAfterDecimalPoint;

  if (global) {
    currencySymbol = global.currency_symbol;
    currencySymbolDirection = global.currency_symbol_direction;
    digitAfterDecimalPoint = global.digit_after_decimal_point;
  }

  const {
    mutate: addFavoriteMutation,
    isLoading,
    error,
    data,
  } = useMutation("add-favourite", () => AuctionsApi.addFavorite(auction.id), {
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(addWishList(auction));
        toast.success(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      alert("Toasted from Auction Card ", error.response.data.message);
    },
  });

  const addToFavorite = (e) => {
    e.stopPropagation();
    if (token) {
      addFavoriteMutation();
      // notify(data.message)
    } else toast.error(t("You are not logged in"));
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListAuction(auction.id));
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate } = useWishListDelete();
  const deleteWishlistItem = (id, e) => {
    e.stopPropagation();
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
        alert("Toasted from Auction Card ", error.response.data.message);
      },
    });
  };

  const isInList = (id) => {
    return !!wishLists?.auction?.find((wishAuction) => wishAuction.id === id);
  };

  //   const isInBid = bidList?.find((things) => things.id === auction?.id);

  const handleSubmitAuction = (formData) => {
    console.log("Auction formData Details:", formData);
    // router.push({
    //   pathname: `/auction/[id]`,
    //   query: {
    //     id: `${auction?.slug ? auction?.slug : auction?.id}`,
    //   },
    // });
  };

  const handleRouterPush = (newFilters) => {
    // Merge existing query with new filters
    const updatedQuery = {
      ...router.query, // Existing query parameters
      ...newFilters, // New filters
    };
    console.log("Updated Query:", updatedQuery);
    // Build pathname dynamically
    const pathname = `/auctions`;
    // Push the updated query and path
    router.push({
      pathname,
      query: updatedQuery,
    });
  };

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

  return (
    <>
      <CustomStackFullWidth>
        {auctionType === "current-auctions-place" ? (
          <>
            <HomePageHero
              banner_section_bg={`${global?.base_urls?.home_page_image_path}/${landingPageData?.response?.hero_banner_bg}`}
              banner_section_title={landingPageData?.response?.platformName}
              banner_tagline={landingPageData?.response?.tagline}
              banner_search_placeholder={
                landingPageData?.response?.searchPlaceholder
              }
            />
            <MuaTanGoc
              section_title={landingPageData?.response?.greenBarTitle}
            />
          </>
        ) : auctionType === "surplus-auction" ? (
          <SurplusDailyAuctionBanner
            onClick={handleRouterPush}
            title={"Hai Sản Vào Mùa"}
            slogan={"Đưa Gia Siêu Ré"}
            mainSlogan={"AI-POWERED SURPLUS AUCTION"}
            banner={surplusBanner}
            logo={surplusLogo}
            imageText3={"Hang Thanh Ly Ton Kho"}
            imageText4={"Trai Cay Trung Vu"}
            imageText9={"Trai Cay Trung Vu"}
            image1={surplusImage1}
            image2={surplusImage2}
            image3={surplusImage3}
            image4={surplusImage4}
            image5={surplusImage5}
            image6={surplusImage6}
            image7={surplusImage7}
            image8={surplusImage8}
            image9={surplusImage9}
          />
        ) : auctionType === "daily-catch-auction" ? (
          <SurplusDailyAuctionBanner
            onClick={handleRouterPush}
            title={"Hai Sản Vào Mùa"}
            slogan={"Đưa Gia Siêu Ré"}
            mainSlogan={"AI-POWERED DAILY CATCH AUCTION"}
            banner={dailyCatchBanner}
            logo={dailyCatchLogo}
            imageText3={"Hang Thanh Ly Ton Kho"}
            imageText4={"Trai Cay Trung Vu"}
            imageText9={"Trai Cay Trung Vu"}
            image1={dailyCatchImage1}
            image2={dailyCatchImage2}
            image3={dailyCatchImage3}
            image4={dailyCatchImage4}
            image5={dailyCatchImage5}
            image6={dailyCatchImage6}
            image7={dailyCatchImage7}
            image8={dailyCatchImage8}
            image9={dailyCatchImage9}
          />
        ) : auctionType === "future-delivery-auction" ? (
          <FutureAuctionBanner
            onClick={handleRouterPush}
            title={"Hai Sản Vào Mùa"}
            slogan={"Đưa Gia Siêu Ré"}
            mainSlogan={"AI-POWERED FUTURE DELIVERY AUCTION"}
            banner={dailyCatchBanner}
            calender={futureDeliveryCalender}
            logo={futureDeliveryLogo}
            imageText3={"Hang Thanh Ly Ton Kho"}
            imageText4={"Trai Cay Trung Vu"}
            imageText9={"Trai Cay Trung Vu"}
            image1={dailyCatchImage1}
            image2={dailyCatchImage2}
          />
        ) : auctionType === "live-auction" ? (
          <LiveAuctionBanner
            onClick={handleRouterPush}
            title={"Hai Sản Vào Mùa"}
            slogan={"Đưa Gia Siêu Ré"}
            mainSlogan={"AI-POWERED FUTURE DELIVERY AUCTION"}
            banner={dailyCatchBanner}
            liveAuctionBanner={liveAuctionBigBanner}
            logo={futureDeliveryLogo}
            imageText3={"Hang Thanh Ly Ton Kho"}
            imageText4={"Trai Cay Trung Vu"}
            imageText9={"Trai Cay Trung Vu"}
            image1={dailyCatchImage1}
            image2={dailyCatchImage2}
          />
        ) : (
          ""
        )}
      </CustomStackFullWidth>
      <CustomContainer>
        <Stack xs={12} sm={12} md={12} marginTop={"10px"}>
          <TopTabContainer
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </Stack>
      </CustomContainer>

      {/* Auction Information Section */}
      <CustomContainer>
        <Stack spacing={2} sx={{ my: 3 }}>
          {/* Tab Navigation */}
          {/* <Stack
            direction="row"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .tab-button": {
                py: 1.5,
                px: 4,
                borderRadius: "4px 4px 0 0",
                fontWeight: 600,
                cursor: "pointer",
                bgcolor: (theme) => theme.palette.grey[100],
                "&.active": {
                  bgcolor: (theme) => theme.palette.primary.main,
                  color: "white",
                },
              },
            }}
          >
            <Stack
              className={`tab-button ${currentTab === "ACUTION CALENDER" ? "active" : ""}`}
              onClick={() => setCurrentTab("ACUTION CALENDER")}
            >
              ACUTION CALENDER
            </Stack>
            <Stack
              className={`tab-button ${currentTab === "REGION" ? "active" : ""}`}
              onClick={() => setCurrentTab("REGION")}
              sx={{ mx: 1 }}
            >
              REGION
            </Stack>
            <Stack
              className={`tab-button ${currentTab === "AUCTIONEER" ? "active" : ""}`}
              onClick={() => setCurrentTab("AUCTIONEER")}
            >
              AUCTIONEER
            </Stack>
          </Stack> */}

          {/* Tab Content */}
          <Stack
            spacing={2}
            sx={{
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Grid container>
              {/* Left Side - Tab Content */}
              <Grid item xs={12} md={8}>
                {currentTab === "auction-calender" && (
                  <Stack>
                    <Stack direction="row" sx={{ mb: 2 }}>
                      <Stack
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          p: 1.5,
                          borderRadius: "4px 0 0 4px",
                          fontWeight: 600,
                        }}
                      >
                        WEB-SOURCER
                      </Stack>
                      <Stack
                        sx={{
                          bgcolor: theme.palette.grey[200],
                          p: 1.5,
                          borderRadius: "0 4px 4px 0",
                          fontWeight: 600,
                        }}
                      >
                        TOOL SOURCER (DASHBOARD)
                      </Stack>
                    </Stack>

                    <Stack spacing={2}>
                      <Stack>
                        <Typography variant="subtitle2">About:</Typography>
                      </Stack>

                      <Stack spacing={2}>
                        <Typography variant="subtitle1">
                          Contact Information
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Broker Name:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.broker_name || "AGRIFARMER_1301"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Location:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.address || "No & Street"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Ward:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.ward || "SON KY"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            District:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.district || "TAN PHU"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            City:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.city || "Ho Chi Minh"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Zipcode:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.zipcode || "700000"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Phone:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.phone || "(084) 028-1234-5678"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Messenger:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ flex: 1 }}
                          ></Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                )}

                {currentTab === "region" && (
                  <Stack>
                    <Typography variant="h6">Region Information</Typography>
                    <Typography variant="body1">
                      Regional details for this auction will be displayed here.
                    </Typography>
                  </Stack>
                )}

                {currentTab === "auctioneer" && (
                  <Stack>
                    <Stack direction="row" sx={{ mb: 2 }}>
                      <Stack
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          p: 1.5,
                          borderRadius: "4px 0 0 4px",
                          fontWeight: 600,
                        }}
                      >
                        WEB-SOURCER
                      </Stack>
                      <Stack
                        sx={{
                          bgcolor: theme.palette.grey[200],
                          p: 1.5,
                          borderRadius: "0 4px 4px 0",
                          fontWeight: 600,
                        }}
                      >
                        TOOL SOURCER (DASHBOARD)
                      </Stack>
                    </Stack>

                    <Stack spacing={2}>
                      <Stack>
                        <Typography variant="subtitle2">About:</Typography>
                      </Stack>

                      <Stack spacing={2}>
                        <Typography variant="subtitle1">
                          Contact Information
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Broker Name:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.name ||
                              auction?.seller?.vi?.name ||
                              "AGRIFARMER_1301"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Location:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.address ||
                              auction?.warehouse?.address ||
                              "No & Street"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Ward:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.ward ||
                              auction?.seller?.address?.road ||
                              auction?.warehouse?.ward ||
                              auction?.warehouse?.road ||
                              "SON KY"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            District:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.city?.name ||
                              auction?.seller?.address?.city?.vi?.name ||
                              auction?.warehouse?.city?.name ||
                              auction?.warehouse?.city?.vi?.name ||
                              "TAN PHU"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            City:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.city?.name ||
                              auction?.seller?.address?.city?.vi?.name ||
                              auction?.warehouse?.city?.name ||
                              auction?.warehouse?.city?.vi?.name ||
                              "Ho Chi Minh"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Zipcode:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.zip ||
                              auction?.seller?.address?.city?.zip ||
                              auction?.warehouse?.zip ||
                              auction?.warehouse?.city?.zip ||
                              "700000"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Phone:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: "background.default",
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {auction?.seller?.address?.contact_person_number ||
                              auction?.warehouse?.contact_person_number ||
                              "(084) 028-1234-5678"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ width: 120 }}>
                            Messenger:
                          </Typography>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            Send Message
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Grid>

              {/* Right Side - Map */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  flex: 1,
                  minHeight: 400,
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 1,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Stack
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "white",
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    maxWidth: 150,
                    zIndex: 10,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Zip Code
                  </Typography>
                  <Stack spacing={0.5}>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Typography
                        key={item}
                        variant="caption"
                        sx={{ fontSize: "0.7rem" }}
                      >
                        {item}. Zip {item}00{item}00
                      </Typography>
                    ))}
                  </Stack>
                </Stack>

                {/* Map Component - Replace with actual map component */}
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
                  <WholesalesMarketsMap handleClick={() => handleClickOnMap} />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </CustomContainer>

      {/* Add new new section  */}

      {auctionType === "live-auction" ? (
        <LiveAuctionDetails
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          handleSubmitAuction={handleSubmitAuction}
          isSellerDetails={isSellerDetails}
        />
      ) : auctionType === "future-delivery-auction" ? (
        <FutureDeliveryAuctionDetails
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          handleSubmitAuction={handleSubmitAuction}
          isSellerDetails={isSellerDetails}
        />
      ) : auctionType === "surplus_auction" ||
        auctionType === "daily-catch-auction" ? (
        <SurplusDailyAuctionDetails
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          handleSubmitAuction={handleSubmitAuction}
          isSellerDetails={isSellerDetails}
        />
      ) : (
        <SurplusDailyAuctionDetails
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          handleSubmitAuction={handleSubmitAuction}
          isSellerDetails={isSellerDetails}
        />
      )}
    </>
  );
};

AuctionDetails.propTypes = {};

export default memo(AuctionDetails);
