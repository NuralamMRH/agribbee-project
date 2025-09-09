import { AuctionsApi } from "@/hooks/react-query/config/auctionsApi"
import { useWishListDelete } from "@/hooks/react-query/config/wish-list/useWishListDelete"
import { addWishList, removeWishListAuction } from "@/redux/slices/wishList"
import { getConvertDiscount, handleBadge } from "@/utils/customFunctions"
import { useTheme } from "@mui/material/styles"
import React, { memo, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useMutation } from "react-query"
import { useDispatch, useSelector } from "react-redux"

import HomePageAuctionCard from "./HomePageAuctionCard"
import CurrentAuctionCard from "./CurrentAuctionCard"
import { useRouter } from "next/router"

const AuctionCard = ({
  auction,
  auctionType,
  pageType,
  hasBackGroundSection,
  isSellerDetails,
  width,
  className,
  contentHide,
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const { name, price, available_time_ends, available_time_starts } = auction

  const { t } = useTranslation()
  const { global } = useSelector((state) => state.globalSettings)
  const { token } = useSelector((state) => state.userToken)

  let location = undefined
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location")
  }
  //   const { bidList } = useSelector((state) => state.bid);
  const { wishLists } = useSelector((state) => state.wishList)

  let currencySymbol
  let currencySymbolDirection
  let digitAfterDecimalPoint

  if (global) {
    currencySymbol = global.currency_symbol
    currencySymbolDirection = global.currency_symbol_direction
    digitAfterDecimalPoint = global.digit_after_decimal_point
  }

  const languageDirection = localStorage.getItem("direction")

  const {
    mutate: addFavoriteMutation,
    isLoading,
    error,
    data,
  } = useMutation("add-favourite", () => AuctionsApi.addFavorite(auction.id), {
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(addWishList(auction))
        toast.success(response.data.message)
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message)
      alert("Toasted from Auction Card ", error.response.data.message)
    },
  })

  const addToFavorite = (e) => {
    e.stopPropagation()
    if (token) {
      addFavoriteMutation()
      // notify(data.message)
    } else toast.error(t("You are not logged in"))
  }

  const onSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListAuction(auction.id))
    toast.success(res.message, {
      id: "wishlist",
    })
  }
  const { mutate } = useWishListDelete()
  const deleteWishlistItem = (id, e) => {
    e.stopPropagation()
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message)
        alert("Toasted from Auction Card ", error.response.data.message)
      },
    })
  }

  const isInList = (id) => {
    return !!wishLists?.auction?.find((wishAuction) => wishAuction.id === id)
  }

  //   const isInBid = bidList?.find((things) => things.id === auction?.id);

  const handleAuctionDetail = (auction) => {
    console.log("Auction Details:", auction)
    router.push({
      pathname: `/auctions/${auction?._id}`,
      query: {
        slug: `${auction?.slug ? auction?.slug : auction?.id}`,
      },
    })
  }

  return (
    <>
      {auctionType === "live-auction" && pageType === "home-page" ? (
        <HomePageAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
          width={width}
          className={className}
          contentHide={contentHide}
        />
      ) : pageType === "current-auction" ? (
        <CurrentAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
        />
      ) : auctionType === "live-auction" ? (
        <HomePageAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
        />
      ) : auctionType === "future-delivery-auction" ? (
        <HomePageAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
        />
      ) : auctionType === "surplus_auction" ||
        auctionType === "daily-catch-auction" ? (
        <HomePageAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
        />
      ) : (
        <HomePageAuctionCard
          isInList={isInList}
          auction={auction}
          addToFavorite={addToFavorite}
          deleteWishlistItem={deleteWishlistItem}
          available_time_starts={available_time_starts}
          available_time_ends={available_time_ends}
          languageDirection={languageDirection}
          handleAuctionDetail={handleAuctionDetail}
          handleBadge={handleBadge}
          hasBackGroundSection={hasBackGroundSection}
          isSellerDetails={isSellerDetails}
          auctionType={auctionType}
        />
      )}
    </>
  )
}

AuctionCard.propTypes = {}

export default memo(AuctionCard)
