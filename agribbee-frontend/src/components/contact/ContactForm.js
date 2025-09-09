import React from "react";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import { useFormik } from "formik";
import { Grid, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import ContactFormFields from "./ContactFormFields";
import ValidationSchemaForContact from "./ValidationSchemaForContact";

const ContactForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const ContactFormik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      phone: "",
      email: "",
      message: "",
      tandc: false,
    },
    validationSchema: ValidationSchemaForContact(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitOnSuccess(values);
      } catch (err) {}
    },
  });

  const formSubmitOnSuccess = (values) => {
    console.log(values);
  };
  const fNameHandler = (value) => {
    ContactFormik.setFieldValue("f_name", value);
  };

  const lNameHandler = (value) => {
    ContactFormik.setFieldValue("l_name", value);
  };
  const phoneHandler = (values) => {
    ContactFormik.setFieldValue("phone", values);
  };
  const emailHandler = (value) => {
    ContactFormik.setFieldValue("email", value);
  };
  const messageHandler = (value) => {
    ContactFormik.setFieldValue("message", value);
  };

  return (
    <>
      <CustomBoxFullWidth padding="2rem">
        <form noValidate onSubmit={ContactFormik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ContactFormFields
                ContactFormik={ContactFormik}
                fNameHandler={fNameHandler}
                lNameHandler={lNameHandler}
                phoneHandler={phoneHandler}
                emailHandler={emailHandler}
                messageHandler={messageHandler}
              />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: "100px" }}
                // loading={isLoading}
              >
                {t("Send message")}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CustomBoxFullWidth>
    </>
  );
};
export default ContactForm;
