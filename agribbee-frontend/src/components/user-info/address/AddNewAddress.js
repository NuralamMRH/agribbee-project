import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "react-query";
import { ButtonBox } from "./Address.style";
import MenuItem from "@mui/material/MenuItem";
import { ProfileApi } from "@/hooks/react-query/config/profileApi";
import { AddressApi } from "@/hooks/react-query/config/addressApi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import AddressForm from "./AddressForm";
import { onErrorResponse } from "../../ErrorResponse";
// import { setLocation } from "@/redux/slices/addressData";
import { useTheme } from "@mui/material/styles";
import { RTL } from "../../RTL/RTL";
import { PrimaryButton } from "../../products-page/AuctionTabContainer";
import CreateIcon from "@mui/icons-material/Create";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { setGuestUserInfo } from "@/redux/slices/guestUserInfo";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import MapWithSearchBox from "../../google-map/MapWithSearchBox";
import { useFormik } from "formik";
import ValidationSchemaForAddAddress from "./ValidationSchemaForAddAddress";
import SellerJoinMapBlock from "@/components/join-seller/SellerJoinMapBlock";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "1080px",
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 24,
  borderRadius: "10px",
};
const AddNewAddress = ({
  refetch,
  buttonbg,
  guestUser,
  orderType,
  setOpenGuestUserModal,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { global } = useSelector((state) => state.globalSettings);
  const [label, setLabel] = useState("Home");

  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
  });
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState({ description: "" });
  const [value, setValue] = useState();
  const { token } = useSelector((state) => state.userToken);
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isError } = useQuery(["profile-info"], ProfileApi.profileInfo);
  const clickAddNew = () => {
    if (guestUser) {
      setOpenGuestUserModal(true);
    } else {
      setOpen(true);
    }
  };
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const contractPhone = guestUserInfo?.phone;
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const addAddressFormik = useFormik({
    initialValues: {
      address: "",
      address_type: "",
      address_label: "",
      contact_person_name: "",
      contact_person_number: contractPhone ? contractPhone : "",
      lat: "",
      lng: "",
      road: "",
      house: "",
      floor: "",
      country: "",
      region: "",
      city: "",
      zip: "",
    },
    validationSchema: ValidationSchemaForAddAddress(),
    onSubmit: async (values) => {
      try {
        let newData = {
          ...values,
          address_type: handleEditAddressLabel(
            addAddressFormik.values.address_label
          ),
        };
        formSubmitOnSuccess(newData);
      } catch (err) {
        console.log(err);
      }
    },
  });
  const formSubmitOnSuccess = (values) => {
    formSubmitHandler(values);
  };

  const handleEditAddressLabel = (label) => {
    if (label === "Home" || label === "Office") {
      return label;
    } else {
      return "Warehouse";
    }
  };

  const { mutate, isLoading, error } = useMutation(
    "address-add",
    AddressApi.addNewAddress,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);

        if (response?.data) {
          refetch();
          setOpen(false);
        }
      },
      onError: (error) => {
        onErrorResponse(error);
      },
    }
  );
  const formSubmitHandler = (values) => {
    if (token) {
      mutate(values);
    } else {
      dispatch(setGuestUserInfo(values));
      setOpen(false);
    }
  };

  const countryHandler = async (value) => {
    addAddressFormik.setFieldValue("country", value);
  };

  const regionHandler = async (value) => {
    addAddressFormik.setFieldValue("region", value);
  };

  const handleOnChangeCity = async (value) => {
    addAddressFormik.setFieldValue("city", value);
  };

  const handleLatLngUpdateFields = (lngLat) => {
    console.log("Current Locations: ", lngLat);
    addAddressFormik.setFieldValue("lat", parseFloat(lngLat?.lat));
    addAddressFormik.setFieldValue("lng", parseFloat(lngLat?.lng));
  };

  const languageDirection = localStorage.getItem("direction");
  const primaryColor = theme.palette.primary.main;
  const whiteColor = theme.palette.whiteContainer.main;
  return (
    <>
      {guestUser === "true" ? (
        <IconButton onClick={clickAddNew} padding="0px">
          <CreateIcon
            sx={{
              width: "18px",
              height: "20px",
              color: (theme) => theme.palette.primary.main,
            }}
          />
        </IconButton>
      ) : (
        <PrimaryButton
          variant={buttonbg === "true" ? "" : "outlined"}
          sx={{
            borderRadius: buttonbg === "true" ? "5px" : "20px",
            minWidth: "0",
            justifyContent: "left",
            padding: isXs
              ? "5px"
              : buttonbg === "true"
                ? "5px 0px"
                : "5px 10px",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.neutral[100],
            },
          }}
          onClick={clickAddNew}
          backgroundColor={buttonbg === "true" ? "" : ""}
        >
          <Stack
            direction="row"
            spacing={0.5}
            color={theme.palette.neutral[1000]}
            alignItems="center"
            justifyContent="center"
          >
            {buttonbg === "true" && (
              <AddCircleOutlineIcon
                style={{
                  width: "18px",
                  height: "18px",
                  color: primaryColor,
                }}
              />
            )}
            <Typography
              fontSize={{
                xs: "12px",
                sm: "12px",
                md: buttonbg === "true" ? "12px" : "14px",
              }}
              fontWeight={buttonbg === "true" ? "500" : "400"}
              color={
                buttonbg === "true"
                  ? (theme) => theme.palette.primary.main
                  : (theme) => theme.palette.primary.main
              }
            >
              {t("Add Address")}
            </Typography>

            {buttonbg !== "true" && (
              <AddLocationIcon
                style={{
                  width: "18px",
                  height: "18px",
                  color: buttonbg === "true" ? whiteColor : primaryColor,
                }}
              />
            )}
          </Stack>
        </PrimaryButton>
      )}

      {open && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Stack
            sx={style}
            width={{ xs: "90%", sm: "70%" }}
            spacing={2}
            padding={{ xs: "10px", md: "25px" }}
          >
            <button onClick={() => setOpen(false)} className="closebtn">
              <CloseIcon sx={{ fontSize: "16px" }} />
            </button>

            <RTL direction={languageDirection}>
              <CustomStackFullWidth
                flexDirection={{ xs: "column", sm: "row" }}
                gap={{ xs: "10px", md: "15px" }}
              >
                <CustomStackFullWidth spacing={1} gap="12px">
                  <SellerJoinMapBlock
                    location={location}
                    setLocation={setLocation}
                    countryHandler={countryHandler}
                    regionHandler={regionHandler}
                    handleOnChangeCity={handleOnChangeCity}
                    formData={addAddressFormik}
                    handleLatLngUpdateFields={handleLatLngUpdateFields}
                    height={isSmall || "448px"}
                  />
                </CustomStackFullWidth>
                <AddressForm
                  personName={data?.f_name}
                  phone={data?.phone}
                  lat={location?.lat || ""}
                  lng={location?.lng || ""}
                  isLoading={isLoading}
                  setLabel={setLabel}
                  addAddressFormik={addAddressFormik}
                  deliveryAddress={""}
                  label={label}
                />
              </CustomStackFullWidth>
            </RTL>
          </Stack>
        </Modal>
      )}
    </>
  );
};

export default React.memo(AddNewAddress);
