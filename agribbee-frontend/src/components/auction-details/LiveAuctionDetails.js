import { Typography, useMediaQuery } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const LiveAuctionDetails = (props) => {
  const {
    auction,
    isInList,
    addToFavorite,
    deleteWishlistItem,
    handleSubmitAuction,
    isSellerDetails,
  } = props

  const [isTransformed, setIstransformed] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation()
  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"))

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
        color={theme.palette.neutral[1000]}
      >
        {auction?.name}
      </Typography>
    </div>
  )
}

export default LiveAuctionDetails
