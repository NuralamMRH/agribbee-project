import React from "react";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  CustomBoxFullWidth,
  CustomColouredTypography,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../CustomPhoneInput";
import { useRouter } from "next/router";

const ContactFormFields = ({
  ContactFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
  emailHandler,
  messageHandler,
  backgroundColor,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleCheckbox = (e) => {
    ContactFormik.setFieldValue("tandc", e.target.checked);
  };
  const handleClick = () => {
    window.open("/terms-and-conditions");
    // handleClose()
  };
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            label={t("First Name")}
            touched={ContactFormik.touched.f_name}
            errors={ContactFormik.errors.f_name}
            fieldProps={ContactFormik.getFieldProps("f_name")}
            onChangeHandler={fNameHandler}
            value={ContactFormik.values.f_name}
            backgroundColor={backgroundColor}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextFieldWithFormik
            required="true"
            type="text"
            label={t("Last Name")}
            touched={ContactFormik.touched.l_name}
            errors={ContactFormik.errors.l_name}
            fieldProps={ContactFormik.getFieldProps("l_name")}
            onChangeHandler={lNameHandler}
            value={ContactFormik.values.l_name}
            backgroundColor={backgroundColor}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomTextFieldWithFormik
            required="true"
            type="email"
            label={t("Email")}
            touched={ContactFormik.touched.email}
            errors={ContactFormik.errors.email}
            fieldProps={ContactFormik.getFieldProps("email")}
            onChangeHandler={emailHandler}
            value={ContactFormik.values.email}
            backgroundColor={backgroundColor}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomPhoneInput
            initCountry={"Vi"}
            value={ContactFormik.values.phone}
            onHandleChange={phoneHandler}
            touched={ContactFormik.touched.phone}
            errors={ContactFormik.errors.phone}
            backgroundColor={backgroundColor}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomTextFieldWithFormik
            required="true"
            type="textarea"
            label={t("Message")}
            touched={ContactFormik.touched.message}
            errors={ContactFormik.errors.message}
            fieldProps={ContactFormik.getFieldProps("message")}
            onChangeHandler={messageHandler}
            value={ContactFormik.values.message}
            backgroundColor={backgroundColor}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{ padding: "0px", margin: "0px" }}
        >
          <Box
            direction="row"
            alignItems="center"
            spacing={{ xs: "0", md: ".5" }}
            sx={{
              display: "flex",
            }}
          >
            <FormControlLabel
              sx={{
                marginRight: "5px",

                "& .MuiFormControlLabel-label": {
                  fontSize: "12px",
                  color: (theme) => theme.palette.neutral[1000],
                },
                [theme.breakpoints.down("sm")]: {
                  "& .MuiFormControlLabel-label": {
                    fontSize: "10px",
                  },
                },
              }}
              control={
                <Checkbox
                  value="ff"
                  color="primary"
                  onChange={(e) => handleCheckbox(e)}
                  required="true"
                />
              }
              label={t("I accept all the")}
            />
            <CustomColouredTypography
              color={theme.palette.newsletterBG}
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "12px",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "10px",
                  marginLeft: "0px",
                },
              }}
            >
              {t("Terms and conditions")}
            </CustomColouredTypography>
          </Box>
          {ContactFormik.touched.tandc && ContactFormik.errors.tandc && (
            <CustomTypography
              variant="caption"
              sx={{
                fontWeight: "inherit",
                color: (theme) => theme.palette.error.main,
              }}
            >
              {t("You agree to our friendly privacy policy.")}
            </CustomTypography>
          )}
        </Grid>
      </Grid>
    </CustomBoxFullWidth>
  );
};
export default ContactFormFields;
