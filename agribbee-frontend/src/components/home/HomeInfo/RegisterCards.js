import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "@/components/CustomImageContainer";
import CustomContainer from "@/components/container";
import { useSelector } from "react-redux";
import { CustomButtonPrimary } from "@/styled-components/CustomButtons.style";

const RegisterCards = ({}) => {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { global } = useSelector((state) => state.globalSettings);
  const home_image_path = global?.base_urls?.home_page_image_path;
  const banner_bg = `${home_image_path}/${landingPageData?.response?.start_bidding_bg}`;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <CustomStackFullWidth
      sx={{
        backgroundImage: `url(${banner_bg})`,
        padding: { xs: "20px 0", md: "50px 0" },
        color: "white",
      }}
    >
      <CustomContainer>
        <Typography
          fontSize={"18px"}
          fontWeight={"700"}
          color={"white"}
          marginBottom={"10px"}
        >
          {landingPageData?.response?.startBiddingTitle}
        </Typography>

        <Grid container spacing={2}>
          {landingPageData?.response?.startBidding?.length > 0 &&
            landingPageData?.response?.startBidding.map((item) => (
              <Grid
                xs={12}
                md={6}
                alignItems="start"
                sx={{
                  my: 1,
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: "50px 20px",
                    backgroundColor: "rgba(0, 0, 0, 0.48)",
                    borderRadius: { xs: "15px", md: "20px" },
                    gap: "20px",
                  }}
                >
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    fontWeight={"bold"}
                  >
                    {item?.title}
                  </Typography>

                  <Typography
                    fontSize={{ xs: "12px", md: "12px" }}
                    fontWeight={"400"}
                    margin={"10px 0"}
                  >
                    {item?.description}
                  </Typography>

                  <Grid container>
                    {item?.buttons.map((btn, index) => (
                      <CustomButtonPrimary
                        borderRadius={"50px"}
                        margin={isXSmall ? "20px 0px" : "10px 10px"}
                        paddingLeft={isXSmall ? "10px" : "10px"}
                        paddingRight={isXSmall ? "10px" : "10px"}
                        paddingTop={isXSmall ? "8px" : "10px"}
                        paddingBottom={isXSmall ? "8px" : "10px"}
                        maxWidth={
                          !isXSmall && index === 0
                            ? "160px"
                            : !isXSmall
                              ? "220px"
                              : "100%"
                        }
                        bg={index != 0 && "#fff"}
                        textColor={index != 0 && theme.palette.text.dark}
                      >
                        {btn.btnName}
                      </CustomButtonPrimary>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            ))}
        </Grid>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default RegisterCards;
