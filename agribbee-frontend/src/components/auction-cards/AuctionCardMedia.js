import React, { useEffect, useState } from "react"
import {
  Card,
  CardMedia,
  IconButton,
  Typography,
  useMediaQuery,
  styled,
  useTheme,
} from "@mui/material"

import { t } from "i18next"
import CustomImageContainer from "../CustomImageContainer"
import { Box, Stack } from "@mui/system"
import { useSelector } from "react-redux"
import { getAmount, isAvailable } from "../../utils/customFunctions"
import {
  CustomOverLay,
  CustomOverlayBox,
} from "../../styled-components/CustomStyles.style"
import AuctionRating from "./AuctionRating"

import QuickView from "./AuctionView"
import { useRouter } from "next/router"
import { AuctionCountdown } from "@/utils/AuctionCountdown"
const CardWrapper = styled(Box)(
  ({ theme, height, smHeight, maxHeight, smMaxHeight }) => ({
    position: "relative",
    height: height || "",
    maxHeight: maxHeight || "160px",
    [theme.breakpoints.down("sm")]: {
      height: smHeight || "",
      maxHeight: smMaxHeight ? smMaxHeight : maxHeight ? maxHeight : "140px",
    },
    img: {
      transition: "all ease 0.4s",
    },
    borderRadius: "8px",
    overflow: "hidden",
    "&:hover": {
      img: {
        transform: "scale(1.04)",
      },
    },
  })
)

const AuctionCardMedia = (props) => {
  const {
    id,
    image,
    onClick,
    available_time_starts,
    available_time_ends,
    available_date_ends,
    alt,
    addToFavorite,
    isInList,
    deleteWishlistItem,
    handleBadge,
    auction,
    isInBid,
    isTransformed,
    isSellerDetails,
    rating_count,
    auctionType,
    contentHide,
  } = props
  const [languageDirection, setLanguageDirection] = useState("ltr")
  const { global } = useSelector((state) => state.globalSettings)
  const theme = useTheme()
  const router = useRouter()
  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const auctionImageUrl = `${global?.base_urls?.product_image_path}/${auction.image || auction.product?.image}`

  let currencySymbol
  let currencySymbolDirection
  let digitAfterDecimalPoint

  if (global) {
    currencySymbol = global.currency_symbol
    currencySymbolDirection = global.currency_symbol_direction
    digitAfterDecimalPoint = global.digit_after_decimal_point
  }
  useEffect(() => {
    if (localStorage.getItem("direction")) {
      setLanguageDirection(localStorage.getItem("direction"))
    }
  }, [])

  // console.log(
  //   "available_time_starts: " +
  //     available_time_starts +
  //     " End: " +
  //     available_time_ends
  // );

  return (
    <>
      {!image && (
        <Stack sx={{ overflow: "hidden" }}>
          <CardWrapper
            height={
              !isXSmall && contentHide ? "300px" : isXSmall ? "270px" : ""
            }
            maxHeight={contentHide ? "100%" : ""}
          >
            <>
              {(auctionType === "live-auction" ||
                auctionType === "future-delivery-auction") &&
              available_time_ends &&
              !isAvailable(available_time_starts, available_time_ends) ? (
                <CustomOverlayBox>
                  <Stack alignItems={"center"}>
                    <Typography align="center" variant="h5">
                      {t("Not Available now")}
                    </Typography>
                    {contentHide && available_time_ends && (
                      <Typography fontSize={"10px"}>
                        <AuctionCountdown
                          auctionStartTime={available_time_starts}
                          auctionEndTime={available_time_ends}
                          isShowMinSec={true}
                          isHelpText={true}
                        />
                      </Typography>
                    )}
                  </Stack>
                </CustomOverlayBox>
              ) : (
                <CustomOverLay hover={isTransformed} border_radius="10px">
                  <QuickView
                    id={id}
                    isInList={isInList}
                    auctionViewHandleClick={onClick}
                    addToWishlistHandler={addToFavorite}
                    removeFromWishlistHandler={deleteWishlistItem}
                    isInBid={isInBid}
                    auction={auction}
                    auctionType={auctionType}
                  />
                </CustomOverLay>
              )}
            </>

            <CustomImageContainer
              src={auctionImageUrl}
              alt={alt}
              width="100%"
              height={contentHide ? "100%" : "160px"}
              borderRadius="8px"
              objectFit={"cover"}
              smHeight={contentHide ? "100%" : "130px"}
            />
          </CardWrapper>
        </Stack>
      )}
    </>
  )
}

export default AuctionCardMedia
