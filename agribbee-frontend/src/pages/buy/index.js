import React from "react";

import AboutUs from "../../components/about-us/AboutUs";
import { useSelector } from "react-redux";
import Meta from "../../components/Meta";
import { ConfigApi } from "../../hooks/react-query/config/useConfig";
import { Container, CssBaseline } from "@mui/material";
import AboutUsPage from "../../components/about-us/AboutUsPage";
import { getServerSideProps } from "../index";
import Buy from "@/components/ecommerce/Buy";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <Meta title={`E-commerce Buy - ${configData?.business_name}`} />

      <Buy configData={configData} />
    </>
  );
};
export default index;
export { getServerSideProps };
