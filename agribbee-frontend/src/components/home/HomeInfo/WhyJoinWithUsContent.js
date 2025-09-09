import CustomContainer from "@/components/container";

import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomShimmerCard from "@/components/customShimmerForProfile/CustomShimmerCard";
import InfoSectionHeader from "./InfoSectionHeader";
import { useTheme } from "@mui/styles";
import { t } from "i18next";
import Agribbe from "@/components/LogoText/Agribbe";
import CustomImageContainer from "@/components/CustomImageContainer";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { CustomButtonPrimary } from "@/styled-components/CustomButtons.style";

function WhyJoinWithUsContent() {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { global } = useSelector((state) => state.globalSettings);
  const home_image_path = global?.base_urls?.home_page_image_path;
  const banner_image = `${home_image_path}/${landingPageData?.response?.why_join_with_us_banner}`;
  // console.log(`Banner image ${banner_image}`);
  const theme = useTheme();
  return (
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <InfoSectionHeader
          bottomText={landingPageData?.response?.whyJoinUsTitle}
          bottomTextColor={(theme) => theme.palette.primary.blue}
          bottomTextFontSize={{ xs: "14px", md: "22px" }}
          bottomTextFontWidth={{ xs: "600", md: "700" }}
        />

        <Grid container spacing={2} sx={{ my: 1 }} alignItems="start">
          <Grid item xs={12} md={6} alignItems="start">
            <Typography
              fontSize={{ xs: "14px", md: "18px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.text.dark}
            >
              <Agribbe
                text={landingPageData?.response?.whyJoinWithUsContent?.title}
                color={theme.palette.primary.green}
                afterBColor={theme.palette.primary.blue}
                beforeBColor={theme.palette.primary.blue}
                lastEColor={theme.palette.primary.blue}
              />
            </Typography>

            {landingPageData?.response?.whyJoinWithUsContent?.serviceKeys
              ?.length > 0 ? (
              <>
                {landingPageData?.response?.whyJoinWithUsContent?.serviceKeys.map(
                  (item) => (
                    <Box sx={{ display: "flex", gap: "5px", margin: "20px 0" }}>
                      <CheckCircleIcon
                        sx={{
                          fontSize: { xs: "12px", md: "16px" },
                          color: (theme) => theme.palette.primary.blue,
                        }}
                      />
                      <Typography
                        key={item}
                        fontSize={{ xs: "10px", md: "12px" }}
                        fontWeight={{ xs: "400", md: "500" }}
                        color={(theme) => theme.palette.text.secondary}
                      >
                        {item}
                      </Typography>
                    </Box>
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
          <Grid item xs={12} md={6} align="center">
            <CustomImageContainer
              src={banner_image}
              height="300px"
              smHeight="325px"
              maxWidth={{ xs: "100%", md: "503px" }}
              borderRadius={"0px 0px"}
              borderColor={"#F3F3F3"}
              borderWidth={"0px"}
              objectFit="cover"
              alt={t("Why Agribbee banner")}
            />
          </Grid>
        </Grid>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        sx={{
          marginBottom: "30px",
          marginTop: "20px",
          padding: { xs: "10px", md: "0px" },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            backgroundColor: (theme) => theme.palette.background.blue,
            borderRadius: { xs: "10px", md: "50px" },
            padding: { xs: "10px", md: "10px 0px" },
            alignItems: "center",
          }}
        >
          <Grid
            xs={12}
            md={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", md: "left" },
              paddingLeft: { xs: "0px", md: "30px" },
              marginBottom: { xs: "10px", md: "0px" },
            }}
          >
            <Typography
              fontSize={{ xs: "14px", md: "18px" }}
              fontWeight={{ xs: "500", md: "700" }}
              textAlign={{ xs: "center", md: "left" }}
              color={"#fff"}
            >
              {landingPageData?.response?.wholesaleRegisterBtnTitle}
            </Typography>
          </Grid>
          <Grid xs={12} md={2} align="center">
            <CustomButtonPrimary
              borderRadius={"50px"}
              paddingTop={{ xs: "8px", md: "10px" }}
              paddingBottom={{ xs: "8px", md: "10px" }}
            >
              {t("ĐĂNGKÝ NGAY")}
            </CustomButtonPrimary>
          </Grid>
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  );
}

export default WhyJoinWithUsContent;
