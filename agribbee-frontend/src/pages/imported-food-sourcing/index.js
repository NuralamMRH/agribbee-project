import React from "react";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import Meta from "../../components/Meta";
import ImportedFoodSourcing from "../../components/imported-food-sourcing/ImportedFoodSourcing";
import { getServerSideProps } from "../index";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <Meta
        title={`AgriBbee Digital Tool - ${configData?.business_name}`}
        description="AgriBbee Digital Tool helps you to publish your  organization’s website on our Agriculture Portal  in minutes"
      />
      <ImportedFoodSourcing />
    </>
  );
};
export default index;
export { getServerSideProps };
