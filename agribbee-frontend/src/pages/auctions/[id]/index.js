import React, { useEffect } from "react";
import RestaurantDetails from "../../../components/restaurant-details/RestaurantDetails";
import Meta from "../../../components/Meta";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CustomHeader } from "../../../api/Headers";
import { setGlobalSettings } from "@/redux/slices/global";
import MainApix from "@/api/MainApix";
import AuctionDetails from "@/components/auction-details/AuctionDetails";
import { Typography } from "@mui/material";

const index = ({ auctionData, configData }) => {
  const { global } = useSelector((state) => state.globalSettings);
  const productCoverUrl = global?.base_urls?.product_image_path;
  const auctionCoverPhoto = `${productCoverUrl}/${auctionData?.image || auctionData.product?.image}`;
  const router = useRouter();
  const dispatch = useDispatch();

  const { restaurant_zone_id } = router.query;
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  let zoneId = undefined;
  if (typeof window !== "undefined") {
    zoneId = localStorage.getItem("zoneid");

    //hostname = window.location.hostnam
  }
  useEffect(() => {
    dispatch(setGlobalSettings(configData));
  }, []);

  useEffect(() => {
    if (!zoneId) {
      localStorage.setItem(
        "zoneid",
        JSON.stringify([Number(restaurant_zone_id)])
      );
    }
  }, [restaurant_zone_id]);

  return (
    <>
      <Meta
        title={`${auctionData?.name ?? auctionData.name} - ${
          configData?.business_name
        }`}
        ogImage={auctionCoverPhoto}
        description={auctionData?.introduction}
      />
      <AuctionDetails
        auction={auctionData}
        auctionType={auctionData?.auction_type}
      />
    </>
  );
};

export default index;
export const getServerSideProps = async (context) => {
  const id = context.query.id;
  console.log(id);
  const { req } = context;
  const language = req.cookies.languageSetting;
  const data = await MainApix.get(`/api/v1/auctions/${id}`);
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();
  return {
    props: {
      auctionData: data.data,
      configData: config,
    },
  };
};
