import React from "react";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const IMAGE_SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
];

const ValidationSchemaForSeller = () => {
  const { t } = useTranslation();
  const FILE_SIZE = 20000000;

  return Yup.object().shape({
    address: Yup.string().required(t("Address is required")),
    market: Yup.string().nullable(true),
    image: Yup.mixed()
      .required(t("Image is required"))
      .test(
        "fileSize",
        t("File too large"),
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        t("Unsupported format"),
        (value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
      ),
    banner: Yup.mixed()
      .required(t("Cover photo is required"))
      .test(
        "fileSize",
        t("File too large"),
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        t("Unsupported format"),
        (value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
      ),
  });
};

export default ValidationSchemaForSeller;
