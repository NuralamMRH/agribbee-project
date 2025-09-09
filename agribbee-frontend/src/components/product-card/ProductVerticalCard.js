import React, { memo, useState } from "react";
import { CustomProductCardNew } from "./ProductCard.style";
import { Typography, useMediaQuery } from "@mui/material";
import ProductCardMedia from "./ProductCardMedia";
import { Stack } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

import { t } from "i18next";
import { getAmount } from "@/utils/customFunctions";

const ProductVerticalCard = (props) => {
  const {
    product,
    setOpenModal,
    productImageUrl,
    handleProductDetailModal,
    deleteWishlistItem,
    isInList,
    addToFavorite,
    imageUrl,
    handleBadge,
    addToCart,
    isInCart,
    getQuantity,
    incrOpen,
    setIncrOpen,
    handleClickQuantityButton,
    hasBackGroundSection,
    isRestaurantDetails,
    horizontal,
  } = props;

  const [isTransformed, setIstransformed] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <CustomProductCardNew
      maxwidth="250px"
      onClick={(e) => handleProductDetailModal(e)}
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
        <ProductCardMedia
          id={product?._id}
          onClick={handleProductDetailModal}
          available_time_starts={product?.available_time_starts}
          available_time_ends={product?.available_time_ends}
          available_date_ends={product?.available_date_ends}
          imageUrl={imageUrl}
          alt={product?.name}
          addToFavorite={addToFavorite}
          isInList={isInList}
          deleteWishlistItem={deleteWishlistItem}
          handleBadge={handleBadge}
          product={product}
          isInCart={isInCart}
          getQuantity={getQuantity}
          setIncrOpen={setIncrOpen}
          handleClickQuantityButton={handleClickQuantityButton}
          addToCart={addToCart}
          isTransformed={isTransformed}
          incrOpen={incrOpen}
          isRestaurantDetails={isRestaurantDetails}
          rating_count={product?.rating_count}
          horizontal={horizontal}
        />
        <CustomStackFullWidth sx={{ padding: "5px" }}>
          <Stack gap="20px" sx={{ position: "relative" }}>
            <Stack flexDirection="row" alignItems="center" gap="5px">
              <Typography
                fontSize="13px"
                fontWeight="500"
                maxWidth={{ xs: "120px", sm: "130px", md: "150px" }}
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                color={theme.palette.neutral[1200]}
              >
                {product?.name}
              </Typography>
              {/* <Typography fontSize={{ xs: "13px", sm: "14px", md: "15px" }} fontWeight={500} whiteSpace="nowrap">
                                {product?.name.length > 13 ? `${product?.name.slice(0, 13)}... ` : product?.name}
                            </Typography> */}
            </Stack>
            <Stack>
              <Typography
                fontSize={{ xs: "14px", md: "16px" }}
                color={theme.palette.primary.main}
                fontWeight={"bold"}
              >
                {getAmount(product?.price, "left", "₫", 0)}
              </Typography>
            </Stack>
          </Stack>

          {/* </Stack> */}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    </CustomProductCardNew>
  );
};

export default memo(ProductVerticalCard);
