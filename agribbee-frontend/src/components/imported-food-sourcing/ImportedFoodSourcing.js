import React, { memo } from "react";
import CustomContainer from "../container";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import styled from "styled-components";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoneIcon from "@mui/icons-material/Done";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import banner_bg from "../../../public/static/banners/ocopproductsection@3x.png";

import amex_logo from "../../../public/static/logos/Clip path group.png";
import amexVietLogo from "../../../public/static/logos/amexVietLogo.png";

import market from "../../../public/static/banners/banner-grid/market.png";
import lab from "../../../public/static/banners/banner-grid/lab.png";
import prCampaign from "../../../public/static/banners/banner-grid/prCampaign.png";
import american from "../../../public/static/banners/banner-grid/american.png";
import amexvietbg from "../../../public/static/banners/banner-grid/amexvietbg.png";
import presentation from "../../../public/static/banners/banner-grid/presentation.png";
import additionalFeature from "../../../public/static/banners/banner-grid/additionalFeature.png";
import building from "../../../public/static/banners/banner-grid/building.png";
import marketGirl from "../../../public/static/banners/banner-grid/marketGirl.png";
import soterGirl from "../../../public/static/banners/banner-grid/soterGirl.png";
import terminal from "../../../public/static/banners/banner-grid/terminal.png";
import marketing from "../../../public/static/banners/banner-grid/marketing.png";
import callGirl from "../../../public/static/banners/banner-grid/callGirl.png";
import car from "../../../public/static/icons/car.svg";
import catalog from "../../../public/static/icons/catalog.svg";
import support from "../../../public/static/icons/support.svg";
import note from "../../../public/static/icons/note.svg";
import settings from "../../../public/static/icons/settings.svg";
import computer from "../../../public/static/icons/computer.svg";
import goldMember from "../../../public/static/icons/goldMember.png";

import organizationData from "./directoryOrganization.json";

// console.log(organizationData);

import { t } from "i18next";
import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import RestaurantJoin from "../join-restaurant/RestaurantJoin";
import { CustomButton } from "../custom-cards/CustomCards.style";
import OrganizationDataRow from "./OrganizationDataRow";
import { Language, LocationOn, Phone, Web } from "@mui/icons-material";
import ContactForm from "../contact/ContactForm";
import FeatureCatagories from "../home/featured-categories/FeatureCatagories";

// console.log("Logo ", banner_bg);

const ImportedFoodSourcing = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const Agribbe = styled.span`
    color: ${theme.palette.blue[200]};
  `;
  const Paragraph = styled.span`
    color: ${theme.palette.neutral[900]};
  `;
  const AfterB = styled.span``;
  return (
    <>
      <CustomContainer>
        <CustomStackFullWidth
          sx={{
            backgroundImage: `url(${banner_bg.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginTop: { xs: "80px", md: "80px" },
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <CustomStackFullWidth
            sx={{
              backgroundColor: theme.palette.blue[100],
              padding: { xs: "20px 0", md: "50px 0" },
              minHeight: "250px",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <Grid
              item
              container
              sx={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CustomImageContainer
                src={amex_logo.src}
                maxWidth={{ xs: "50px", md: "100px" }}
                objectFit={"contain"}
              />
              <Stack
                sx={{
                  paddingX: { xs: "20px", md: "200px" },
                  marginTop: "20px",
                }}
              >
                <Typography
                  color={theme.palette.blue[200]}
                  fontWeight={"bold"}
                  fontSize={{ xs: "20px", md: "25px" }}
                  textAlign={"center"}
                >
                  {t(
                    "AgriBbee Digital Tool helps you to publish your  organization’s website on our Agriculture Portal  in minutes"
                  )}
                </Typography>
              </Stack>
            </Grid>
          </CustomStackFullWidth>
        </CustomStackFullWidth>

        <Stack
          sx={{
            marginTop: { xs: "10px", md: "20px" },
            paddingX: { xs: "10px", md: "100px" },
          }}
        >
          <Stack sx={{ display: "flex", justifyContent: "flex-start" }}>
            <ButtonGroup aria-label="Basic button group">
              <Button
                sx={{
                  backgroundColor: theme.palette.blue[200],
                  color: theme.palette.text.white,
                  fontWeight: "bold",
                  border: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.blue[200], // Change background color on hover
                    color: theme.palette.text.white, // Change text color on hover
                    border: "none",
                  },
                }}
              >
                {t("About Amex2VietFood")}
              </Button>
              <Button
                sx={{
                  backgroundColor: theme.palette.blue[100],
                  color: theme.palette.blue[200],
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: theme.palette.blue[100],
                    color: theme.palette.blue[200],
                    border: "none",
                  },
                  border: "none",
                }}
              >
                {t("Digital Tool Dashboard")}
              </Button>
            </ButtonGroup>
          </Stack>

          <Grid
            container
            marginY={{ xs: "20px", md: "25px" }}
            sx={{ alignItems: "center" }}
          >
            <Grid item xs={12} md={6}>
              <Grid
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "18px", md: "25px" },
                  marginBottom: { xs: "18px", md: "0px" },
                }}
              >
                <Agribbe>{"AI-Powered AgriBee"}</Agribbe>
                <Paragraph>
                  {t(
                    ` platform enables your organization reach Vietnamese Retailers,  WholeSales and Food  Importers.`
                  )}
                </Paragraph>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: "flex-end",
                },
              }}
            >
              <Stack position={"relative"}>
                <Stack
                  sx={{
                    backgroundColor: theme.palette.blue[100],
                    width: { xs: "200px", md: "250px" },
                    height: { xs: "200px", md: "250px" },
                    position: "absolute",
                    top: "0",
                    right: "-20px",
                    borderRadius: "100%",
                    zIndex: "0",
                    opacity: 1,
                  }}
                ></Stack>
                <CustomImageContainer
                  src={market.src}
                  maxWidth={{ xs: "200px", md: "250px" }}
                  objectFit={"contain"}
                  borderRadius={"100%"}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            marginY={{ xs: "40px", md: "50px" }}
            sx={{
              flexWrap: { xs: "wrap-reverse", md: "unset" },
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <Stack position={"relative"}>
                <Stack
                  sx={{
                    backgroundColor: theme.palette.blue[100],
                    width: { xs: "200px", md: "250px" },
                    height: { xs: "200px", md: "250px" },
                    position: "absolute",
                    top: "0",
                    left: "-20px",
                    borderRadius: "100%",
                    zIndex: "0",
                    opacity: 1,
                  }}
                ></Stack>
                <CustomImageContainer
                  src={lab.src}
                  maxWidth={{ xs: "200px", md: "250px" }}
                  objectFit={"contain"}
                  borderRadius={"100%"}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "18px", md: "25px" },
                  marginBottom: { xs: "18px", md: "0px" },
                }}
              >
                <Agribbe>{"AI-AgriBee"}</Agribbe>
                <Paragraph>
                  {t(
                    ` Import Sourcing Network is developing by Scientists graduated from Cornell University, USA.`
                  )}
                </Paragraph>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
        <CustomStackFullWidth
          sx={{
            marginTop: { xs: "80px", md: "80px" },
            borderRadius: "10px",
            overflow: "hidden",
            minHeight: { xs: "200px", md: "250px" },
            justifyContent: "center",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <Stack
            sx={{
              backgroundImage: `url(${prCampaign.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0",
              right: "0px",
              zIndex: "0",
              filter: "blur(2px)",
            }}
          ></Stack>
          <Stack
            sx={{
              padding: { xs: "20px", md: "50px" },
              width: { xs: "100%", md: "300px" },
              zIndex: "1",
            }}
          >
            <Typography color={theme.palette.text.white} fontWeight={"bold"}>
              {t(
                "PR Campaign American Food Quality and Safety Standard for Vietnam consumers."
              )}
            </Typography>
          </Stack>
        </CustomStackFullWidth>

        <Stack
          sx={{
            marginTop: { xs: "10px", md: "20px" },
            paddingX: { xs: "10px", md: "100px" },
          }}
        >
          <Grid
            container
            marginY={{ xs: "40px", md: "50px" }}
            sx={{
              flexWrap: { xs: "wrap-reverse", md: "unset" },
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <Stack position={"relative"}>
                <Stack
                  sx={{
                    backgroundColor: theme.palette.blue[100],
                    width: { xs: "200px", md: "250px" },
                    height: { xs: "200px", md: "250px" },
                    position: "absolute",
                    top: "0",
                    left: "-20px",
                    borderRadius: "100%",
                    zIndex: "0",
                    opacity: 1,
                  }}
                ></Stack>
                <CustomImageContainer
                  src={lab.src}
                  maxWidth={{ xs: "200px", md: "250px" }}
                  objectFit={"contain"}
                  borderRadius={"100%"}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "18px", md: "25px" },
                  marginBottom: { xs: "18px", md: "0px" },
                }}
              >
                <Paragraph>{t(`Agri-Platform for `)}</Paragraph>
                <Agribbe>{"American Organizations "}</Agribbe>
                <Paragraph>
                  {t(`to connect directly with Vietnam  WholeSales Markets.`)}
                </Paragraph>
              </Grid>
            </Grid>
          </Grid>
        </Stack>

        <CustomStackFullWidth
          sx={{
            marginTop: { xs: "80px", md: "80px" },
            borderRadius: "10px",
            overflow: "hidden",
            minHeight: { xs: "200px", md: "250px" },
            justifyContent: "center",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <Stack
            sx={{
              backgroundImage: `url(${american.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0",
              right: "0px",
              zIndex: "0",
              filter: "blur(0px)",
            }}
          ></Stack>
          <Stack
            sx={{
              padding: { xs: "20px", md: "50px" },
              width: { xs: "100%", md: "40%" },
              zIndex: "1",
            }}
          >
            <Typography color={theme.palette.text.white} fontWeight={"bold"}>
              {t(
                "Our AIProcurement is filling up with  Purchase Orders to import AmericanBeef, Fruits, Soy Bean and Wheat."
              )}
            </Typography>
          </Stack>
        </CustomStackFullWidth>

        <Stack
          sx={{
            marginTop: { xs: "10px", md: "20px" },
            paddingX: { xs: "10px", md: "100px" },
          }}
        >
          <Stack
            sx={{
              backgroundImage: `url(${amexvietbg.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginTop: { xs: "80px", md: "80px" },
              borderRadius: "10px",
              minHeight: { xs: "400px", md: "500px" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                maxWidth: { xs: "80px", md: "100px" },
                maxHeight: { xs: "80px", md: "100px" },
                borderRadius: "100%",
                overflow: "hidden",
                background: theme.palette.background.default,
                position: "absolute",
                top: "0px",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "166",
              }}
            >
              <CustomImageContainer
                src={amexVietLogo.src}
                objectFit={"contain"}
              />
            </Box>
            <Box
              sx={{
                padding: { xs: "10px", md: "10px 15px" },
                width: { xs: "70%", md: "270px" },
                background: theme.palette.background.default,
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: "1",
                gap: "10px",
              }}
            >
              <Typography
                color={theme.palette.primary.main}
                fontWeight={"bold"}
                textTransform="uppercase"
              >
                {t("Get Brand")}
              </Typography>
              <Typography
                color={theme.palette.blue[200]}
                fontWeight={"bold"}
                textTransform="uppercase"
              >
                {t("Recognition")}
              </Typography>
            </Box>

            <Box
              marginY="10px"
              sx={{
                padding: { xs: "10px", md: "10px 15px" },
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color={theme.palette.text.white} textAlign={"center"}>
                {t(
                  "Build up online identity to enhance your vietnam market presence"
                )}
              </Typography>
            </Box>
            <Box
              marginY="10px"
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: "1",
                gap: "10px",
              }}
            >
              <Typography
                color={theme.palette.text.white}
                fontSize={{ xs: "18px", md: "25px" }}
              >
                {t("Amex2VietFood B2B ")}
              </Typography>
              <Typography
                color={theme.palette.text.white}
                fontWeight={"bold"}
                fontSize={{ xs: "18px", md: "25px" }}
              >
                {t("Premium Services")}
              </Typography>
            </Box>
            <Box
              marginY="10px"
              sx={{
                padding: { xs: "10px", md: "10px 15px" },
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                color={theme.palette.text.white}
                fontSize={{ xs: "11px", md: "12px" }}
                textAlign={"center"}
              >
                {t(
                  " Connecting Amex suppliers and vietnam wholesale buyers to execute business smartly"
                )}
              </Typography>
            </Box>
            <Stack>
              <Button
                variant={"contained"}
                color={theme.palette.text.default}
                background={theme.palette.primary.main}
                size={"small"}
                onClick={() => {
                  history.push("/packages");
                }}
              >
                {t("Package Details")}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <CustomStackFullWidth>
          <Box
            marginY="20px"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography color={theme.palette.text.default} fontWeight={"bold"}>
              Platinum Membership
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",

                  zIndex: "1",
                  gap: "10px",
                }}
              >
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "18px", md: "20px" }}
                >
                  {t("Platinum")}
                </Typography>
                <Typography
                  color={theme.palette.text.default}
                  fontWeight={"bold"}
                  fontSize={{ xs: "18px", md: "20px" }}
                >
                  {t("Service")}
                </Typography>
              </Box>
              <Typography
                color={theme.palette.neutral[800]}
                fontSize={{ xs: "12px", md: "13px" }}
              >
                {t(
                  "AI Tools to reach out and market directly to Vietnam retailers,  wholesalers, distributors and importers:"
                )}
              </Typography>
              <Stack marginTop={"10px"}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "15px", md: "24px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[900]}
                  >
                    {t(
                      "Digital Services to publish your product catalog and provide Online  Auctions and Sales Distribution."
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "15px", md: "24px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[900]}
                  >
                    {t(
                      "Target Marketing directly to Vietnam Food Distribution Network."
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "15px", md: "24px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[900]}
                  >
                    {t(
                      "Leverage AgriBbee Cold Storage Fullfilment Centers in Vietnam for  your American frozen foods.  "
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "15px", md: "24px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[900]}
                  >
                    {t(
                      "AgriBbee low cost local shipping and central warehouse for your export  container.  "
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "15px", md: "24px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[900]}
                  >
                    {t(
                      "Resolve any cross-border eSourcing issues you encounter when  exporting goods to Vietnam."
                    )}
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Button
                  variant={"contained"}
                  color={theme.palette.text.default}
                  background={theme.palette.primary.main}
                  size={"small"}
                  onClick={() => {
                    history.push("/live-chat");
                  }}
                >
                  {t("Live Chat")}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomStackFullWidth
                sx={{
                  background: (theme) => theme.palette.blue[200],
                  borderRadius: "50px 0 50px 0",
                  padding: { xs: "25px 35px", md: "30px 40px" },
                  height: "100%",
                }}
              >
                <Box>
                  <Typography
                    color={theme.palette.text.white}
                    fontSize={{ xs: "14px", md: "16px" }}
                    fontWeight={"bold"}
                  >
                    {t("AgriBbee D2R (Direct-to-Retailer) Channel  benefits:")}
                  </Typography>
                </Box>
                <Stack marginTop={"10px"}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      gap: "15px",
                      margin: "10px 0",
                    }}
                  >
                    <PanoramaFishEyeIcon
                      sx={{
                        fontSize: { xs: "10px", md: "15px" },
                        color: (theme) => theme.palette.text.white,
                        margin: "4px",
                      }}
                    />
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={(theme) => theme.palette.text.white}
                    >
                      {t(
                        "AI-Powered Distribution improves channel  efficiency  leading to better price discounts for  consumers"
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      gap: "15px",
                      margin: "10px 0",
                    }}
                  >
                    <PanoramaFishEyeIcon
                      sx={{
                        fontSize: { xs: "10px", md: "15px" },
                        color: (theme) => theme.palette.text.white,
                        margin: "4px",
                      }}
                    />
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={(theme) => theme.palette.text.white}
                    >
                      {t(
                        "On-Demand Procurement optimizes inventory  and cuts costs"
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      gap: "15px",
                      margin: "10px 0",
                    }}
                  >
                    <PanoramaFishEyeIcon
                      sx={{
                        fontSize: { xs: "10px", md: "15px" },
                        color: (theme) => theme.palette.text.white,
                        margin: "4px",
                      }}
                    />
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={(theme) => theme.palette.text.white}
                    >
                      {t(
                        "Refrigerated consolidation from sourcing  suppliers to consumers improves food safety"
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      gap: "15px",
                      margin: "10px 0",
                    }}
                  >
                    <PanoramaFishEyeIcon
                      sx={{
                        fontSize: { xs: "10px", md: "15px" },
                        color: (theme) => theme.palette.text.white,
                        margin: "4px",
                      }}
                    />
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={(theme) => theme.palette.text.white}
                    >
                      {t(
                        "Eliminates middle men and food waste in  Vietnam’s fragmented distribution network "
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      gap: "15px",
                      margin: "10px 0",
                    }}
                  >
                    <PanoramaFishEyeIcon
                      sx={{
                        fontSize: { xs: "10px", md: "15px" },
                        color: (theme) => theme.palette.text.white,
                        margin: "4px",
                      }}
                    />
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={(theme) => theme.palette.text.white}
                    >
                      {t(
                        "Enables cross-border agriculture exchange and  effective trading"
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CustomStackFullWidth>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          marginY="50px"
          sx={{
            background: (theme) => theme.palette.blue[100],
            borderRadius: "10px",
            padding: { xs: "25px 35px", md: "30px 40px" },
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack
                sx={{
                  backgroundImage: `url(${presentation.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  borderRadius: "20px",
                  width: "100%",
                  height: "100%",
                  minBlockSize: "300px",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  color={theme.palette.primary.main}
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight={"bold"}
                >
                  {t("PLATINUM ACCOUNT MANAGER -GAM")}
                </Typography>
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "11px", md: "12px" }}
                >
                  {t(
                    "AgriBbee Sourcing Chanel digitizes the Fragmented VN Wholesale Supply  Chain, then integrates with our proprietary AI-Tools for American farmers or  food processors to export and distribute product in a foreign country  smartly."
                  )}
                </Typography>
              </Box>
              <Stack marginY={"10px"}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Quick Account Setup")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Professinal Social Media management")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Rapid account level Support")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Market research")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Exclusive buyer fetching")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("Industry analysis")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("expert buyer negotiations")}
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Button
                  variant={"contained"}
                  color={theme.palette.text.default}
                  background={theme.palette.primary.main}
                  size={"small"}
                  onClick={() => {
                    history.push("/live-chat");
                  }}
                >
                  {t("More Features")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CustomStackFullWidth>

        <CustomStackFullWidth>
          <Stack container justifyContent={"center"}>
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "center",

                zIndex: "1",
                gap: "10px",
              }}
            >
              <Typography
                color={theme.palette.text.default}
                fontSize={{ xs: "18px", md: "20px" }}
                fontWeight={"bold"}
              >
                {t("Initial")}
              </Typography>
              <Typography
                color={theme.palette.primary.main}
                fontWeight={"bold"}
                fontSize={{ xs: "18px", md: "20px" }}
              >
                {t("3 Month ")}
              </Typography>
              <Typography
                color={theme.palette.text.default}
                fontSize={{ xs: "18px", md: "20px" }}
                fontWeight={"bold"}
              >
                {t("Trial Free is Free")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "center",

                zIndex: "1",
                gap: "10px",
              }}
            >
              <Typography
                color={theme.palette.text.default}
                fontSize={{ xs: "18px", md: "20px" }}
                fontWeight={"bold"}
              >
                {t("Thereafter")}
              </Typography>
              <Typography
                color={theme.palette.blue[200]}
                fontWeight={"bold"}
                fontSize={{ xs: "18px", md: "20px" }}
              >
                {t("$100/month")}
              </Typography>
            </Box>
          </Stack>

          <Grid
            container
            justifyContent={"space-around"}
            spacing={4}
            marginTop={"20px"}
          >
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <Stack
                  sx={{
                    width: { xs: "80px", md: "100px" },
                    height: { xs: "80px", md: "100px" },
                    border: `2px solid ${theme.palette.blue[200]}`,
                    borderRadius: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <Stack
                    container
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.palette.blue[200],
                      borderRadius: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      border: `5px solid white`,
                    }}
                  >
                    <CustomImageContainer
                      width={{ xs: "40px", md: "45px" }}
                      src={car.src}
                      objectFit={"contain"}
                    />
                  </Stack>
                </Stack>
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "11px", md: "12px" }}
                  textAlign={"center"}
                >
                  {t("Unlimited Product Listing & Future  Delivery Auction")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <Stack
                  sx={{
                    width: { xs: "80px", md: "100px" },
                    height: { xs: "80px", md: "100px" },
                    border: `2px solid ${theme.palette.blue[200]}`,
                    borderRadius: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <Stack
                    container
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.palette.blue[200],
                      borderRadius: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      border: `5px solid white`,
                    }}
                  >
                    <CustomImageContainer
                      width={{ xs: "40px", md: "45px" }}
                      src={catalog.src}
                      objectFit={"contain"}
                    />
                  </Stack>
                </Stack>
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "11px", md: "12px" }}
                  textAlign={"center"}
                >
                  {t("Digital Catalog")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <Stack
                  sx={{
                    width: { xs: "80px", md: "100px" },
                    height: { xs: "80px", md: "100px" },
                    border: `2px solid ${theme.palette.blue[200]}`,
                    borderRadius: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <Stack
                    container
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.palette.blue[200],
                      borderRadius: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      border: `5px solid white`,
                    }}
                  >
                    <CustomImageContainer
                      width={{ xs: "40px", md: "45px" }}
                      src={support.src}
                      objectFit={"contain"}
                    />
                  </Stack>
                </Stack>
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "11px", md: "12px" }}
                  textAlign={"center"}
                >
                  {t(
                    "Cross Border D2R Warehouse &  Local Distribution Support"
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CustomStackFullWidth>

        <CustomStackFullWidth
          sx={{
            backgroundImage: `url(${additionalFeature.src})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "10px",
            marginY: "20px",
          }}
        >
          <Stack container alignItems={"center"} marginY={"20px"}>
            <Typography
              color={theme.palette.text.white}
              fontSize={{ xs: "18px", md: "20px" }}
              fontWeight={"bold"}
            >
              {t("Additinal Features")}
            </Typography>
            <Typography
              color={theme.palette.text.white}
              fontSize={{ xs: "10px", md: "12px" }}
            >
              {t("GAM Detailed Service Feature")}
            </Typography>
          </Stack>

          <Grid
            container
            justifyContent={"space-around"}
            spacing={4}
            marginTop={"20px"}
          >
            <Grid item xs={12} md={4}>
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "20px",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: { xs: "60px", md: "70px" },
                    minHeight: { xs: "60px", md: "70px" },
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomImageContainer
                    maxWidth={{ xs: "25px", md: "30px" }}
                    src={note.src}
                    objectFit={"contain"}
                  />
                </Box>
                <Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("ExportHub Profile Management")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Product posting assistance")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("New inquiries alert")}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "20px",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: { xs: "60px", md: "70px" },
                    minHeight: { xs: "60px", md: "70px" },
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomImageContainer
                    maxWidth={{ xs: "25px", md: "30px" }}
                    src={settings.src}
                    objectFit={"contain"}
                  />
                </Box>
                <Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Phone & Email Correspondence")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Trade negotiations")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Strategic marketing")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Monthly performance reports")}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "20px",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: { xs: "60px", md: "70px" },
                    minHeight: { xs: "60px", md: "70px" },
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomImageContainer
                    maxWidth={{ xs: "25px", md: "30px" }}
                    src={computer.src}
                    objectFit={"contain"}
                  />
                </Box>
                <Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Personal dashboard")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <DoneIcon
                      sx={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography
                      color={theme.palette.text.white}
                      fontSize={{ xs: "11px", md: "12px" }}
                    >
                      {t("Social accounts management")}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          marginY={"20px"}
          paddingX={{ xs: "10px", md: "200px" }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: { xs: "10px", md: "12px" },
              borderRadius: { xs: "10px", md: "10px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              color={theme.palette.text.white}
              fontSize={{ xs: "22px", md: "25px" }}
              fontWeight={"bold"}
            >
              {t("Sign up as a supplier for FREE now!")}
            </Typography>
          </Box>
          {/* <RestaurantJoin /> */}
        </CustomStackFullWidth>
        <Stack
          sx={{
            backgroundImage: `url(${building.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginTop: { xs: "80px", md: "80px" },
            borderRadius: "10px",
            minHeight: { xs: "200px", md: "200px" },
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "80px", md: "100px" },
              maxHeight: { xs: "80px", md: "100px" },
              borderRadius: "100%",
              overflow: "hidden",
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "166",
            }}
          >
            <CustomImageContainer src={goldMember.src} objectFit={"contain"} />
          </Box>
          <Box
            sx={{
              padding: { xs: "10px", md: "10px 15px" },
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              fontSize={{ xs: "18px", md: "20px" }}
              color={theme.palette.text.white}
              fontWeight={"bold"}
            >
              {t("Distribution Partnership")}
            </Typography>
          </Box>
        </Stack>
        <CustomStackFullWidth marginY={"20px"}>
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Stack sx={{ borderRadius: "20px", overflow: "hidden" }}>
                <Box container sx={{ height: { xs: "100px", md: "120px" } }}>
                  <CustomImageContainer
                    src={marketGirl.src}
                    objectFit={"cover"}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    paddingX: { xs: "15px", md: "20px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    height: { xs: "70px", md: "75px" },
                    maxHeight: { xs: "70px", md: "75px" },
                  }}
                >
                  <Typography
                    color={theme.palette.text.white}
                    fontSize={{ xs: "11px", md: "12px" }}
                    textAlign={"center"}
                  >
                    {t("Take care of orders in advance.  Get paid in advance.")}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack sx={{ borderRadius: "20px", overflow: "hidden" }}>
                <Box container sx={{ height: { xs: "100px", md: "120px" } }}>
                  <CustomImageContainer
                    src={soterGirl.src}
                    objectFit={"cover"}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    paddingX: { xs: "15px", md: "20px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    height: { xs: "70px", md: "75px" },
                    maxHeight: { xs: "70px", md: "75px" },
                  }}
                >
                  <Typography
                    color={theme.palette.text.white}
                    fontSize={{ xs: "11px", md: "12px" }}
                    textAlign={"center"}
                  >
                    {t(
                      "With  AgriBbee Future Auction Wholesalers in Vietnam can place orders for  future delivery dates"
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack sx={{ borderRadius: "20px", overflow: "hidden" }}>
                <Box container sx={{ height: { xs: "100px", md: "120px" } }}>
                  <CustomImageContainer
                    src={banner_bg.src}
                    objectFit={"cover"}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    paddingX: { xs: "15px", md: "20px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    height: { xs: "70px", md: "75px" },
                    maxHeight: { xs: "70px", md: "75px" },
                  }}
                >
                  <Typography
                    color={theme.palette.text.white}
                    fontSize={{ xs: "11px", md: "12px" }}
                    textAlign={"center"}
                  >
                    {t(
                      " AI-Procurement is consolidated with cross ocean shipment for local order fullfilments."
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack sx={{ borderRadius: "20px", overflow: "hidden" }}>
                <Box container sx={{ height: { xs: "100px", md: "120px" } }}>
                  <CustomImageContainer
                    src={terminal.src}
                    objectFit={"cover"}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    paddingX: { xs: "15px", md: "20px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    height: { xs: "70px", md: "75px" },
                    maxHeight: { xs: "70px", md: "75px" },
                  }}
                >
                  <Typography
                    color={theme.palette.text.white}
                    fontSize={{ xs: "11px", md: "12px" }}
                    textAlign={"center"}
                  >
                    {t(
                      " All-in-one Container delivery on  consignment with payment guarantee"
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        <CustomStackFullWidth marginY="50px">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack
                sx={{
                  backgroundImage: `url(${marketing.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  borderRadius: "20px",
                  width: "100%",
                  height: "100%",
                  minBlockSize: "300px",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  color={theme.palette.primary.main}
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight={"bold"}
                >
                  {t("PLATINUM ACCOUNT MANAGER -GAM")}
                </Typography>
                <Typography
                  color={theme.palette.text.default}
                  fontSize={{ xs: "11px", md: "12px" }}
                >
                  {t(
                    " Partner with AgriBbee Direct Sales & VN.Distribution Chanel :"
                  )}
                </Typography>
              </Box>
              <Stack marginY={"10px"}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("No Activation Fees ")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t("No commision , No midleman   ")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t(
                      "Receive Purchase Orders in Advanced with Payment Deposit.  "
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t(
                      "AgriBbee takes care of your Sales and Marketing and combined orders "
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t(
                      "You just pack products into our container drop off at your US warehouse"
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t(
                      "We will pick up and direct distribute to our network of buyers in Vietnam. "
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    margin: "10px 0",
                    alignItems: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: "14px", md: "19px" },
                      color: (theme) => theme.palette.blue[200],
                    }}
                  />
                  <Typography
                    fontSize={{ xs: "12px", md: "13px" }}
                    color={(theme) => theme.palette.neutral[800]}
                  >
                    {t(
                      "Your products and payment is secured and guarantee by Agribbee's USA Export on  Consigment Contract."
                    )}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CustomImageContainer maxWidth={"50px"} src={goldMember.src} />

                <AddCircleIcon
                  onClick={() => {
                    history.push("/live-chat");
                  }}
                  sx={{
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          marginY={"20px"}
          paddingX={{ xs: "10px", md: "200px" }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: { xs: "10px", md: "12px" },
              borderRadius: { xs: "10px", md: "10px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              color={theme.palette.text.white}
              fontSize={{ xs: "22px", md: "25px" }}
              fontWeight={"bold"}
            >
              {t("Sign up as a Distribution Partnership for free now")}
            </Typography>
          </Box>
          {/* <RestaurantJoin /> */}
        </CustomStackFullWidth>

        <CustomStackFullWidth marginY={"20px"}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginY: "20px",
            }}
          >
            <Typography
              color={theme.palette.neutral[900]}
              fontSize={{ xs: "16px", md: "18px" }}
              fontWeight={"bold"}
            >
              {t("Directory of us food & bevrages organization")}
            </Typography>
          </Box>

          <Stack
            sx={
              {
                // marginTop: "10px",
              }
            }
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Grid container key="" sx={{ border: "1px solid #eee" }}>
                <Grid
                  item
                  sm={3}
                  md={3}
                  colSpan={1}
                  sx={{
                    borderRight: "1px solid #eee !important",
                    padding: { xs: "10px", md: "12px" },
                  }}
                >
                  <Typography
                    color={theme.palette.blue[200]}
                    fontSize={{ xs: "16px", md: "18px" }}
                    fontWeight={"bold"}
                  >
                    {t("Company")}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={3}
                  md={3}
                  sx={{
                    borderRight: "1px solid #eee!important",
                    padding: { xs: "10px", md: "12px" },
                  }}
                >
                  <Typography
                    color={theme.palette.blue[200]}
                    fontSize={{ xs: "16px", md: "18px" }}
                    fontWeight={"bold"}
                  >
                    {t("Contact info")}
                  </Typography>
                </Grid>

                <Grid
                  item
                  sm={6}
                  md={6}
                  sx={{ padding: { xs: "10px", md: "12px" } }}
                >
                  <Typography
                    color={theme.palette.blue[200]}
                    fontSize={{ xs: "16px", md: "18px" }}
                    fontWeight={"bold"}
                  >
                    {t("About")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Stack sx={{ border: "0" }}>
              {organizationData.map((item, index) => (
                <OrganizationDataRow item={item} index={index} />
              ))}

              <Grid
                container
                xs={12}
                key=""
                sx={{
                  borderLeft: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                  borderRight: "1px solid #eee",
                }}
              >
                <Grid item colSpan={5}>
                  "ghchc"
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CustomStackFullWidth>

        <Stack
          sx={{
            backgroundImage: `url(${callGirl.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "start",
            marginTop: { xs: "80px", md: "80px" },
            borderRadius: "10px",
            minHeight: { xs: "400px", md: "500px" },
            padding: "40px",
            position: "relative",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4}></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={8}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: "80px", md: "80px" },
                  maxHeight: { xs: "80px", md: "80px" },
                  borderRadius: "100%",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                <CustomImageContainer
                  src={amexVietLogo.src}
                  objectFit={"contain"}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography
                    color={theme.palette.blue[200]}
                    fontSize={{ xs: "16px", md: "18px" }}
                    fontWeight={"bold"}
                    marginBottom="20px"
                  >
                    {t("Contact Us")}
                  </Typography>
                  <Stack
                    sx={{
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: theme.palette.blue[200],
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <LocationOn
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t(
                          "AiBBee Digital LLC 8 Clark Way, Holmde NJ 07733 USA"
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <Phone
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t("+1 732 705 0611")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <Language
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t("www.agribee.com")}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    sx={{
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: theme.palette.blue[200],
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <LocationOn
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t(
                          "88 DC 11 str, Tan Ky ward, Tan Phu distric, HoChiMinh city, Vietnam"
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <Phone
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t("+84 2838 165 339")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          borderRadius: "100px",
                          backgroundColor: theme.palette.primary.main,
                          cursor: "pointer",
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      >
                        <Language
                          sx={{ color: theme.palette.text.white }}
                          fontSize="12px"
                        />
                      </Box>
                      <Typography
                        color={theme.palette.text.white}
                        fontSize={{ xs: "12px", md: "13px" }}
                      >
                        {t("www.agribee.com")}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <ContactForm />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </CustomContainer>

      <CustomStackFullWidth sx={{ marginTop: "20px" }}>
        <FeatureCatagories
          mainBg={theme.palette.blue[200]}
          categoryBg={theme.palette.background.default}
        />
      </CustomStackFullWidth>
    </>
  );
};

export default memo(ImportedFoodSourcing);
