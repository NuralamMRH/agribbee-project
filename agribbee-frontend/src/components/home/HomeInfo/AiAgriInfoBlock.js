import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CustomContainer from "../../container";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import AiAgribbee from "../../LogoText/AiAgribbee";
import AgribbeeParagraph from "../../LogoText/AgribbeeParagraph";
import InfoSectionHeader from "./InfoSectionHeader";
import CustomShimmerCard from "../../customShimmerForProfile/CustomShimmerCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AiAgriInfoBlock = ({ global }) => {
  const { landingPageData } = useSelector((state) => state.storedData);

  const { t } = useTranslation();
  return (
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <Grid container spacing={2} sx={{ my: 1 }} alignItems="center">
          <Grid item xs={12} md={6} align="start">
            <Typography
              fontSize={{ xs: "16px", md: "24px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.primary.red}
            >
              {landingPageData?.response?.aiAuctionService?.topTagline}
            </Typography>
            <Typography
              fontSize={{ xs: "24px", md: "35px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.primary.blue}
            >
              <AiAgribbee
                text={landingPageData?.response?.aiAuctionService?.title}
                color={"#7BC043"}
              />
            </Typography>
            <Typography
              fontSize={{ xs: "12px", md: "14px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.text.gray}
            >
              <AgribbeeParagraph
                text={landingPageData?.response?.aiAuctionService?.description}
                color={"#0A75A0"}
              />
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} align="center">
            <Stack
              direction="row"
              width="100%"
              justifyContent="center"
              sx={{ paddingInline: "10px" }}
            >
              <Stack>
                <CustomImageContainer
                  src={`${global?.base_urls?.home_page_image_path}/${landingPageData?.response?.aiAuction_service_banner}`}
                  height="100%"
                  smHeight="325px"
                  maxWidth={{ xs: "100%", md: "503px" }}
                  borderRadius={"80px 0px"}
                  borderColor={"#F3F3F3"}
                  borderWidth={"15px"}
                  objectFit="cover"
                  alt={t("Ai-Agribbee")}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <InfoSectionHeader
          topText={landingPageData?.response?.efficiencyHeading?.topTagline}
          topTextColor={(theme) => theme.palette.text.primary}
          topTextFontSize={{ xs: "16px", md: "24px" }}
          topTextFontWidth={{ xs: "500", md: "600" }}
          bottomText={landingPageData?.response?.efficiencyHeading?.tagline}
          bottomTextColor={(theme) => theme.palette.primary.blue}
          bottomTextFontSize={{ xs: "24px", md: "32px" }}
          bottomTextFontWidth={{ xs: "600", md: "700" }}
        />
        <Grid container spacing={2} sx={{ my: 1 }} alignItems="start">
          <Grid item xs={12} md={6} align="center">
            <Stack
              direction="row"
              width="100%"
              justifyContent="center"
              sx={{ paddingInline: "10px" }}
            >
              <Stack>
                <CustomImageContainer
                  src={`${global?.base_urls?.home_page_image_path}/${landingPageData?.response?.market_service_banner}`}
                  height="100%"
                  smHeight="325px"
                  maxWidth={{ xs: "100%", md: "503px" }}
                  borderRadius={"80px 0px"}
                  borderColor={"#F3F3F3"}
                  borderWidth={"15px"}
                  objectFit="cover"
                  alt={t("Ai-Agribbee")}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} alignItems="start">
            <Typography
              fontSize={{ xs: "24px", md: "35px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={(theme) => theme.palette.text.dark}
            >
              {landingPageData?.response?.marketServiceKeys?.title}
            </Typography>

            {landingPageData?.response?.marketServiceKeys?.serviceKeys?.length >
            0 ? (
              <>
                {landingPageData?.response?.marketServiceKeys?.serviceKeys.map(
                  (item) => (
                    <Box sx={{ display: "flex", gap: "5px", margin: "20px 0" }}>
                      <CheckCircleIcon
                        sx={{
                          fontSize: { xs: "15px", md: "24px" },
                          color: (theme) => theme.palette.primary.blue,
                        }}
                      />
                      <Typography
                        key={item}
                        fontSize={{ xs: "12px", md: "16px" }}
                        fontWeight={{ xs: "500", md: "600" }}
                        color={(theme) => theme.palette.text.black}
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
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

export default AiAgriInfoBlock;
