import { CategoryApi } from "@/hooks/react-query/config/categoryApi"
import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { onSingleErrorResponse } from "../ErrorResponse"
import { NavSectionVertical } from "../cat-filter"
import { NAV } from "@/config-global"
import { useRouter } from "next/router"
import CategoryBasedAuctionsFilter from "./CategoryBasedAuctionsFilter"
import CustomSearch from "@/components/home/hero-section-with-search/CustomSearchInput"
import { AnimationDots } from "./AnimationDots"
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style"
import CustomContainer from "../container"

const SurplusAuction = ({ handleRouterPush }) => {
  const [focused, setFocused] = useState(false)
  const searchRef = useRef(null)
  const onFocus = () => setFocused(true)
  const onBlur = () => {
    setFocused(false)
  }
  const [inputValue, setInputValue] = useState()
  const [page_limit, setPageLimit] = useState(8)
  const [offset, setOffset] = useState(1)
  const [selectedCat, setSelectedCat] = useState()

  const theme = useTheme()

  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"))
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"))
  const languageDirection = localStorage.getItem("direction")

  const router = useRouter()
  const { keyword, query, page, category, tags } = router.query

  const {
    data: catsData,
    refetch: refetchCategories,
    isLoading: isLoadingCategories,
  } = useQuery(["categories"], () => CategoryApi.categories(), {
    enabled: false,
    staleTime: 1000 * 60 * 8,
    onError: onSingleErrorResponse,
  })

  useEffect(() => {
    // refetchLiveAuctions()
    refetchCategories()
    console.log("categories: ", catsData)
  }, [])

  useEffect(() => {
    if (category && catsData?.data?.response) {
      const selectCat = catsData.data.response.find(
        (item) => item._id === category
      )
      setSelectedCat(selectCat || null) // Ensure null is set if no match is found
    }
  }, [category, catsData])

  const handleKeyPress = (value) => {
    // Trim the input value to remove leading and trailing spaces
    setFocused(false)
    handleRouterPush({ keyword: value })
    onBlur()
  }
  // console.log("isLarge", isLarge)

  return (
    <CustomStackFullWidth marginTop={20}>
      <CustomContainer>
        <Stack direction="row" spacing={5}>
          {!isSmall && (
            <Stack spacing={1} sx={{ width: NAV.W_BASE }}>
              <CustomSearch
                placeholder={"Search Auctions..."}
                setInputValue={handleKeyPress}
                handleSearchResult={handleKeyPress}
                handleFocus={onFocus}
                handleBlur={onBlur}
                query={keyword || inputValue}
                setFocused={setFocused}
              />

              {!isLoadingCategories && catsData?.data?.response.length > 0 && (
                <NavSectionVertical
                  data={catsData?.data?.response}
                  sx={{
                    py: 5,
                    borderRadius: 2,
                    backgroundColor: "rgba(76, 140, 209, 1)",
                    color: "white",
                    paddingX: 2,
                  }}
                />
              )}
            </Stack>
          )}

          <Stack>
            {category && selectedCat ? (
              <CategoryBasedAuctionsFilter
                auctionType={page}
                category={category ? selectedCat : ""}
                category_id={category ? selectedCat?._id : ""}
                category_name={category ? selectedCat?.name : ""}
                backgroundColor={
                  category && selectedCat?.backgroundColor
                    ? selectedCat?.backgroundColor
                    : "#F8FFF3"
                }
                catPillBackground={
                  category && selectedCat?.pillBackgroundColor
                    ? selectedCat?.pillBackgroundColor
                    : "##7AC143"
                }
                handleRouterPush={handleRouterPush}
                isLoadingFilter={isLoadingCategories}
                keyword={keyword || inputValue}
                isHideShowMoreBtn
                page_limit={page_limit}
              />
            ) : (
              !isLoadingCategories &&
              catsData?.data?.response?.map((cat, index) => {
                return (
                  <Stack key={index}>
                    <CategoryBasedAuctionsFilter
                      auctionType={page}
                      category={cat}
                      category_id={cat?._id || ""}
                      category_name={cat?.name || ""}
                      backgroundColor={
                        cat?.backgroundColor ? cat?.backgroundColor : "#F8FFF3"
                      }
                      catPillBackground={
                        cat?.pillBackgroundColor
                          ? cat?.pillBackgroundColor
                          : "##7AC143"
                      }
                      handleRouterPush={handleRouterPush}
                      isLoadingFilter={isLoadingCategories}
                      keyword={keyword || inputValue}
                      isHideShowMoreBtn
                      page_limit={page_limit}
                    />
                  </Stack>
                )
              })
            )}
          </Stack>
        </Stack>
      </CustomContainer>
    </CustomStackFullWidth>
  )
}

export default SurplusAuction
