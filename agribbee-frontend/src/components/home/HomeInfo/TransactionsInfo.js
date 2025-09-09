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
import InfoSectionHeader from "./InfoSectionHeader";
import { t } from "i18next";

const InternationalTransactionsInfo = ({}) => {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { global } = useSelector((state) => state.globalSettings);
  const home_image_path = global?.base_urls?.home_page_image_path;
  const banner_bg = `${home_image_path}/${landingPageData?.response?.international_transaction_banner}`;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <CustomStackFullWidth
      sx={{
        backgroundColor: (theme) => theme.palette.background.gray,
        padding: { xs: "20px 0", md: "50px 0" },
      }}
    >
      <CustomContainer>
        <Grid
          container
          spacing={2}
          sx={{
            padding: { xs: "0px 10px", md: "0px 100px" },
          }}
        >
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
                backgroundColor: (theme) => theme.palette.background.default,
                borderRadius: { xs: "15px", md: "20px" },
                gap: "20px",
                height: "100%",
              }}
            >
              <Typography
                fontSize={{ xs: "12px", md: "14px" }}
                fontWeight={"bold"}
              >
                {landingPageData?.response?.internationalTransactions?.title}
              </Typography>

              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                {landingPageData?.response?.internationalTransactions?.keys.map(
                  (item, index) => (
                    <Box
                      sx={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.customColor.green,
                          padding: { xs: "10px", md: "15px" },
                          borderRadius: "100px",
                          marginRight: "10px",
                          width: { xs: "30px", md: "40px" },
                          height: { xs: "30px", md: "40px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: { xs: "16px", md: "18px" },
                          color: (theme) => theme.palette.customColor.black,
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography
                        key={index}
                        fontSize={{ xs: "12px", md: "12px" }}
                        fontWeight={"400"}
                        margin={"10px 0"}
                      >
                        {" "}
                        {item}
                      </Typography>
                    </Box>
                  )
                )}
              </Grid>
            </Box>
          </Grid>
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
                backgroundColor: (theme) => theme.palette.background.default,
                borderRadius: { xs: "15px", md: "20px" },
                gap: "20px",
              }}
            >
              <CustomImageContainer
                src={banner_bg}
                height="200px"
                smHeight="150px"
                maxWidth={{ xs: "100%", md: "100%" }}
                borderRadius={"0px"}
                borderWidth={"0px"}
                objectFit="cover"
                alt={t("International transaction banner")}
              />
              <InfoSectionHeader
                topText={
                  landingPageData?.response?.internationalTransactions
                    ?.connectingWorldTitle
                }
                bottomText={
                  landingPageData?.response?.internationalTransactions
                    ?.connectingWorldDesc
                }
                flex={"flex"}
                justifyX={"flex-start"}
                alignX={"flex-start"}
                topTextFontWidth={"700"}
              />
            </Box>
          </Grid>
        </Grid>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default InternationalTransactionsInfo;
