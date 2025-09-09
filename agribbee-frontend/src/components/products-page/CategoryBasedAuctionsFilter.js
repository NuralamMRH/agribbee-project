import React, { useEffect, useState } from "react"
import CategoryBgPill from "../category/CategoryBgPill"
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi"
import { useSelector } from "react-redux"
import { useQuery } from "react-query"
import { onSingleErrorResponse } from "../ErrorResponse"
import { CustomButton } from "@/styled-components/CustomStyles.style"
import CustomePagination from "../pagination/Pagination"
import AuctionCard from "../auction-cards/AuctionCard"
import { AnimationDots } from "./AnimationDots"
import { RegionsApi } from "@/hooks/react-query/config/regionApi"
import { useRouter } from "next/router"
import { DatePicker } from "@mui/x-date-pickers"
import CustomImageContainer from "../CustomImageContainer"

const CategoryBasedAuctionsFilter = ({
  category,
  auctionType,
  category_id,
  category_name,
  backgroundColor,
  pillBackgroundColor,
  isLoadingFilter,
  keyword,
  isHideShowMoreBtn,
  page_limit,
}) => {
  const [offset, setOffset] = useState(1)
  const [deliveryEnding, setDeliveryEnding] = useState()
  const { global } = useSelector((state) => state.globalSettings)
  const theme = useTheme()
  const [selectedRegion, setSelectedRegion] = useState(null)
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"))
  const languageDirection = localStorage.getItem("direction")

  const {
    data: newAuctions,
    refetch: refetchNewAuctions,
    isLoading: isAuctionsLoading,
  } = useQuery(
    [
      auctionType,
      category_id,
      selectedRegion,
      keyword,
      deliveryEnding,
      page_limit,
      offset,
    ],
    () =>
      AuctionsApi.regionAuctions(
        auctionType,
        category_id,
        selectedRegion,
        keyword,
        deliveryEnding,
        page_limit,
        offset
      ),
    {
      enabled: false,
      staleTime: 1000 * 60 * 8,
      onError: onSingleErrorResponse,
    }
  )

  const {
    data: allRegions,
    refetch: refetchRegions,
    isLoading: isRegionsLoading,
  } = useQuery(
    ["regions-list"],
    () => RegionsApi.regions(), // Pass offset and limit as well
    {
      enabled: false,
      staleTime: 1000 * 60 * 8,
      onError: onSingleErrorResponse,
    }
  )

  useEffect(() => {
    refetchRegions()
    refetchNewAuctions()
    console.log("Auctions: ", newAuctions)
    console.log("auctionType: ", auctionType)
    console.log("category_id: ", category_id)
    console.log("selectedRegion: ", selectedRegion)
    console.log("allRegions: ", allRegions)
  }, [
    selectedRegion,
    category_id,
    auctionType,
    keyword,
    deliveryEnding,
    page_limit,
    offset,
  ])

  const handleLoadMore = (value) => {
    setOffset(value)
    refetchNewAuctions()
  }
  const handleAllLiveAuctions = () => {
    setOffset(2)
  }

  const handlePushQuery = (reg) => {
    setSelectedRegion(reg)
    refetchNewAuctions()
  }

  return (
    <Stack
      sx={{
        marginBottom: "40px",
      }}
    >
      {!isLoadingFilter && (
        <Stack
          direction={"row"}
          spacing={3}
          sx={{
            backgroundColor: "#ddf9ca",
            marginBottom: "10px",
            alignItems: "center",
            borderRadius: "10px",
            justifyContent: "space-between",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={3}>
            <Stack position={"relative"}>
              <CategoryBgPill fill={pillBackgroundColor || "#7AC143"} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  width: "100%",
                  color: "white",
                }}
              >
                <img
                  src={`${global?.base_urls?.category_image_path}/${category?.icon}`}
                  alt={category?.icon}
                  style={{
                    width: "25px",
                    height: "25px",
                    filter: "invert(1)",
                  }} // Example for dynamic coloring
                />

                <Typography
                  fontSize={isSmall ? "10px" : "12px"}
                  textOverflow={"ellipsis"}
                >
                  {category_name}
                </Typography>
              </Box>
            </Stack>

            <Box padding={"0px"}>
              {" "}
              {!isRegionsLoading &&
                allRegions?.data.regions.map((r) => (
                  <Button
                    key={r._id}
                    sx={{
                      fontSize: "12px",
                      padding: "5px",
                      color:
                        r._id === selectedRegion
                          ? "rgba(122, 193, 67, 1) !important"
                          : "rgba(121, 121, 121, 1) !important",
                    }}
                    onClick={() => handlePushQuery(r._id)}
                  >
                    {r.name}
                  </Button>
                ))}{" "}
            </Box>
          </Stack>
          {auctionType === "future-delivery-auction" && (
            <TextField
              type="date"
              margin="normal"
              value={deliveryEnding}
              onChange={(e) => {
                setDeliveryEnding(e.target.value)
              }}
              sx={{
                backdropFilter: "blur(2px) grayscale(100%)",
                background: "#fff",
                borderRadius: "7px",
              }}
            />
          )}
        </Stack>
      )}

      {!isAuctionsLoading ? (
        <Stack>
          <Grid container spacing={3}>
            {newAuctions?.data?.auctions?.map((auction) => {
              return (
                <Grid item key={auction?.id} xs={6} md={3}>
                  <AuctionCard
                    auction={auction}
                    auctionImageUrl={global?.base_urls?.product_image_path}
                    auctionType={auction.auction_type}
                    image={auction?.product_id?.image}
                    hasBackGroundSection="true"
                  />
                </Grid>
              )
            })}
          </Grid>

          {(isHideShowMoreBtn || offset > 1) &&
          newAuctions?.data?.total_size > page_limit ? (
            <Grid item xs={12} sm={12} md={12} align="center">
              <CustomePagination
                total_size={newAuctions?.data?.total_size}
                page_limit={page_limit}
                offset={offset}
                setOffset={handleLoadMore}
              />
            </Grid>
          ) : (
            ""
          )}

          {!isHideShowMoreBtn &&
            offset <= 1 &&
            newAuctions?.data?.total_size > page_limit && (
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
                    View All Auctions Lots
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
    </Stack>
  )
}

export default CategoryBasedAuctionsFilter
