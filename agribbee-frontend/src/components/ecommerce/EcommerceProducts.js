import { useGetCategories } from "@/hooks/react-query/all-categiry/useGetCategory";
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import CustomShimmerCard from "../customShimmerForProfile/CustomShimmerCard";
import ProductsCarousel from "./ProductsCarousel";

const EcommerceProducts = () => {
  const [categories, setCategories] = useState([]);

  const handleRequestOnSuccess = (res) => {
    // console.log("Loading categories", res.data.response);
    setCategories(res.data.response);
  };
  const { data, refetch, isLoading } = useGetCategories(handleRequestOnSuccess);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Stack paddingY={"20px"}>
      {categories?.length > 0 ? (
        <Stack>
          {categories.map((cat, index) => (
            <Stack key={index} spacing={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "22px" },
                    fontWeight: "bold",
                    color: (theme) => theme.palette.blue[200],
                  }}
                >
                  {cat?.name}
                </Typography>
              </Box>

              <ProductsCarousel
                products={cat?.products}
                isLoading={isLoading}
              />

              {/* Add your product list here */}
            </Stack>
          ))}
        </Stack>
      ) : isLoading ? (
        <CustomShimmerCard
          noSearchShimmer="true"
          itemCount="9"
          smItemCount="9"
        />
      ) : (
        <Typography variant="h6">{t("No any categories available")}</Typography>
      )}
    </Stack>
  );
};

export default EcommerceProducts;
