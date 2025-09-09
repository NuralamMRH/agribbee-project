import React from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";

const SellerLoginForm = ({
  SellerJoinFormik,
  emailHandler,
  passwordHandler,
}) => {
  const { t } = useTranslation();
  const languageDirection = localStorage.getItem("direction");
  return (
    <CustomBoxFullWidth>
      <CustomStackFullWidth alignItems="center" mb="1.5rem" mt="1rem">
        <Typography>{t("Login Information")}</Typography>
      </CustomStackFullWidth>
      <Grid container>
        <CustomStackFullWidth
          direction={{ xs: "column", sm: "row", md: "row" }}
          alignItems="center"
          spacing={5}
          mb="1.5rem"
        >
          <CustomTextFieldWithFormik
            required="true"
            type="email"
            label={t("Email")}
            touched={SellerJoinFormik.touched.email}
            errors={SellerJoinFormik.errors.email}
            fieldProps={SellerJoinFormik.getFieldProps("email")}
            onChangeHandler={emailHandler}
            value={SellerJoinFormik.values.email}
          />
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction={{ xs: "column", sm: "row", md: "row" }}
          alignItems="center"
          spacing={languageDirection === "rtl" ? 0 : 3}
          gap={languageDirection === "rtl" ? "20px" : "0px"}
        >
          <CustomTextFieldWithFormik
            type="password"
            label={t("Password")}
            value={SellerJoinFormik.values.password}
            onChangeHandler={passwordHandler}
            touched={SellerJoinFormik.touched.password}
            errors={SellerJoinFormik.errors.password}
            fieldProps={SellerJoinFormik.getFieldProps("password")}
            required="true"
            languageDirection={languageDirection}
          />
          <CustomTextFieldWithFormik
            type="password"
            label={t("Confirm Password")}
            value={SellerJoinFormik.values.confirm_password}
            onChangeHandler={passwordHandler}
            touched={SellerJoinFormik.touched.confirm_password}
            errors={SellerJoinFormik.errors.confirm_password}
            fieldProps={SellerJoinFormik.getFieldProps("confirm_password")}
            required="true"
            InputLabelProps={{ shrink: true }}
            languageDirection={languageDirection}
          />
        </CustomStackFullWidth>
      </Grid>
    </CustomBoxFullWidth>
  );
};
export default SellerLoginForm;
