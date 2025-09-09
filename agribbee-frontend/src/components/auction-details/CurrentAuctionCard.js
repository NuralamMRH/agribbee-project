import React, { useState } from "react"
import { CustomAuctionCard, CustomAuctionCardNew } from "./AuctionCard.style"
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import AuctionCardMedia from "./AuctionCardMedia"
import { Stack } from "@mui/system"
import { useTheme } from "@mui/material/styles"
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style"
import { useTranslation } from "react-i18next"
import AuctionRating from "./AuctionRating"
import { getAmount } from "@/utils/customFunctions"
import { AuctionCountdown } from "@/utils/AuctionCountdown"

const CurrentAuctionCard = (props) => {
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
  } = props

  const [isTransformed, setIstransformed] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation()
  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <CustomAuctionCardNew
      className={className}
      padding={contentHide ? "20px 8px 8px 8px" : ""}
      onClick={(e) => handleAuctionDetail(e)}
      onMouseEnter={() => setIstransformed(true)}
      onMouseDown={() => setIstransformed(true)}
      onMouseLeave={() => setIstransformed(false)}
      background={
        hasBackGroundSection === "true"
          ? theme.palette.background.gray2
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
            <Grid container sx={{ marginY: "5px", alignItems: "center" }}>
              <Grid item xs={6} md={6} marginTop="2px" marginBottom="2px">
                <Typography
                  fontSize="13px"
                  fontWeight="500"
                  maxWidth={{ xs: "120px", sm: "130px", md: "150px" }}
                  sx={{
                    overflow: "hidden",
                    fontWeight: "bold",
                  }}
                  color={theme.palette.neutral[1000]}
                >
                  {auction?.name}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} textAlign={"end"}>
                {auction?.ending_time && (
                  <Typography
                    fontSize={{ xs: "10px", md: "12px" }}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50px",
                      border: "0.5px solid red",
                      paddingX: "5px",
                      paddingY: "2px",
                      maxWidth: { xs: "120px", md: "120px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: "1",
                      textAlign: "center",
                    }}
                  >
                    <AuctionCountdown
                      auctionStartTime={auction?.starting_time}
                      auctionEndTime={auction?.ending_time}
                      isShowMinSec={true}
                    />
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Stack
              flexDirection="row"
              justifyContent="space-between"
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              <Stack gap="5px" marginTop="2px" marginBottom="2px">
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                >
                  Starting Bid
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.blue[200]}
                  fontWeight={"bold"}
                >
                  {getAmount(auction?.starting_bid_price, "left", "VND", 0)}{" "}
                  {auction?.package ? `/${auction?.package}` : " /Qty"}
                </Typography>
              </Stack>
              <Stack gap="5px" marginTop="2px" marginBottom="2px">
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                >
                  Current Price
                </Typography>
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  color={theme.palette.text.primary}
                  fontWeight={"bold"}
                >
                  {getAmount(auction?.current_bid_price, "left", "VND", 0)}{" "}
                  {auction?.package ? `/${auction?.package}` : " /Qty"}
                </Typography>
              </Stack>
            </Stack>

            <Box
              display={"flex"}
              flexDirection="row"
              flexWrap={"wrap"}
              gap="5px"
              marginTop="2px"
              marginBottom="2px"
            >
              {auction?.tags?.length > 0 ? (
                auction.tags.map((item) => (
                  <Typography
                    fontSize={{ xs: "10px", md: "11px" }}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "5px",
                      color: theme.palette.text.dark,
                      border: `1px solid ${theme.palette.blue[200]}`,
                      paddingX: "5px",
                      paddingY: "2px",
                      minWidth: { xs: "20px", md: "30px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: "1",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Typography>
                ))
              ) : (
                <Typography
                  fontSize={{ xs: "10px", md: "11px" }}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                    color: theme.palette.text.dark,
                    border: `1px solid ${theme.palette.blue[200]}`,
                    paddingX: "5px",
                    paddingY: "2px",
                    minWidth: { xs: "20px", md: "30px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: "1",
                    textAlign: "center",
                  }}
                >
                  {auction?.category?.name}
                </Typography>
              )}

              <Typography
                fontSize={{ xs: "10px", md: "11px" }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  color: theme.palette.text.dark,
                  border: `1px solid ${theme.palette.blue[200]}`,
                  paddingX: "5px",
                  paddingY: "2px",
                  minWidth: { xs: "20px", md: "30px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: "1",
                  textAlign: "center",
                }}
              >
                {auction?.warehouse
                  ? auction?.warehouse?.region?.name
                  : auction?.seller?.address?.region?.name}
              </Typography>
            </Box>

            <Stack marginTop={"10px"}>
              <Button
                onClick={(e) => handleAuctionDetail(e)}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  maxHeight: { xs: "25px", md: "30px" },

                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                    fontWeight: "600",
                    fontSize: { xs: "13px", md: "14px" },
                  }}
                >
                  Bid Now
                </Typography>
              </Button>
            </Stack>

            {/* </Stack> */}
          </CustomStackFullWidth>
        )}
      </CustomStackFullWidth>
    </CustomAuctionCardNew>
  )
}

export default CurrentAuctionCard
