import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style";
import { CustomTypography } from "../../custom-tables/Tables.style";
import {
  Box,
  IconButton,
  Modal,
  Popover,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import DeleteAddress from "./DeleteAddress";
import { alpha } from "@material-ui/core";
import { CustomDivWithBorder } from "./Address.style";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DeleteIcon from "../../../assets/images/icons/DeleteIcon";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import CustomPopover from "../../custom-popover/CustomPopover";
import { RTL } from "../../RTL/RTL";
import MapWithSearchBox from "../../google-map/MapWithSearchBox";
import AddressForm from "./AddressForm";
import { useMutation, useQuery } from "react-query";
import { AddressApi } from "@/hooks/react-query/config/addressApi";
import { useDispatch, useSelector } from "react-redux";
import { ProfileApi } from "@/hooks/react-query/config/profileApi";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
// import { setLocation } from "@/redux/slices/addressData";
import { onErrorResponse } from "@/components/ErrorResponse";
import { setGuestUserInfo } from "@/redux/slices/guestUserInfo";
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

const AddressCard = ({ address, refetch }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addressSymbol, setAddressSymbol] = useState("");
  const [label, setLabel] = useState("Home");
  const [editAddress, setEditAddress] = useState(false);

  const isGps = true;

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const languageDirection = localStorage.getItem("direction");
  const { token } = useSelector((state) => state.userToken);
  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
  });
  const { data, isError } = useQuery(["profile-info"], ProfileApi.profileInfo);

  useEffect(() => {
    if (editAddress) {
      if (address?.address_type === "Home") {
        setLabel("Home");
      } else if (address?.address_type === "Office") {
        setLabel("Office");
      } else {
        setLabel("Warehouse");
      }
    } else {
      setLabel("Home");
    }
  }, []);

  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const personName = address?.contact_person_name;
  const contractPhone = guestUserInfo?.phone;

  const addAddressFormik = useFormik({
    initialValues: {
      address: editAddress ? address?.address : "",
      address_type: editAddress ? address?.address_type : "",
      address_label: editAddress ? address.address_type : "",
      contact_person_name: editAddress
        ? address?.contact_person_name
        : guestUserInfo
          ? guestUserInfo?.contact_person_name
          : personName
            ? personName
            : "",
      contact_person_number: editAddress
        ? address?.contact_person_number
        : guestUserInfo
          ? guestUserInfo?.contact_person_number
          : contractPhone
            ? contractPhone
            : "",
      lat: "",
      lng: "",
      road: editAddress ? address?.road : "",
      house: editAddress ? address?.house : "",
      floor: editAddress ? address?.floor : "",
      country: editAddress ? address?.country : "",
      region: editAddress ? address?.region : "",
      city: editAddress ? address?.city : "",
      zip: editAddress ? address?.zip : "",
    },
    validationSchema: ValidationSchemaForAddAddress(),
    onSubmit: async (values) => {
      try {
        let newData = {
          ...values,
          address_type: editAddress
            ? handleEditAddressLabel(values.address_label)
            : values.address_label !== ""
              ? values?.address_label
              : label,
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
    console.log("Label received:", label); // Debug to see the input label
    if (label === "Home" || label === "Office") {
      return label;
    } else {
      return "Warehouse";
    }
  };

  useEffect(() => {
    if (address?.address_type === "Home") {
      setAddressSymbol(
        <HomeRoundedIcon
          sx={{
            width: "20px",
            height: "20px",
            color: theme.palette.customColor.twelve,
          }}
        />
      );
    } else if (address?.address_type === "Office") {
      setAddressSymbol(
        <ApartmentIcon
          sx={{
            width: "20px",
            height: "20px",
            color: theme.palette.customColor.twelve,
          }}
        />
      );
    } else {
      setAddressSymbol(
        <FmdGoodIcon
          sx={{
            width: "20px",
            height: "20px",
            color: theme.palette.customColor.twelve,
          }}
        />
      );
    }
  }, []);

  const { mutate, isLoading, error } = useMutation(
    "address-update",
    AddressApi.editAddress,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        if (response?.data) {
          refetch();
          setOpen(false);
          setEditAddress(false);
        }
      },
      onError: (error) => {
        onErrorResponse(error);
      },
    }
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditAddress = () => {
    // if (address?.location.coordinates[1] && address?.location?.coordinates[0]) {
    //   setLocation({
    //     lat: address?.location?.coordinates[1],
    //     lng: address?.location?.coordinates[0],
    //   });
    // }

    console.log(address?.location?.coordinates[1]);
    console.log(address?.location?.coordinates[0]);

    setEditAddress(true);

    setOpen(true);
  };
  const formSubmitHandler = (values) => {
    let newData = {
      ...values,
      id: address?._id,
    };
    if (token) {
      mutate(newData);
    } else {
      dispatch(setGuestUserInfo(newData));
      setOpen(false);
    }
  };
  const convertPhoneNumber = (phoneNumber) => {
    if (phoneNumber.charAt(0) === "+") {
      return phoneNumber;
    } else {
      return `+${phoneNumber}`;
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

  return (
    <CustomDivWithBorder>
      <CustomStackFullWidth spacing={1}>
        <CustomStackFullWidth
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.cardBackground1
                : theme.palette.sectionBg,
          }}
        >
          <CustomStackFullWidth
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            sx={{ padding: "5px 15px", display: "flex" }}
          >
            <Stack flexDirection="row" gap="5px" alignItems="center">
              <Box>{addressSymbol}</Box>
              <CustomTypography sx={{ textTransform: "capitalize" }}>
                {t(address?.address_type)}
              </CustomTypography>
            </Stack>
            <Stack flexDirection="row">
              <IconButton onClick={handleEditAddress}>
                <EditLocationOutlinedIcon
                  sx={{
                    fontSize: "20px",
                    color: theme.palette.customColor.two,
                  }}
                />
              </IconButton>
              <IconButton onClick={handleClick}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          spacing={1}
          sx={{ paddingX: "20px", paddingBottom: "25px" }}
        >
          {address?.address_label === "Warehouse" ? (
            <Stack direction="row" spacing={2}>
              <Typography fontSize="14px" fontWeight="500">
                {t("Label")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Typography>
              <Typography
                fontSize="14px"
                fontWeight="400"
                color={theme.palette.neutral[500]}
              >
                {address?.address_label}
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Typography fontSize="14px" fontWeight="500">
                {t("Name")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Typography>
              <Typography
                fontSize="14px"
                fontWeight="400"
                color={theme.palette.neutral[500]}
              >
                {address?.contact_person_name}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={2}>
            <Typography fontSize="14px" fontWeight="500">
              {t("Phone")}&nbsp;&nbsp;&nbsp;
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="400"
              color={theme.palette.neutral[500]}
            >
              {convertPhoneNumber(address?.contact_person_number || "")}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontSize="14px" fontWeight="500">
              {t("Address")}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="400"
              color={theme.palette.neutral[500]}
            >
              {address?.address}
            </Typography>
          </Stack>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
      <CustomPopover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleClose={handleClose}
        maxWidth="255px"
        padding="20px 35px 25px"
      >
        <DeleteAddress
          addressId={address?._id}
          refetch={refetch}
          handleClose={handleClose}
        />
      </CustomPopover>
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
                gap="15px"
              >
                <CustomStackFullWidth>
                  <SellerJoinMapBlock
                    location={location}
                    setLocation={setLocation}
                    countryHandler={countryHandler}
                    regionHandler={regionHandler}
                    handleOnChangeCity={handleOnChangeCity}
                    formData={addAddressFormik}
                    handleLatLngUpdateFields={handleLatLngUpdateFields}
                    height={isSmall && "448px"}
                  />
                </CustomStackFullWidth>

                <AddressForm
                  addAddressFormik={addAddressFormik}
                  deliveryAddress={address?.address}
                  personName={personName}
                  phone={contractPhone}
                  lat={address?.lat || address?.location?.lat || ""}
                  lng={address?.lng || address?.location?.lng || ""}
                  isLoading={isLoading}
                  editAddress={editAddress}
                  address={address}
                  label={label}
                  setLabel={setLabel}
                />
              </CustomStackFullWidth>
            </RTL>
          </Stack>
        </Modal>
      )}
    </CustomDivWithBorder>
  );
};

export default AddressCard;
