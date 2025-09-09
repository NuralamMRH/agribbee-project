import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Grid } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";

const SellerDetailsForm = ({
  formData,
  sellerNameHandler,
  sellerDescriptionHandler,
  language,
}) => {
  const { t } = useTranslation();

  console.log("Name: ", formData.values[language]?.name);

  return (
    <>
      {/* Seller Name Field */}
      <Grid item xs={12} md={12}>
        <CustomTextFieldWithFormik
          required
          type="text"
          label={t("Name")}
          value={formData.values[language]?.name || ""}
          touched={formData.touched[language]?.name}
          errors={formData.errors[language]?.name}
          fieldProps={{ ...formData.getFieldProps(`${language}.name`) }}
          onChangeHandler={(e) => {
            sellerNameHandler(e.target.value, language);
          }}
        />
      </Grid>

      {/* Description Field */}
      <Grid item xs={12} md={12}>
        <CustomTextFieldWithFormik
          required
          type="text"
          label={t("Description")}
          value={formData.values[language]?.description || ""}
          touched={formData.touched[language]?.description}
          errors={formData.errors[language]?.description}
          fieldProps={{ ...formData.getFieldProps(`${language}.description`) }}
          onChangeHandler={(e) =>
            sellerDescriptionHandler(e.target.value, language)
          }
        />
      </Grid>
    </>
  );
};

export default SellerDetailsForm;
