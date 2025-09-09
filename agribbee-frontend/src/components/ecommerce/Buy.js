import React, { memo } from "react";
import EcommercePageSearch from "./EcommercePageSearch";
import CustomContainer from "../container";
import EcommerceProducts from "./EcommerceProducts";
import FeatureCatagories from "../home/featured-categories/FeatureCatagories";
import { useTheme } from "@emotion/react";

const Buy = () => {
  const theme = useTheme();
  return (
    <>
      <EcommercePageSearch />
      <CustomContainer>
        <EcommerceProducts />
      </CustomContainer>
      <FeatureCatagories
        mainBg={theme.palette.blue[200]}
        categoryBg={theme.palette.background.default}
      />
    </>
  );
};

export default memo(Buy);
