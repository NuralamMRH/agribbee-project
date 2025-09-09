import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ProductsApi } from "@/hooks/react-query/config/productsApi";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import SearchFilterWithResults from "./SearchFilterWithResults";
import { getFilterChoices } from "./getFilterChoices";
import Meta from "../Meta";
import { onErrorResponse } from "../ErrorResponse";
import { RestaurantsApi } from "@/hooks/react-query/config/restaurantApi";
import {
  setFilterbyByDispatch,
  setGlobalTabType,
} from "@/redux/slices/searchFilter";
import { setSearchTagData } from "@/redux/slices/searchTagSlice";
import CustomContainer from "../container";
import HomePageHero from "../hero-banner/home-page-hero";
import MuaTanGoc from "../home/mua-tan-goc/MuaTanGoc";
import AuctionTabContainer from "./AuctionTabContainer";
import CurrentAuctionPlace from "./CurrentAuctionPlace";
import { Stack } from "@mui/material";

const ProductSearchPage = ({ product_type, configData }) => {
  const dispatch = useDispatch();
  const { global } = useSelector((state) => state.globalSettings);
  const { landingPageData } = useSelector((state) => state.storedData);
  const router = useRouter();
  const { query, page, auctionType, tags } = router.query;
  const [type, setType] = useState("all");
  const { searchTagData, selectedValue, selectedName } = useSelector(
    (state) => state.searchTags
  );
  // const pageLimitFromAdmin = global.
  const [page_limit, setPageLimit] = useState(15);
  const [offset, setOffset] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  //const [globalTabType, setGlobalTabType] = useState('products')
  const { filterData, globalTabType } = useSelector(
    (state) => state.searchFilterStore
  );
  const [checkfilter, setCheckfilter] = useState(false);
  const [pageData, setPageData] = useState({});
  const [searchOrPage, setSearchOrPage] = useState({});
  const [totalData, setTotalData] = useState(null);
  const activeFilters = searchTagData.filter((item) => item.isActive === true);
  const apiKey =
    globalTabType === "surplus-auction"
      ? "surplus-auction"
      : globalTabType === "live-auction"
        ? "live-auction"
        : globalTabType === "future-delivery-auction"
          ? "future-delivery-auction"
          : globalTabType === "daily-catch-auction"
            ? "daily-catch-auction"
            : "current-auction-place";
  const handleAPiCallOnSuccess = (res) => {
    if (auctionType) {
      dispatch(setGlobalTabType(apiKey));
      setPageData({
        ...res,
        data: {
          ...res,
          restaurants: res.data,
          total_size: res?.data?.length,
        },
      });

      setSearchOrPage({
        ...res,
        data: {
          ...res,
          restaurants: res.data,
          total_size: res?.data?.length,
        },
      });
    } else {
      setPageData(res);
      setSearchOrPage(res);
      dispatch(setGlobalTabType(apiKey));
    }
    setTotalData(res?.data?.total_size);
  };

  const { isLoading, data, isError, error, refetch, isRefetching } = useQuery(
    [apiKey, globalTabType, searchValue, offset, page_limit],
    () =>
      ProductsApi.productSearch(
        globalTabType,
        searchValue,
        offset,
        page_limit,
        filterData
      ),
    {
      retry: 1,
      enabled: false,
      onSuccess: handleAPiCallOnSuccess,
      onError: onErrorResponse,
    }
  );
  //POPULAR AND BEST REVIEW FOOD API
  const {
    isLoading: popularFoodisLoading,
    data: popularData,
    refetch: popularRefetch,
  } = useQuery(
    ["popular-food", offset, page_limit, type],
    () => ProductsApi.products(page, offset, page_limit, type),
    {
      enabled: false,
      onSuccess: handleAPiCallOnSuccess,
    }
  );
  const {
    isLoading: restaurantIsLoading,
    data: restaurantData,
    refetch: restaurantRefetch,
  } = useQuery(
    [`restaurant-list`, auctionType],
    () => RestaurantsApi.typeWiseRestaurantList({ auctionType, type }),
    {
      enabled: false,
      onSuccess: handleAPiCallOnSuccess,
      onError: onErrorResponse,
    }
  );

  useEffect(() => {
    if (auctionType !== undefined) {
      restaurantRefetch();
    }
  }, [auctionType, offset]);

  useEffect(() => {
    if (page !== undefined) {
      popularRefetch();
    }
  }, [page, offset]);

  useEffect(() => {
    if (query || page || auctionType) {
      setSearchValue(query);
    } else {
      if (tags) {
        setSearchValue(null);
      } else {
        // router.push('/home')
      }
    }
  }, [query, tags]);

  useEffect(async () => {
    if (searchValue) {
      await refetch();
    } else if (tags && page) {
      await refetch();
    } else if (tags) {
      if (activeFilters?.length > 0) {
        await refetch();
      }
    }
  }, [searchValue, filterData, tags, offset]);

  useEffect(() => {
    setOffset(1);
    if (searchValue !== undefined) {
      refetch();
    }
  }, [globalTabType]);

  if (isError) {
    return <h1>{error.messages}</h1>;
  }
  //const searchOrPage = All ? popularData : data
  useEffect(() => {
    handleFilteredData();
  }, [checkfilter]);

  const handleFilter = () => {
    setCheckfilter((prevState) => !prevState);
  };
  const handleClearAll = async () => {
    await refetch();
  };

  const handleFilteredData = () => {
    let filteredData = getFilterChoices(
      filterData,
      searchOrPage,
      globalTabType
    );

    // setPageData({
    //   ...searchOrPage,
    //   data:
    //     globalTabType === "products"
    //       ? {
    //           ...pageData?.data,
    //           products: filteredData,
    //           total_size: filteredData?.length,
    //         }
    //       : {
    //           ...pageData.data,
    //           restaurants: filteredData,
    //           total_size: filteredData?.length,
    //         },
    // });
  };

  useEffect(() => {
    const temPage = page === "most-reviewed" ? "rating" : page;
    const temAuctionType =
      auctionType === "latest" ? "new_arrivals" : auctionType;
    const newArr = searchTagData.map((item) =>
      item.value === (temPage || temAuctionType)
        ? { ...item, isActive: true }
        : item
    );
    dispatch(setSearchTagData(newArr));
  }, [page, auctionType]);
  useEffect(() => {
    setOffset(1);
  }, [searchTagData, selectedName, searchValue]);

  return (
    <>
      <Meta
        title={`${searchValue ? searchValue : "Searching..."} on ${
          configData?.business_name
        }`}
      />
      <CustomStackFullWidth mb="5rem" sx={{ minHeight: "70vh" }}>
        {globalTabType === "current-auction-place" ? (
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
        ) : null}

        <CustomContainer>
          <Stack xs={12} sm={12} md={12} marginTop={"10px"}>
            <AuctionTabContainer
              filterData={filterData}
              globalTabType={globalTabType}
              setGlobalTabType={setGlobalTabType}
            />
          </Stack>

          {globalTabType === "current-auction-place" ? (
            <CurrentAuctionPlace />
          ) : (
            <SearchFilterWithResults
              filterData={filterData}
              searchValue={searchValue}
              globalTabType={globalTabType}
              setGlobalTabType={setGlobalTabType}
              isLoading={
                isLoading || restaurantIsLoading || popularFoodisLoading
              }
              isNetworkCalling={isRefetching}
              data={pageData}
              page_limit={page_limit}
              offset={offset}
              setOffset={setOffset}
              global={global}
              handleFilter={handleFilter}
              handleClearAll={handleClearAll}
              page={page === "most-reviewed" ? "most_reviewed" : page}
              popularFoodisLoading={popularFoodisLoading}
              auctionType={auctionType}
              restaurantIsLoading={restaurantIsLoading}
              totalData={totalData}
            />
          )}
        </CustomContainer>
      </CustomStackFullWidth>
    </>
  );
};

export default ProductSearchPage;
