import React from "react";

import Meta from "../../components/Meta";
import { Container, CssBaseline } from "@mui/material";
import { getServerSideProps } from "../index";
import AuctionsPage from "@/components/auctions-page/AuctionsPage";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <Meta title={`Auctions - ${configData?.business_name}`} />

      <AuctionsPage configData={configData} />
    </>
  );
};
export default index;
export { getServerSideProps };
