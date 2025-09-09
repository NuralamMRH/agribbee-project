import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { ProductsApi } from "@/hooks/react-query/config/productsApi"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style"
import SearchFilterWithResults from "./SearchFilterWithResults"
import { getFilterChoices } from "./getFilterChoices"
import Meta from "../Meta"
import { onErrorResponse } from "../ErrorResponse"
import { setSearchTagData } from "@/redux/slices/searchTagSlice"
import CustomContainer from "../container"
import HomePageHero from "../hero-banner/home-page-hero"
import MuaTanGoc from "../home/mua-tan-goc/MuaTanGoc"
import AuctionTabContainer from "./AuctionTabContainer"
import CurrentAuctionPlace from "./CurrentAuctionPlace"
import { Stack } from "@mui/material"
import SurplusAuction from "./SurplusAuction"
import SurplusDailyAuctionBanner from "../banner/SurplusDailyAuctionBanner"

// //////////////// Surplus Default Images //////////////
import surplusBanner from "../../assets/images/banners/bannerlogoblock@3x.png"
import surplusLogo from "../../assets/images/banners/surpluslogo.png"
import surplusImage1 from "../../assets/images/banners/bannercat1@3x.png"
import surplusImage2 from "../../assets/images/banners/bannercat2@3x.png"
import surplusImage3 from "../../assets/images/banners/bannercat4@3x.png"
import surplusImage4 from "../../assets/images/banners/bannercat3@3x.png"
import surplusImage5 from "../../assets/images/banners/cat12@2x.png"
import surplusImage6 from "../../assets/images/banners/cat22@2x.png"
import surplusImage7 from "../../assets/images/banners/cat21@2x.png"
import surplusImage8 from "../../assets/images/banners/cat11@2x.png"
import surplusImage9 from "../../assets/images/banners/bannercat7@3x.png"

// //////////////// DailyCatchAuctions Default Images //////////////
import dailyCatchBanner from "../../assets/images/banners/rectangle-245@2x.png"
import dailyCatchLogo from "../../assets/images/banners/whatsapp-image-20240621-at-50448-pm-1@2x.png"
import dailyCatchImage1 from "../../assets/images/banners/cardimage@2x.png"
import dailyCatchImage2 from "../../assets/images/banners/image-333@2x.png"
import dailyCatchImage3 from "../../assets/images/banners/cardimage16@2x.png"
import dailyCatchImage4 from "../../assets/images/banners/image-562@2x.png"
import dailyCatchImage5 from "../../assets/images/banners/cardimage@2x.png"
import dailyCatchImage6 from "../../assets/images/banners/cardimage18@2x.png"
import dailyCatchImage7 from "../../assets/images/banners/cardimage@2x.png"
import dailyCatchImage8 from "../../assets/images/banners/cardimage@2x.png"
import dailyCatchImage9 from "../../assets/images/banners/cardimage@2x.png"
import FutureAuctionBanner from "../banner/FutureAuctionBanner"

// //////////////// Future Delivery Auction Default Images //////////////
import futureDeliveryBanner from "../../assets/images/banners/rectangle-245@2x.png"
import futureDeliveryBanner2 from "../../assets/images/banners/rectangle-245@2x.png"
import futureDeliveryLogo from "../../assets/images/banners/whatsapp-image-20240621-at-50447-pm-1@2x.png"
import futureDeliveryCalender from "../../assets/images/banners/bannerlogoblock2@3x.png"
import futureDeliveryImage1 from "../../assets/images/banners/cardimage@2x.png"

// //////////////// Future Delivery Auction Default Images //////////////
import liveAuctionBanner from "../../assets/images/banners/rectangle-245@2x.png"
import liveAuctionLogo from "../../assets/images/banners/whatsapp-image-20240621-at-50447-pm-1@2x.png"
import liveAuctionBigBanner from "../../assets/images/banners/banner@3x.png"
import liveAuctionImage1 from "../../assets/images/banners/cardimage@2x.png"
import LiveAuctionBanner from "../banner/LiveAuctionBanner"

const AuctionSearchPage = ({ product_type, configData }) => {
  const dispatch = useDispatch()
  const { global } = useSelector((state) => state.globalSettings)
  const { landingPageData } = useSelector((state) => state.storedData)
  const router = useRouter()
  const { query, page, auctionType, tags } = router.query
  const [type, setType] = useState("all")
  const { searchTagData, selectedValue, selectedName } = useSelector(
    (state) => state.searchTags
  )
  // const pageLimitFromAdmin = global.
  const [page_limit, setPageLimit] = useState(15)
  const [offset, setOffset] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const [globalTabType, setGlobalTabType] = useState("")
  const { filterData } = useSelector((state) => state.searchFilterStore)
  const [checkfilter, setCheckfilter] = useState(false)
  const [pageData, setPageData] = useState({})
  const [searchOrPage, setSearchOrPage] = useState({})
  const [totalData, setTotalData] = useState(null)
  const activeFilters = searchTagData.filter((item) => item.isActive === true)

  const handleRouterPush = (newFilters) => {
    // Merge existing query with new filters
    const updatedQuery = {
      ...router.query, // Existing query parameters
      ...newFilters, // New filters
    }
    console.log("Updated Query:", updatedQuery)
    // Build pathname dynamically
    const pathname = `/auctions`
    // Push the updated query and path
    router.push({
      pathname,
      query: updatedQuery,
    })
  }

  useEffect(() => {
    console.log("page page: ", page)
    !page ? handleRouterPush({ page: "current-auctions-place" }) : null
  }, [page])

  const apiKey =
    page === "surplus-auction"
      ? "surplus-auction"
      : globalTabType === "live-auction"
        ? "live-auction"
        : globalTabType === "future-delivery-auction"
          ? "future-delivery-auction"
          : globalTabType === "daily-catch-auction"
            ? "daily-catch-auction"
            : "current-auctions-place"

  const handleAPiCallOnSuccess = (res) => {
    if (auctionType) {
      setPageData({
        ...res,
        data: {
          ...res,
          restaurants: res.data,
          total_size: res?.data?.length,
        },
      })

      setSearchOrPage({
        ...res,
        data: {
          ...res,
          restaurants: res.data,
          total_size: res?.data?.length,
        },
      })
    } else {
      setPageData(res)
      setSearchOrPage(res)
    }
    setTotalData(res?.data?.total_size)
  }

  const { isLoading, data, isError, error, refetch, isRefetching } = useQuery(
    [page, page, searchValue, offset, page_limit],
    () =>
      ProductsApi.productSearch(
        page,
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
  )
  //POPULAR AND BEST REVIEW FOOD API

  useEffect(() => {
    if (query || page || auctionType) {
      setSearchValue(query)
    } else {
      if (tags) {
        setSearchValue(null)
      } else {
        // router.push('/home')
      }
    }
  }, [query, tags])

  if (isError) {
    return <h1>{error.messages}</h1>
  }
  //const searchOrPage = All ? popularData : data
  useEffect(() => {
    handleFilteredData()
  }, [checkfilter])

  const handleFilter = () => {
    setCheckfilter((prevState) => !prevState)
  }
  const handleClearAll = async () => {
    await refetch()
  }

  const handleFilteredData = () => {
    let filteredData = getFilterChoices(filterData, searchOrPage, page)

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
  }

  useEffect(() => {
    const temPage = page === "most-reviewed" ? "rating" : page
    const temAuctionType =
      auctionType === "latest" ? "new_arrivals" : auctionType
    const newArr = searchTagData.map((item) =>
      item.value === (temPage || temAuctionType)
        ? { ...item, isActive: true }
        : item
    )
    dispatch(setSearchTagData(newArr))
  }, [page, auctionType])
  useEffect(() => {
    setOffset(1)
  }, [searchTagData, selectedName, searchValue])

  return (
    <>
      <Meta
        title={`${searchValue ? searchValue : "Searching..."} on ${
          configData?.business_name
        }`}
      />
      <CustomStackFullWidth
        mb="5rem"
        sx={{ marginTop: { xs: "70px", md: "0px" }, minHeight: "70vh" }}
      >
        {page === "current-auctions-place" ? (
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
        ) : page === "surplus-auction" ? (
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
        ) : page === "daily-catch-auction" ? (
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
        ) : page === "future-delivery-auction" ? (
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
        ) : page === "live-auction" ? (
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

        <CustomContainer>
          <Stack xs={12} sm={12} md={12} marginTop={"10px"}>
            <AuctionTabContainer
              filterData={filterData}
              globalTabType={page}
              setGlobalTabType={handleRouterPush}
            />
          </Stack>
        </CustomContainer>

        {page === "current-auctions-place" ? (
          <CurrentAuctionPlace
            handleRouterPush={handleRouterPush}
            query={query}
          />
        ) : (
          <SurplusAuction handleRouterPush={handleRouterPush} />
        )}
      </CustomStackFullWidth>
    </>
  )
}

export default AuctionSearchPage
