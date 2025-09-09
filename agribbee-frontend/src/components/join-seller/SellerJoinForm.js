import React from "react";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import { useFormik } from "formik";
import { Grid, Tab, Tabs } from "@mui/material";
import SellerDetailsForm from "./SellerDetailsForm";
import ImageSection from "./ImageSection";
import MapForSellerJoin from "./MapForSellerJoin";
import LoadingButton from "@mui/lab/LoadingButton";
import ValidationSchemaForSeller from "./ValidationSchemaForSeller";
import { useTranslation } from "react-i18next";
import { languageLists } from "../navbar/second-navbar/custom-language/languageLists";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import useForm from "./useForm";

const SellerJoinForm = ({ formSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [tabValue, seTabValue] = React.useState("vi");

  const translatedFields = {};
  if (languageLists.length > 0) {
    languageLists.forEach((lang) => {
      translatedFields[lang.languageCode] = {
        name: "",
        description: "",
        meta_title: "",
        meta_description: "",
      };
    });
  }

  // Initialize Formik
  const formData = useFormik({
    initialValues: {
      ...translatedFields,
      seller_category: "",
      market: "",
      building: "",
      address: "",
      zip: "",
      city: "",
      region: "",
      country: "",
      image: "",
      banner: "",
      lat: "",
      lng: "",
    },
    validationSchema: ValidationSchemaForSeller(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitOnSuccess(values);
      } catch (err) {}
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data: ", formData.values);
    formData.handleSubmit();
  };

  const formSubmitOnSuccess = (values) => {
    formSubmit(values);
  };

  const sellerNameHandler = (value, langCode) => {
    formData.setFieldValue(`${langCode}.name`, value);
    formData.setFieldValue(`${langCode}.meta_title`, value);
  };

  const sellerDescriptionHandler = (value, langCode) => {
    formData.setFieldValue(`${langCode}.description`, value);
    formData.setFieldValue(`${langCode}.meta_description`, value);
  };

  const singleFileUploadHandlerForImage = (value) => {
    formData.setFieldValue("image", value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    formData.setFieldValue("image", value);
  };
  const singleFileUploadHandlerForCoverPhoto = (value) => {
    formData.setFieldValue("banner", value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForCoverPhoto = (value) => {
    formData.setFieldValue("banner", value);
  };

  const handleTabChange = (event, newValue) => {
    seTabValue(newValue);
  };
  return (
    <>
      <CustomBoxFullWidth padding={{ xs: "10px", md: "2rem" }}>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ImageSection
                formData={formData}
                singleFileUploadHandlerForImage={
                  singleFileUploadHandlerForImage
                }
                imageOnchangeHandlerForImage={imageOnchangeHandlerForImage}
                singleFileUploadHandlerForCoverPhoto={
                  singleFileUploadHandlerForCoverPhoto
                }
                imageOnchangeHandlerForCoverPhoto={
                  imageOnchangeHandlerForCoverPhoto
                }
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TabContext value={tabValue} padding={"0px"}>
                <TabList onChange={handleTabChange}>
                  {languageLists?.map((lan, index) => (
                    <Tab
                      label={`${lan.countryCode}`}
                      value={`${lan.languageCode}`}
                    />
                  ))}
                </TabList>
                {languageLists?.map((lan, index) => (
                  <TabPanel
                    key={lan.languageCode}
                    value={`${lan.languageCode}`}
                    sx={{ paddingX: "0px", margin: "0px" }}
                  >
                    <SellerDetailsForm
                      language={lan.languageCode}
                      formData={formData}
                      sellerNameHandler={sellerNameHandler}
                      sellerDescriptionHandler={sellerDescriptionHandler}
                    />
                  </TabPanel>
                ))}
              </TabContext>
            </Grid>

            <Grid item xs={12} md={12}>
              <MapForSellerJoin formData={formData} />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                fullWidth
                sx={{
                  mt: 1,
                  mb: 3.5,
                  maxWidth: "400px",
                  height: "45px",
                }}
                loading={isLoading}
                variant="contained"
                disabled={isLoading}
              >
                {t("Submit")}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CustomBoxFullWidth>
    </>
  );
};
export default SellerJoinForm;
