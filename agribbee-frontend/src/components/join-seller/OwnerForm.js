import React from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Grid, Stack, Typography } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../CustomPhoneInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const OwnerForm = ({
  SellerJoinFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
}) => {
  const { t } = useTranslation();
  const { global, token } = useSelector((state) => state.globalSettings);
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} align="center">
          <Typography>{t("Owner Information")}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            label={t("First Name")}
            touched={SellerJoinFormik.touched.f_name}
            errors={SellerJoinFormik.errors.f_name}
            fieldProps={SellerJoinFormik.getFieldProps("f_name")}
            onChangeHandler={fNameHandler}
            value={SellerJoinFormik.values.f_name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            label={t("Last Name")}
            touched={SellerJoinFormik.touched.l_name}
            errors={SellerJoinFormik.errors.l_name}
            fieldProps={SellerJoinFormik.getFieldProps("l_name")}
            onChangeHandler={lNameHandler}
            value={SellerJoinFormik.values.l_name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomPhoneInput
            initCountry={global?.country}
            value={SellerJoinFormik.values.phone}
            onHandleChange={phoneHandler}
            touched={SellerJoinFormik.touched.phone}
            errors={SellerJoinFormik.errors.phone}
          />
        </Grid>
      </Grid>
    </CustomBoxFullWidth>
  );
};
export default OwnerForm;
