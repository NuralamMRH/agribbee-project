import { Typography } from "@mui/material";
import React from "react";

const SurplusDailyAuctionDetails = (props) => {
  const {
    auction,
    auctionImageUrl,
    deleteWishlistItem,
    isInList,
    addToFavorite,
    imageUrl,
    handleBadge,
    auctionType,
    handleAuctionDetail,
    isInBid,
    isSellerDetails,
    hasBackGroundSection,
    width,
    className,
    contentHide,
  } = props;

  return (
    <div>
      <Typography
        fontSize="13px"
        fontWeight="500"
        maxWidth={{ xs: "120px", sm: "130px", md: "150px" }}
        noWrap
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: "bold",
        }}
        color={(theme) => theme.palette.neutral[1000]}
      >
        {auction?.name}
        {auction?.auction_type}
      </Typography>
    </div>
  );
};

export default SurplusDailyAuctionDetails;
