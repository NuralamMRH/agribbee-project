import { Paper, styled } from "@mui/material";
import { Box } from "@mui/system";
import footerBg from "./footerBg.svg";
export const StyledFooterBackground = styled(Box)(
  ({ theme, router, backgroundColor }) => ({
    width: "100%",
    backgroundColor: backgroundColor || "#4D4D4D",
    [theme.breakpoints.down("md")]: {
      marginBottom: router !== "/" && "4.5rem",
    },
  })
);
