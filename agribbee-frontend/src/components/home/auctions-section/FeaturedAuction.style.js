import { alpha, Box, Grid, IconButton, styled } from "@mui/material";
import { Stack } from "@mui/system";

export const CustomIconButton = styled(IconButton)(
  ({ theme, nextbutton, color }) => ({
    borderRadius: "50%",
    color:
      nextbutton === "true"
        ? theme.palette.neutral[100]
        : theme.palette.neutral[1000],
    background:
      nextbutton === "true"
        ? alpha(theme.palette.primary.main, 0.5)
        : theme.palette.neutral[1400],
    width: "30px",
    height: "30px",
    "&:hover": {
      background:
        nextbutton === "true"
          ? theme.palette.primary.main
          : theme.palette.neutral[300],
    },
  })
);

export const CustomSideOverLay = styled(Stack)(
  ({ theme, left, right, isdisabled }) => ({
    "&::after": {
      content: '""',
      position: "absolute",
      width: "69px",
      height: "100%",
      background: `linear-gradient(270deg, ${theme.palette.neutral[900]} 0%, rgba(0, 0, 0, 0) 100%)`,
      opacity: isdisabled ? "0" : ".23",
      left: left,
      right: right,
      top: ".2%",
      borderRadius: "0px 4px 4px 0px",
    },
  })
);
export const CustomGridWithBgColor = styled(Grid)(
  ({ theme, auctionsLength, padding, newSection, bgColor }) => ({
    background: bgColor || "#4C8CD1",
    padding: auctionsLength > 0 && (padding || "23px 0px 23px 23px"),
    borderRadius: "0px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: auctionsLength > 0 && "10px 0px 13px 10px",
    },
  })
);
