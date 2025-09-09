import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../../components/Meta";
import { getServerSideProps } from "../index";
import { setWalletAmount } from "@/redux/slices/cart";
import { setUser } from "@/redux/slices/customer";
import { setWelcomeModal } from "@/redux/slices/utils";
import { ProfileApi } from "@/hooks/react-query/config/profileApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "@/components/ErrorResponse";
import SellerJoin from "@/components/join-seller/SellerJoin";
import { useRouter } from "next/router";

const index = (configData) => {
  const { global } = useSelector((state) => state.globalSettings);
  const businessLogo = global?.base_urls?.business_logo_path;
  const business_name = global?.business_name;
  const { userData } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.userToken);
  const router = useRouter();
  const { isLoading, data, isError, error, refetch } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onError: onSingleErrorResponse,
    }
  );
  const dispatch = useDispatch();
  if (data) {
    dispatch(setWalletAmount(data?.data?.user?.wallet_balance));
    dispatch(setUser(data?.data));
    dispatch(setWelcomeModal(true));
  }

  useEffect(() => {
    if (
      (userData?.user?.role === "seller" && userData?.user?.seller) ||
      (userData?.user?.role === "" && token === "") ||
      (token === "" && token === null)
    ) {
      // router.push("/home");
    }
  }, []);

  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res.data?.user));
    handleClose?.();
    //handleClose()
  };

  return (
    <>
      <Meta
        title={configData?.business_name}
        description={`${userData?.user?.membership?.name} Registration - ${business_name}`}
        keywords=""
        ogImage={`${businessLogo}/${global?.logo}`}
      />

      <SellerJoin />
    </>
  );
};
export default index;

export { getServerSideProps };
