import { BannerApi } from "@/hooks/react-query/config/bannerApi";
import { CampaignApi } from "@/hooks/react-query/config/campaignApi";
import {
  MostReviewedApi,
  PopularFoodNearbyApi,
} from "@/hooks/react-query/config/productsApi";
import { useWishListGet } from "@/hooks/react-query/config/wish-list/useWishListGet";
import {
  setFilterbyByDispatch,
  setGlobalTabType,
} from "@/redux/slices/searchFilter";
import {
  setSearchTagData,
  setSelectedName,
  setSelectedValue,
} from "@/redux/slices/searchTagSlice";
import {
  setBanners,
  setBestReviewedFood,
  setPageTabs,
  setPopularFood,
} from "@/redux/slices/storedData";
import { setWelcomeModal } from "@/redux/slices/utils";
import { setWishList } from "@/redux/slices/wishList";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { onSingleErrorResponse } from "../ErrorResponse";
import PushNotificationLayout from "../PushNotificationLayout";
import CashBackPopup from "../cash-back-popup/CashBackPopup";
import CustomContainer from "../container";
import CustomModal from "../custom-modal/CustomModal";
import ProductSearchPage from "../products-page/ProductSearchPage";
import Banner from "./Banner";
import DifferentFoodCompontent from "./DefferntFoodCompontent";
import NewRestaurant from "./NewRestaurant";
import PromotionalBanner from "./PromotionalBanner";
import Restaurant from "./Restaurant";
import SearchFilterTag from "./Search-filter-tag/SearchFilterTag";
import Cuisines from "./cuisines";
import FeatureCatagories from "./featured-categories/FeatureCatagories";
import VisitAgain from "./visit-again";
import HomePageHero from "../hero-banner/home-page-hero";
import MuaTanGoc from "./mua-tan-goc/MuaTanGoc";
import WholesalesMarketsMap from "./wholesales-markets-section/WholesalesMarketsMap";
import AiAgriInfoBlock from "./HomeInfo/AiAgriInfoBlock";
import WholesaleMarkets from "./wholesales-markets-section/WholesaleMarkets";
import { useGetCities } from "@/hooks/react-query/config/address/useGetCities";
import HowToTradeContent from "./HomeInfo/HowToTradeContent";
import WhyJoinWithUsContent from "./HomeInfo/WhyJoinWithUsContent";
import WholesaleMarketsBottom from "./wholesales-markets-section/WholesaleMarketsBottom";
import SupplyChainSection from "./HomeInfo/SupplyChainSection";
import RegisterCards from "./HomeInfo/RegisterCards";
import InternationalTransactionsInfo from "./HomeInfo/TransactionsInfo";
import { ContactFormAndInfo } from "./HomeInfo/ContactFormAndInfo";
import SearchWithSuggest from "./SearchWithSuggest/SearchWithSuggest";
import DifferentAuctionComponent from "./DefferentAuctionComponent";
import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi";

const Homes = ({ configData }) => {
  const { global } = useSelector((state) => state.globalSettings);
  const [fetchedData, setFetcheedData] = useState({});
  const { filterData, globalTabType } = useSelector(
    (state) => state.searchFilterStore
  );

  const auction_type = "live_auction";

  const { refetch: citiesRefetch, data: citiesData } = useGetCities();

  useEffect(() => {
    citiesRefetch(); // Call refetch to manually trigger the query
  }, []); // Run when the component mounts

  // console.log(citiesData);

  const { userData } = useSelector((state) => state.user);

  const [sort_by, setSort_by] = useState("");
  const { searchTagData } = useSelector((state) => state.searchTags);
  const router = useRouter();
  const { query, page, restaurantType, tags } = router.query;

  const { banners, bestReviewedFoods, popularFood } = useSelector(
    (state) => state.storedData
  );

  const { landingPageData } = useSelector((state) => state.storedData);
  const { welcomeModal } = useSelector((state) => state.utilsData);
  const dispatch = useDispatch();
  const onSuccessHandler = (response) => {
    setFetcheedData(response);
    dispatch(setWishList(fetchedData));
  };
  const { refetch } = useWishListGet(onSuccessHandler);
  let getToken = undefined;
  if (typeof window !== "undefined") {
    getToken = localStorage.getItem("token");
  }
  useEffect(() => {
    if (getToken) {
      refetch().then();
    }
  }, [getToken, fetchedData]);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }

  useEffect(() => {
    if (!zoneid) {
      localStorage.setItem("zoneid", "70-74");
    }
  }, [zoneid]);

  const {
    data,
    refetch: refetchBannerData,
    isLoading: bannerIsLoading,
  } = useQuery(["banner-image"], BannerApi.bannerList, {
    enabled: false,
    staleTime: 1000 * 60 * 8,
    onError: onSingleErrorResponse,
  });

  const {
    data: mostReviewedData,
    refetch: refetchMostReviewed,
    isLoading,
  } = useQuery(["most-review-product"], MostReviewedApi.reviewed, {
    enabled: false,
    onError: onSingleErrorResponse,
  });

  const {
    isLoading: isLoadingNearByPopularRestaurantData,
    data: nearByPopularRestaurantData,
    refetch: refetchNearByPopularRestaurantData,
  } = useQuery(["popular-food"], PopularFoodNearbyApi.popularFood, {
    enabled: false,
    onError: onSingleErrorResponse,
  });
  useEffect(async () => {
    if (banners?.banners?.length === 0 && banners?.campaigns?.length === 0) {
      await refetchBannerData();
    }

    if (bestReviewedFoods?.length === 0) {
      await refetchMostReviewed();
    }
    if (popularFood?.length === 0) {
      await refetchNearByPopularRestaurantData();
    }
  }, []);
  const iSSearchValue = false;
  useEffect(() => {
    if (data) {
      dispatch(setBanners(data?.data));
    }
    if (mostReviewedData) {
      dispatch(setBestReviewedFood(mostReviewedData?.data?.products));
    }
    if (nearByPopularRestaurantData) {
      dispatch(setPopularFood(nearByPopularRestaurantData?.data?.products));
    }
  }, [data, mostReviewedData, nearByPopularRestaurantData]);

  useEffect(() => {
    const activeFilters = searchTagData.filter(
      (item) => item.isActive === true
    );
    if (activeFilters?.length > 0) {
      if (router.asPath === "/search") {
        const newArr = searchTagData.map((item) => ({
          ...item,
          isActive: false,
        }));
        dispatch(setSearchTagData(newArr));
        dispatch(setGlobalTabType("live-auction"));
        dispatch(setSelectedValue(""));
        dispatch(setSelectedName(""));
        setSort_by("");
      }
      dispatch(setGlobalTabType("current-auction-place"));
    }
    dispatch(setFilterbyByDispatch(activeFilters));
  }, [tags, page, restaurantType, query]);

  const handleCloseWelcomeModal = () => {
    dispatch(setWelcomeModal(false));
  };

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
        <AiAgriInfoBlock global={global} />

        <WholesaleMarkets />
        <CustomContainer>
          <FeatureCatagories height="70px" />
        </CustomContainer>
        <SearchWithSuggest />

        <HowToTradeContent />
        <WhyJoinWithUsContent />
        <WholesaleMarketsBottom />
        <SupplyChainSection />
        <RegisterCards />
        <DifferentAuctionComponent />
        <InternationalTransactionsInfo />
        <ContactFormAndInfo />

        {/* <SearchFilterTag
          sort_by={sort_by}
          setSort_by={setSort_by}
          tags={tags}
          query={query}
          page={page}
        /> */}
        {query || page || restaurantType || tags ? (
          {
            /* <CustomContainer>
            <ProductSearchPage
              tags={tags}
              configData={configData}
              query={query}
              page={page}
              restaurantType={restaurantType}
            />
          </CustomContainer> */
          }
        ) : (
          <>
            {/* <CustomContainer>
                            <Banner bannerIsLoading={bannerIsLoading} />
                        </CustomContainer> */}
            {/* <Box>
              <CustomContainer>
                <VisitAgain />
              </CustomContainer>
            </Box> */}

            <CustomContainer>
              {/* <DifferentFoodCompontent
                featuredIsLoading={featuredIsLoading}
                isLoading={isLoading}
                isLoadingNearByPopularRestaurantData={
                  isLoadingNearByPopularRestaurantData
                }
              /> */}
              {/* <NewRestaurant /> */}
              {/* {global && <Cuisines />} */}

              {/* {global?.banner_data?.promotional_banner_image && (
                <PromotionalBanner global={global} />
              )} */}

              {/* <Restaurant /> */}
            </CustomContainer>
          </>
        )}

        <CustomModal
          setModalOpen={handleCloseWelcomeModal}
          openModal={welcomeModal}
          closeButton
        >
          <Box
            sx={{
              maxWidth: "382px",
              width: "95vw",
              px: 1.3,
              pb: 4,
              textAlign: "center",
              img: {
                height: "unset",
              },
              marginInline: "auto",
            }}
          >
            <Box pb={2}>
              <img
                src={"/static/sign-up-welcome.svg"}
                alt="welcome"
                width={183}
                height={183}
              />
            </Box>
            <Box mt={2}>
              <Typography
                variant="h5"
                mb={1}
                color={theme.palette.neutral[1000]}
              >
                {t("Welcome to " + configData?.business_name)}
              </Typography>
              <Typography
                variant="body2"
                lineHeight={"1.5"}
                color={theme.palette.neutral[1000]}
              >
                {userData?.is_valid_for_discount
                  ? t(
                      `Get ready for a special welcome gift, enjoy a special discount on your first order within `
                    ) +
                    userData?.validity +
                    "."
                  : ""}
                {"  "}
                {t(`  Start exploring the best services around you.`)}
              </Typography>
            </Box>
          </Box>
        </CustomModal>
        {getToken && <CashBackPopup />}
      </PushNotificationLayout>
    </>
  );
};

export default Homes;
