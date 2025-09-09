import CustomContainer from "@/components/container";

import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomShimmerCard from "@/components/customShimmerForProfile/CustomShimmerCard";
import { useTheme } from "@mui/styles";
import { t } from "i18next";
import Agribbe from "@/components/LogoText/Agribbe";
import CustomImageContainer from "@/components/CustomImageContainer";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { CustomButtonPrimary } from "@/styled-components/CustomButtons.style";

function SupplyChainSection() {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { global } = useSelector((state) => state.globalSettings);
  const home_image_path = global?.base_urls?.home_page_image_path;
  const banner_image = `${home_image_path}/${landingPageData?.response?.supply_chain_banner}`;
  // console.log(`Banner image ${banner_image}`);
  const theme = useTheme();
  return (
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <Grid
          container
          spacing={0}
          sx={{ my: 1, position: "relative" }}
          alignItems="start"
        >
          <Grid item xs={12} md={5} alignItems="start">
            <Typography
              fontSize={{ xs: "14px", md: "18px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.text.dark}
            >
              {landingPageData?.response?.supplyChainSectionTitle}
            </Typography>

            {landingPageData?.response?.supplyChainLeftContent?.length > 0 ? (
              <>
                {landingPageData?.response?.supplyChainLeftContent?.map(
                  (item) => (
                    <Grid
                      sx={{
                        my: 1,
                      }}
                      alignItems="start"
                    >
                      <Typography
                        fontSize={{ xs: "13px", md: "14px" }}
                        fontWeight={{ xs: "600", md: "700" }}
                        color={(theme) => theme.palette.primary.blue}
                      >
                        {item.topTagline}
                      </Typography>

                      <Typography
                        fontSize={{ xs: "11px", md: "12px" }}
                        fontWeight={{ xs: "500", md: "600" }}
                        color={(theme) => theme.palette.text.gray2}
                      >
                        {item.tagline}
                      </Typography>
                    </Grid>
                  )
                )}
              </>
            ) : (
              <CustomShimmerCard
                noSearchShimmer="true"
                itemCount="5"
                smItemCount="5"
              />
            )}
          </Grid>
          <Grid item xs={12} md={2} align="center">
            <Box
              sx={{
                position: { sm: "relative", md: "absolute" },
                top: "0px",
                zIndex: "14",
                left: "0",
                right: "0",
                bottom: "0",
              }}
            >
              <CustomImageContainer
                src={"static/homes/supply-chain.png"}
                height="330px"
                smHeight="340px"
                maxWidth={{ xs: "100%", md: "503px" }}
                borderRadius={"20px"}
                borderColor={"#F3F3F3"}
                borderWidth={"0px"}
                objectFit="contain"
                alt={t("supply chain banner")}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5} align="center">
            <CustomImageContainer
              src={banner_image}
              height="300px"
              smHeight="325px"
              maxWidth={{ xs: "100%", md: "503px" }}
              borderRadius={"20px"}
              borderColor={"#F3F3F3"}
              borderWidth={"0px"}
              objectFit="cover"
              alt={t("supply chain banner")}
            />
          </Grid>
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  );
}

export default SupplyChainSection;
