import Router from "next/router";

import { setWelcomeModal } from "@/redux/slices/utils";
import { removeToken } from "../redux/slices/userToken";
import { store } from "../redux/store";
import {
  CustomToaster,
  CustomToasterTokenExpired,
} from "./custom-toaster/CustomToaster";
const handleTokenExpire = (status) => {
  if (status === 401) {
    if (window?.localStorage.getItem("token")) {
      CustomToasterTokenExpired(
        "Session Time Out",
        "Though it is a development site, our system automatically reset after one hour and that’s why you logged out"
      );
      window?.localStorage.removeItem("token");
      store.dispatch(removeToken());
      store.dispatch(setWelcomeModal(false));
      Router.push("/home");
    }
  }
};

const handle404 = () => {
  CustomToaster("error", "404 not found.");
  Router.push("/404");
};

export const onErrorResponse = (error) => {
  error?.response?.data?.errors?.forEach((item) => {
    CustomToaster("error", item?.errMessage);
    console.log("ErrorResponse: ", item?.errMessage);
  });
  // handleTokenExpire(error?.response?.status);
};
export const onSingleErrorResponse = (error) => {
  const message = error?.response?.data;
  if (message?.errMessage) {
    CustomToaster("error", message?.errMessage);
  } else {
    CustomToaster("Error: ", error);
  }
};
