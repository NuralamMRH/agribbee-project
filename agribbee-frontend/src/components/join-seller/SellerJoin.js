import React, { useEffect } from "react";
import {
  CustomPaperBigCard,
  FlexContainerCenter,
} from "../../styled-components/CustomStyles.style";
import SellerJoinForm from "./SellerJoinForm";
import { useGetZone } from "../../hooks/react-query/config/get-zone/useGetZone";
import { useSellerJoin } from "../../hooks/react-query/config/seller-store/useSellerStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { onErrorResponse } from "../ErrorResponse";
import SellerJoinShimmer from "./SellerJoinShimmer";
import CustomContainer from "../container";
import { useSelector } from "react-redux";
import { getAmount } from "@/utils/customFunctions";
import { useGetRegion } from "@/hooks/react-query/config/get-region/useGetRegion";

const SellerJoin = () => {
  const router = useRouter();
  const { refetch, data: regionData } = useGetRegion();
  const { t } = useTranslation();
  const theme = useTheme();
  const { isLoading, mutate, onError } = useSellerJoin();
  const { userData } = useSelector((state) => state.user);
  let zoneid = undefined;

  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }

  //   console.log(data);

  useEffect(async () => {
    await refetch();
  }, []);
  const formSubmit = (values) => {
    console.log("Seller account submit handler worked");
    const onSuccessHandler = (resData) => {
      console.log("Seller account resData", resData);
      toast.success(resData.message);
      router.push("/interest", {
        query: { from: "welcome" },
      });
    };
    mutate(values, {
      onSuccess: onSuccessHandler,
      onError: onErrorResponse,
    });
  };

  console.log("zoneid: ", zoneid);

  return (
    <CustomContainer>
      <FlexContainerCenter
        sx={{
          my: { xs: "5rem", md: zoneid ? "12rem" : "12rem" },
          px: { xs: "10px", md: "20px" },
        }}
      >
        <CustomPaperBigCard
          sx={{
            paddingX: { xs: "10px", md: "20px" },
          }}
        >
          {userData && userData?.user && userData?.user?.membership ? (
            <>
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "26px" },
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: theme.palette.primary.main,
                }}
              >{` ${userData?.user?.membership?.name} ${t("Registration")}`}</Typography>
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: theme.palette.primary.blue,
                }}
              >
                {userData?.user?.membership?.tagLine}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "12px" },
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {`${t("Plan Type:")} ${userData?.user?.membership?.subs_by}`}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "12px" },
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {`${t("Cost per")} ${userData?.user?.membership?.subs_by}: ${getAmount(userData?.user?.membership?.price, "left", "VND", 0)}`}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "12px" },
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {`${t("Trial period:")} ${userData?.user?.membership?.trial_period} ${t("days")}`}
              </Typography>
            </>
          ) : null}

          {regionData ? (
            <SellerJoinForm formSubmit={formSubmit} isLoading={isLoading} />
          ) : (
            <SellerJoinShimmer />
          )}
        </CustomPaperBigCard>
      </FlexContainerCenter>
    </CustomContainer>
  );
};
export default SellerJoin;
