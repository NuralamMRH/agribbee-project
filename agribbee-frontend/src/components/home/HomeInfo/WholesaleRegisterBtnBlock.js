import CustomContainer from "@/components/container";
import { CustomButtonPrimary } from "@/styled-components/CustomButtons.style";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

const WholesaleRegisterBtnBlock = () => {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { t } = useTranslation();
  const theme = useTheme();
  console.log(
    `wholesaleRegisterBtnTitle ${landingPageData?.response?.wholesaleRegisterBtnTitle}`
  );

  return (
    <CustomContainer>
      <CustomStackFullWidth sx={{ marginBottom: "30px", marginTop: "30px" }}>
        <Grid
          container
          spacing={2}
          alignItems="start"
          justifyContent={"center"}
          sx={{
            backgroundColor: (theme) => theme.palette.background.blue,
            borderRadius: { xs: "10px", md: "50px" },
            padding: { xs: "10px", md: "50px" },
          }}
        >
          <Grid xs={12} md={9} alignItems="center">
            <Typography
              fontSize={{ xs: "14px", md: "18px" }}
              fontWeight={{ xs: "500", md: "700" }}
              color={"#fff"}
            >
              {landingPageData?.response?.wholesaleRegisterBtnTitle}
            </Typography>
          </Grid>
          <Grid xs={12} md={3} align="center">
            <CustomButtonPrimary title={t("ĐĂNGKÝ NGAY")} />
          </Grid>
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

export default WholesaleRegisterBtnBlock;
