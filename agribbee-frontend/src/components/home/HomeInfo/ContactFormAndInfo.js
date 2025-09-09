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
import ContactForm from "@/components/contact/ContactForm";

export const ContactFormAndInfo = () => {
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
        backgroundColor: (theme) => theme.palette.background.default,
        padding: { xs: "20px 0", md: "50px 0" },
      }}
    >
      <CustomContainer>
        <Grid container spacing={2}>
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
                {landingPageData?.response?.contactSectionTitle}
              </Typography>

              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontSize={{ xs: "12px", md: "12px" }}
                    fontWeight={"400"}
                    margin={"10px 0"}
                  >
                    {landingPageData?.response?.contactSectionDesc?.partOne}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontSize={{ xs: "12px", md: "12px" }}
                    fontWeight={"400"}
                    margin={"10px 0"}
                  >
                    {landingPageData?.response?.contactSectionDesc?.partTwo}
                  </Typography>
                </Box>
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
              <Typography
                fontSize={{ xs: "12px", md: "14px" }}
                fontWeight={"bold"}
              >
                {t("Contact Information")}
              </Typography>

              <ContactForm />
            </Box>
          </Grid>
        </Grid>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};
