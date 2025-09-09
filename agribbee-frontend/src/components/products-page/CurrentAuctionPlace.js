import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi"
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useSelector } from "react-redux"
import { onSingleErrorResponse } from "../ErrorResponse"
import {
  CustomButton,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import AuctionCard from "../auction-cards/AuctionCard"
import { AnimationDots } from "./AnimationDots"
import CustomePagination from "../pagination/Pagination"
import CategoryBasedAuctionsFilter from "./CategoryBasedAuctionsFilter"
import { CategoryApi } from "@/hooks/react-query/config/categoryApi"
import CustomContainer from "../container"

const CurrentAuctionPlace = ({ handleRouterPush, query }) => {
  const [page_limit, setPageLimit] = useState(8)
  const [offset, setOffset] = useState(1)
  const { global } = useSelector((state) => state.globalSettings)
  const theme = useTheme()

  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"))
  const languageDirection = localStorage.getItem("direction")

  const {
    data: liveAuction,
    refetch: refetchLiveAuctions,
    isLoading: liveAuctionLoading,
  } = useQuery(
    ["live_auction", page_limit, offset],
    () => AuctionsApi.auctions("live-auction", page_limit, offset),
    {
      enabled: false,
      staleTime: 1000 * 60 * 8,
      onError: onSingleErrorResponse,
    }
  )

  const {
    data: categories,
    refetch: refetchCategories,
    isLoading: isLoadingCategories,
  } = useQuery(["categories"], () => CategoryApi.categories(), {
    enabled: false,
    staleTime: 1000 * 60 * 8,
    onError: onSingleErrorResponse,
  })

  useEffect(() => {
    refetchLiveAuctions()
    refetchCategories()
    console.log("categories ", categories?.data?.response)
  }, [])

  const handleLoadMore = (value) => {
    setOffset(value)
    refetchLiveAuctions()
  }
  const handleAllLiveAuctions = () => {
    setOffset(2)
  }

  return (
    <CustomContainer>
      <Stack sx={{ marginY: { xs: "30px", md: "50px" }, alignItems: "center" }}>
        <Typography
          sx={{
            color: (theme) => theme.palette.text.green,
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: "600",
            textTransform: "uppercase",
          }}
        >
          BID NOW ON
        </Typography>
        <Typography
          sx={{
            marginTop: "10px",
            color: (theme) => theme.palette.text.default,
            fontSize: { xs: "22px", md: "30px" },
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Current auctions place
        </Typography>
      </Stack>

      <Stack>
        <Typography
          sx={{
            marginY: "15px",
            color: (theme) => theme.palette.blue[200],
            fontSize: { xs: "22px", md: "30px" },
            fontWeight: "800",
            textTransform: "uppercase",
          }}
        >
          Live auctions
        </Typography>

        {!liveAuctionLoading ? (
          <Stack marginBottom={3}>
            <Grid container spacing={3}>
              {liveAuction?.data?.auctions?.map((auction) => {
                return (
                  <Grid item key={auction?.id} xs={6} md={3}>
                    <AuctionCard
                      auction={auction}
                      auctionType={auction.auction_type}
                      pageType={"current-auction"}
                      hasBackGroundSection="true"
                    />
                  </Grid>
                )
              })}
            </Grid>

            {offset > 1 && liveAuction?.data?.total_size > page_limit ? (
              <Grid item xs={12} sm={12} md={12} align="center">
                <CustomePagination
                  total_size={liveAuction?.data?.total_size}
                  page_limit={page_limit}
                  offset={offset}
                  setOffset={handleLoadMore}
                />
              </Grid>
            ) : (
              ""
            )}

            {offset <= 1 && (
              <Box textAlign={"center"} marginTop={"30px"}>
                <CustomButton
                  onClick={() => handleAllLiveAuctions()}
                  sx={{
                    backgroundColor: theme.palette.blue[200],
                    "&:hover": {
                      backgroundColor: theme.palette.blue[300],
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.neutral[100],
                      fontSize: { xs: "12px", md: "14px" },
                    }}
                  >
                    View All live Auction Lots
                  </Typography>
                </CustomButton>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack width="100%" minHeight="500px">
            {" "}
            <AnimationDots align="center" />
          </Stack>
        )}
        {!isLoadingCategories &&
          categories?.data?.response?.map((cat, index) => {
            return (
              <Box key={index}>
                <CategoryBasedAuctionsFilter
                  auctionType={"future-delivery-auction"}
                  category={cat}
                  category_id={cat?._id}
                  category_name={cat.name || null}
                  backgroundColor={
                    cat.backgroundColor ? cat.backgroundColor : "#F8FFF3"
                  }
                  catPillBackground={
                    cat.pillBackgroundColor
                      ? cat.pillBackgroundColor
                      : "##7AC143"
                  }
                  handleRouterPush={handleRouterPush}
                  query={query}
                  page_limit={4}
                />
              </Box>
            )
          })}
      </Stack>
    </CustomContainer>
  )
}

export default CurrentAuctionPlace
