import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomImageContainer from "../CustomImageContainer";
import { useTheme } from "@emotion/react";
import { t } from "i18next";
export default function OrganizationDataRow({ item, index }) {
  const theme = useTheme();
  const [host, setHost] = useState("");

  useEffect(() => {
    // This will only run on the client side
    if (typeof window !== "undefined") {
      setHost(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  return (
    <Grid container key="" sx={{ borderBottom: "1px solid #eee" }}>
      <Grid
        item
        xs={3}
        md={3}
        alignItems="center"
        colSpan={1}
        sx={{
          borderLeft: "1px solid #eee",
          borderRight: "1px solid #eee",
          padding: { xs: "10px", md: "12px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack
            sx={{
              maxWidth: { xs: "80px", md: "100px" },
              maxHeight: { xs: "80px", md: "100px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item?.image && (
              <CustomImageContainer
                src={`${host}/${item?.image}`}
                objectFit={"contain"}
              />
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid
        item
        xs={3}
        md={3}
        sx={{
          borderRight: "1px solid #eee",
          padding: { xs: "10px", md: "12px" },
          overflowX: "scroll",
        }}
      >
        <Stack>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight={"bold"}
          >
            {t(item?.contact_info?.company)}
          </Typography>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight={"bold"}
          >
            {t(item?.contact_info?.office)}
          </Typography>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight={"bold"}
          >
            {t(item?.contact_info?.region)}
          </Typography>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
          >
            {t(item?.contact_info?.address)}
          </Typography>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
          >
            {t(item?.contact_info?.phone)}
          </Typography>
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "10px", md: "12px" }}
          >
            {t(item?.contact_info?.fax)}
          </Typography>
          <Typography
            color={theme.palette.blue[200]}
            fontSize={{ xs: "10px", md: "12px" }}
          >
            {t(item?.contact_info?.email)}
          </Typography>
        </Stack>
      </Grid>

      <Grid
        item
        xs={6}
        md={6}
        sx={{
          borderRight: "1px solid #eee",
          padding: { xs: "10px", md: "12px" },
          overflowX: "scroll",
        }}
      >
        <Box
          marginBottom="8px"
          textAlign={
            item?.company_info || item?.representativeTitle ? "center" : "start"
          }
        >
          <Typography
            color={theme.palette.neutral[900]}
            fontSize={{ xs: "11px", md: "14px" }}
            fontWeight={"bold"}
          >
            {t(item?.company || item?.representativeTitle)}
          </Typography>
        </Box>

        {item?.company_info?.length > 0 && (
          <Grid container spacing={2}>
            {item?.company_info?.length &&
              item?.company_info.map((x) => (
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <CustomImageContainer
                    src={`${host}/${x?.image}`}
                    objectFit={"contain"}
                    maxWidth={{ xs: "20px", md: "30px" }}
                  />
                  <Typography
                    color={theme.palette.neutral[900]}
                    fontSize={{ xs: "10px", md: "11px" }}
                    textAlign={"center"}
                  >
                    {t(x?.text)}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        )}

        {item?.representatives?.length > 0 && (
          <Grid
            container
            spacing={2}
            sx={{ paddingX: { xs: "0px", md: "30px" } }}
          >
            {item?.representatives?.length &&
              item?.representatives.map((x, index) => (
                <Grid item key={index} xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: theme.palette.blue[100],
                      borderRadius: "6px",
                      padding: "5px 10px",
                    }}
                  >
                    <Typography
                      color={theme.palette.neutral[900]}
                      fontSize={{ xs: "10px", md: "11px" }}
                      fontWeight={"bold"}
                    >
                      {t(x?.name)}
                    </Typography>

                    <Typography
                      color={theme.palette.neutral[900]}
                      fontSize={{ xs: "10px", md: "11px" }}
                    >
                      {t(x?.title)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        )}

        <Typography
          color={theme.palette.neutral[900]}
          fontSize={{ xs: "10px", md: "12px" }}
        >
          {t(item?.about)}
        </Typography>
      </Grid>
    </Grid>
  );
}
