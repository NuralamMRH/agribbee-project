import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";

const InfoSectionHeader = ({
  topText,
  topTextColor,
  topTextFontSize,
  topTextFontWidth,
  bottomText,
  bottomTextColor,
  bottomTextFontSize,
  bottomTextFontWidth,
  flex,
  flexDirection,
  justifyX,
  alignX,
}) => {
  return (
    <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
      <Box
        sx={{
          my: 1,
          display: flex ? flex : "flex",
          flexDirection: flexDirection ? flexDirection : "column",
          justifyContent: justifyX ? justifyX : "center",
          alignItems: alignX ? alignX : "center",
        }}
      >
        <Typography
          fontSize={topTextFontSize}
          fontWeight={topTextFontWidth}
          color={topTextColor}
        >
          {topText}
        </Typography>

        <Typography
          fontSize={bottomTextFontSize}
          fontWeight={bottomTextFontWidth}
          color={bottomTextColor}
        >
          {bottomText}
        </Typography>
      </Box>
    </CustomStackFullWidth>
  );
};

export default InfoSectionHeader;
