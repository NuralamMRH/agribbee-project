import { Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CustomImageContainer from "../CustomImageContainer";
import { CustomColouredPaper, FeatureImageBox } from "./MuaTanGocCard.style";
import Router, { useRouter } from "next/router";
import { Box } from "@mui/system";

const MuaTanGocCard = ({
  categoryImage,
  name,
  id,
  height,
  categoryIsSticky,
  handleTabClick,
  tab,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isXSmall = useMediaQuery(theme.breakpoints.down("md"));

  // console.log("categoryImage:", categoryImage);

  return (
    <Grid
      item
      sx={{
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          paddingTop: "10px",
          borderRadius: "100px",
          maxWidth: {
            xs: categoryIsSticky ? "100%" : "150px",
            md: "100%",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexDirection: "row",
          [theme.breakpoints.down("md")]: {
            paddingTop: "0px",
            flexDirection: categoryIsSticky ? "flex" : "column",
            gap: categoryIsSticky ? "10px" : "0px",
            //backgroundColor: theme.palette.secondary.main,
          },
        }}
        spacing={{ xs: 0.5, md: 1 }}
        onClick={handleTabClick}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: {
              xs: categoryIsSticky ? "30px" : "40px",
              md: categoryIsSticky ? "40px" : "80px",
            },
            height: {
              xs: categoryIsSticky ? "30px" : "40px",
              md: categoryIsSticky ? "40px" : "80px",
            },
            maxWidth: {
              xs: categoryIsSticky ? "30px" : "40px",
              md: categoryIsSticky ? "40px" : "80px",
            },
            minWidth: {
              xs: categoryIsSticky ? "30px" : "40px",
              md: categoryIsSticky ? "40px" : "80px",
            },
            maxHeight: {
              xs: categoryIsSticky ? "30px" : "40px",
              md: categoryIsSticky ? "40px" : "80px",
            },
            borderRadius: "100%",
            backgroundColor: (theme) => theme.palette.background.default,
            padding: {
              xs: "8px",
              md: categoryIsSticky ? "0px" : "20px",
            },
            transition: `all ease 0.5s`,
            "&:hover": {
              transform: "scale(1.1)",
            },
            animation: "fadeInRight 2s  1",
          }}
        >
          <CustomImageContainer
            src={categoryImage}
            alt={name}
            height={{
              xs: categoryIsSticky ? "20px" : "30px",
              md: categoryIsSticky ? "25px" : "50px",
            }}
            width={{
              xs: categoryIsSticky ? "20px" : "30px",
              md: categoryIsSticky ? "25px" : "50px",
            }}
            objectFit="contain"
            smMb="5px"
            smHeight="100%"
            smMaxWidth="55px"
            cursor="pointer"
            borderRadius={
              router.pathname === "/categories" && isXSmall ? "0px" : "0px"
            }
          />
        </Box>
        <Typography
          sx={{
            color: (theme) => theme.palette.primary.black,
            overflow: "hidden",
            // textOverflow: "ellipsis",
            display: "-webkit-box",
            // WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            fontWeight: {
              xs: categoryIsSticky ? "400" : "500",
              md: categoryIsSticky ? "600" : "700",
            },
            fontSize: {
              xs: categoryIsSticky ? "8px" : "12px",
              md: categoryIsSticky ? "13px" : "18px",
            },
            textAlign: { xs: categoryIsSticky ? "" : "center" },
          }}
        >
          {name}
        </Typography>
      </Box>
    </Grid>
  );
};

export default MuaTanGocCard;
