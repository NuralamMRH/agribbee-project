import { Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CustomImageContainer from "../CustomImageContainer";
import { CustomColouredPaper, FeatureImageBox } from "./FeaturedCategory.style";
import Router, { useRouter } from "next/router";
import { Box } from "@mui/system";

const FeaturedCategoryCard = ({
  categoryImage,
  name,
  id,
  categoryImageUrl,
  height,
  categoryIsSticky,
  categoryBg,
  pushTo,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isXSmall = useMediaQuery(theme.breakpoints.down("md"));
  const image = `${categoryImageUrl}/${categoryImage}`;
  const handleClick = () => {
    Router.push(
      {
        pathname: `/category/${id}`,
        query: { name: name, page: pushTo ? pushTo : "" },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Grid item sx={{ overflow: "hidden" }} onClick={handleClick}>
      <FeatureImageBox
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 0.5, md: 1 }}
      >
        <Box
          sx={{
            height: { xs: "85px", md: categoryIsSticky ? "50px" : "100px" },
            display: "flex",
            width: { xs: "85px", md: categoryIsSticky ? "50px" : "100px" },
            padding: { xs: "5px", md: categoryIsSticky ? "10px" : "10px" },
            border: categoryBg ? "none" : "1px solid",
            borderColor: (theme) => theme.palette.neutral[200],
            backgroundColor: categoryBg
              ? categoryBg
              : (theme) => theme.palette.neutral[200],
            borderRadius: pushTo === "ecommerce" ? "10px" : "100px",
            transition: `all ease 0.5s`,
            "&:hover": {
              transform: "scale(1.1)",
            },
            animation: "fadeInRight 2s  1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomImageContainer
            src={image}
            alt={name}
            height="100%"
            width="100%"
            objectFit={pushTo === "ecommerce" ? "cover" : "contain"}
            smMb="5px"
            smHeight="55px"
            smMaxWidth="55px"
            cursor="pointer"
            borderRadius={
              router.pathname === "/categories" && isXSmall ? "10px" : "10px"
            }
          />
        </Box>
        <Typography
          sx={{
            color: categoryBg
              ? (theme) => theme.palette.neutral[1800]
              : (theme) => theme.palette.neutral[1200],
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            width: { xs: "85px", md: categoryIsSticky ? "50px" : "100px" },
            textAlign: "center",
          }}
          fontSize={{ xs: "12px", sm: "13px", md: "13px" }}
          fontWeight="400"
        >
          {name}
        </Typography>
      </FeatureImageBox>
    </Grid>
  );
};

export default FeaturedCategoryCard;
