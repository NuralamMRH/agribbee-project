import React, { useState } from "react";
import { CustomAuctionCard, CustomAuctionCardNew } from "./AuctionCard.style";
import {
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AuctionCardMedia from "./AuctionCardMedia";
import { Stack } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import AuctionRating from "./AuctionRating";
import { getAmount } from "@/utils/customFunctions";
import { AuctionCountdown } from "@/utils/AuctionCountdown";

const HomePageAuctionCard = (props) => {
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

  const [isTransformed, setIstransformed] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <CustomAuctionCardNew
      maxwidth={width || "250px"}
      width={width || "250px"}
      className={className}
      padding={contentHide ? "20px 8px 8px 8px" : ""}
      onClick={(e) => handleAuctionDetail(e)}
      onMouseEnter={() => setIstransformed(true)}
      onMouseDown={() => setIstransformed(true)}
      onMouseLeave={() => setIstransformed(false)}
      background={
        hasBackGroundSection === "true"
          ? theme.palette.cardBackground1
          : theme.palette.cardBackground2
      }
    >
      <CustomStackFullWidth>
        <AuctionCardMedia
          id={auction?.id}
          onClick={handleAuctionDetail}
          available_time_starts={auction?.starting_time}
          available_time_ends={auction?.ending_time}
          available_date_ends={auction?.ending_time}
          imageUrl={imageUrl}
          alt={auction?.name}
          addToFavorite={addToFavorite}
          isInList={isInList}
          deleteWishlistItem={deleteWishlistItem}
          handleBadge={handleBadge}
          auction={auction}
          isInBid={isInBid}
          isTransformed={isTransformed}
          rating_count={auction?.rating_count}
          auctionType={auctionType}
          contentHide={contentHide}
        />
        {!contentHide && (
          <CustomStackFullWidth sx={{ padding: "5px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap="5px"
              sx={{ position: "relative" }}
            >
              <Stack flexDirection="row" alignItems="center" gap="5px">
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
                  color={theme.palette.neutral[1000]}
                >
                  {auction?.name}
                </Typography>
                {/* <Typography fontSize={{ xs: "13px", sm: "14px", md: "15px" }} fontWeight={500} whiteSpace="nowrap">
                                {auction?.name.length > 13 ? `${auction?.name.slice(0, 13)}... ` : auction?.name}
                            </Typography> */}
              </Stack>
            </Stack>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.primary.main}
                  fontWeight={"bold"}
                >
                  {getAmount(auction?.starting_bid_price, "left", "VND", 0)}{" "}
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  textTransform={"capitalize"}
                >
                  {auction?.bid_by === "quantity"
                    ? "Qty"
                    : auction?.bid_by === "weight"
                      ? auction?.weight_unit_name
                      : auction?.bid_by}
                </Typography>
              </Stack>
              <Stack>
                <Typography fontSize={{ xs: "12px", md: "14px" }}>
                  <AuctionCountdown
                    auctionStartTime={auction?.starting_time}
                    auctionEndTime={auction?.ending_time}
                    isHelpText={true}
                  />
                </Typography>
              </Stack>
            </Stack>
            <Stack
              flexDirection="row"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.green}
                  fontWeight={"bold"}
                >
                  {getAmount(auction?.current_bid_price, "left", "VND", 0)}{" "}
                </Typography>
                <Typography fontSize={{ xs: "12px", md: "14px" }}>
                  {`${auction?.bids_count} ${t("Bids")} - ${t("Current Bid")}`}
                </Typography>
              </Stack>
            </Stack>

            {auction?.min_bid_price > 0 && (
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Stack
                  flexDirection="row"
                  gap="5px"
                  marginTop="2px"
                  marginBottom="2px"
                >
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    color={theme.palette.text.primary}
                  >
                    {getAmount(auction?.min_bid_price, "left", "VND", 0)}{" "}
                  </Typography>
                  <Typography fontSize={{ xs: "12px", md: "14px" }}>
                    {`${auction?.bids_count} ${t("Bids")} - ${t("Min Bid")}`}
                  </Typography>
                </Stack>
              </Stack>
            )}

            <Stack
              flexDirection="row"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                >
                  {auction?.auction_type === "live_auction"
                    ? t("Live Auction")
                    : auction?.auction_type === "surplus_auction"
                      ? t("Surplus Auction")
                      : auction?.auction_type === "future_delivery"
                        ? t("Future Delivery Auction")
                        : auction?.auction_type === "catch_auction"
                          ? t("Daily Catch Auction")
                          : t("Normal Auction")}
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.gray}
                >
                  {`: ${t("Status")}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              flexDirection="row"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                >
                  {`${auction?.selling_quantity} ${auction?.weight_unit_name}`}
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.gray}
                >
                  {`: ${t("Quantity")}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              flexDirection="row"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                >
                  {`${
                    auction?.quantity_left
                      ? auction?.quantity_left
                      : auction?.selling_quantity
                  } ${auction?.weight_unit_name}`}
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.gray}
                >
                  {`: ${t("Available for bidding")}`}
                </Typography>
              </Stack>
            </Stack>

            {auction?.introduction && (
              <Stack
                flexDirection="row"
                gap="5px"
                marginTop="2px"
                marginBottom="2px"
              >
                <Stack
                  flexDirection="row"
                  gap="5px"
                  marginTop="2px"
                  marginBottom="2px"
                >
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
                    color={theme.palette.neutral[1000]}
                  >
                    {auction?.introduction}
                  </Typography>
                </Stack>
              </Stack>
            )}

            {/* </Stack> */}
          </CustomStackFullWidth>
        )}
      </CustomStackFullWidth>
    </CustomAuctionCardNew>
  );
};

export default HomePageAuctionCard;
