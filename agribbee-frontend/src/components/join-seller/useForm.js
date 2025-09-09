import React, { useState } from "react";
import ValidationSchemaForSeller from "./ValidationSchemaForSeller";

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    try {
      ValidationSchemaForSeller.validateSync(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = (err.inner || []).reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(validationErrors);
      console.log("Validation Errors:", validationErrors); // Logs each validation error
      return false;
    }
  };

  const setFieldValue = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (value, field, langCode = null) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: langCode ? { ...prev[field], [langCode]: value } : value,
    }));
  };

  const handleFileChange = (event, field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.files[0],
    }));
  };

  const getFieldProps = (fieldName, langCode = null, isFile = false) => {
    return {
      name: fieldName,
      value: langCode
        ? formValues[fieldName][langCode] || ""
        : formValues[fieldName] || "",
      onChange: isFile
        ? (event) => handleFileChange(event, fieldName)
        : (event) => handleInputChange(event.target.value, fieldName, langCode),
      onBlur: () => validate(),
      error: errors[fieldName],
    };
  };

  return {
    formValues,
    errors,
    touched,
    validate,
    setFieldValue,
    handleInputChange,
    handleFileChange,
    getFieldProps,
  };
};

export default useForm;
