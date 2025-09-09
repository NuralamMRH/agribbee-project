import CustomContainer from "@/components/container";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomShimmerCard from "@/components/customShimmerForProfile/CustomShimmerCard";
import InfoSectionHeader from "./InfoSectionHeader";
import { useTheme } from "@mui/styles";

function HowToTradeContent() {
  const { landingPageData } = useSelector((state) => state.storedData);
  const theme = useTheme();
  return (
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <InfoSectionHeader
          topText={landingPageData?.response?.howToTradeHeading?.topTagline}
          topTextColor={(theme) => theme.palette.text.primary}
          topTextFontSize={{ xs: "16px", md: "24px" }}
          topTextFontWidth={{ xs: "500", md: "600" }}
          bottomText={landingPageData?.response?.howToTradeHeading?.tagline}
          bottomTextColor={(theme) => theme.palette.primary.blue}
          bottomTextFontSize={{ xs: "24px", md: "32px" }}
          bottomTextFontWidth={{ xs: "600", md: "700" }}
        />
        <Grid
          container
          spacing={0}
          sx={{ my: 1 }}
          alignItems="start"
          justifyContent="center"
        >
          {landingPageData?.response?.howToTradeContent?.length > 0 &&
            landingPageData?.response?.howToTradeContent.map((ul) => (
              <Grid item xs={12} md={4} alignItems="start">
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.gray,
                    padding: { xs: "10px", md: "15px" },
                    borderRadius: { xs: "10px", md: "15px" },
                    margin: { xs: "5px", md: "10px" },
                    minHeight: { xs: "100%", md: "259px" },
                  }}
                >
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    fontWeight={{ xs: "500", md: "700" }}
                    color={(theme) => theme.palette.text.blue}
                  >
                    {ul.title}
                  </Typography>

                  {ul?.serviceKeys?.length > 0 ? (
                    <>
                      {ul?.serviceKeys.map((item) => (
                        <Box
                          sx={{ display: "flex", gap: "5px", margin: "20px 0" }}
                        >
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
                      ))}
                    </>
                  ) : (
                    <CustomShimmerCard
                      noSearchShimmer="true"
                      itemCount="5"
                      smItemCount="5"
                    />
                  )}
                </Box>
              </Grid>
            ))}
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  );
}

export default HowToTradeContent;
