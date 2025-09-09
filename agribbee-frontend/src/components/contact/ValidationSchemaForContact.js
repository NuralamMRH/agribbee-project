import React from "react";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const ValidationSchemaForContact = () => {
  const { t } = useTranslation();

  return Yup.object({
    f_name: Yup.string().required(t("Name is required")),
    l_name: Yup.string().required(t("last name required")),
    phone: Yup.string().required(t("phone number required")),

    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required(t("Email is required")),

    message: Yup.string().required(t("Message is required")),
  });
};

export default ValidationSchemaForContact;
