import React from "react";
import PropTypes from "prop-types";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

const CustomSelectWithFormik = (props) => {
  const {
    inputLabel,
    selectFieldData,
    passSelectedValue,
    touched,
    errors,
    fieldProps,
    required,
    height,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (event) => {
    passSelectedValue(event.target.value);
    fieldProps.onChange(event); // Update Formik's state directly
  };

  return (
    <CustomBoxFullWidth>
      <FormControl fullWidth>
        <InputLabel
          required={required}
          sx={{ color: theme.palette.neutral[1000], fontSize: "13px" }}
        >
          {inputLabel}
        </InputLabel>
        <Select
          label={inputLabel}
          value={fieldProps.value || ""} // Use Formik's controlled value
          onChange={handleChange}
          error={Boolean(touched && errors)}
          sx={{ height: height ?? "inherit", borderRadius: "5px" }}
        >
          {selectFieldData?.length > 0 ? (
            selectFieldData.map((item, index) => (
              <MenuItem
                key={index}
                value={item.value}
                sx={{
                  maxWidth: "100%",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                {t(item.label)}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">{t("No options available")}</MenuItem>
          )}
        </Select>
        {touched && errors && !fieldProps.value && (
          <FormHelperText sx={{ color: theme.palette.error.main }}>
            {t("Please select an option.")}
          </FormHelperText>
        )}
      </FormControl>
    </CustomBoxFullWidth>
  );
};

CustomSelectWithFormik.propTypes = {
  inputLabel: PropTypes.string.isRequired,
  selectFieldData: PropTypes.array.isRequired,
  passSelectedValue: PropTypes.func.isRequired,
};

export default CustomSelectWithFormik;
