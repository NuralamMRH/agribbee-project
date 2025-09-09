import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { GoogleApi } from "../../hooks/react-query/config/googleApi";
import GoogleMapComponent from "../landingpage/google-map/GoogleMapComponent";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomSelectWithFormik from "../custom-select/CustomSelectWithFormik";
import { useGetCountry } from "@/hooks/react-query/config/get-country/useGetCountry";
import { CitiesApi } from "@/hooks/react-query/config/cityApi";
import { MarketsApi } from "@/hooks/react-query/config/marketApi";
import { RegionsApi } from "@/hooks/react-query/config/regionApi";
import SellerJoinMapBlock from "./SellerJoinMapBlock";
import { setFeaturedCategories } from "@/redux/slices/storedData";
import { useGetCategory } from "@/hooks/react-query/interest/useGetCategory";
import InterestShimmer from "../interest/InterestShimmer";
import CustomImageContainer from "../CustomImageContainer";
import { CustomTypography } from "../custom-tables/Tables.style";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style";

const MapForSellerJoin = ({ formData }) => {
  const { global } = useSelector((state) => state.globalSettings);
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
  });
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [markets, setMarkets] = useState([]);

  const { refetch: getCountries, data: countriesData } = useGetCountry();

  const { featuredCategories } = useSelector((state) => state.storedData);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const onSuccessHandler = (data) => {
    dispatch(setFeaturedCategories(data));
    //setCategoryList(response)
  };
  const { refetch: getCategories } = useGetCategory(onSuccessHandler);
  useEffect(async () => {
    if (featuredCategories?.response?.length === 0) {
      await getCategories();
    }
  }, []);

  // Fetch country-based regions when country changes
  const getRegions = useCallback(async () => {
    const response = await RegionsApi.countryRegions(formData.values.country);
    setRegions(response.data?.regions || []);
  }, [formData.values.country]);

  // Fetch region-based cities when region changes
  const getCities = useCallback(async () => {
    const response = await CitiesApi.region(formData.values.region);
    setCities(response.data?.cities || []);
  }, [formData.values.region]);

  // Fetch city-based markets when city changes
  const getMarkets = useCallback(async () => {
    const response = await MarketsApi.marketsUnderCity(formData.values.city);
    setMarkets(response.data?.markets || []);
  }, [formData.values.city]);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (formData.values.country) getRegions();
  }, [formData.values.country, getRegions]);

  useEffect(() => {
    if (formData.values.region) getCities();
  }, [formData.values.region, getCities]);

  useEffect(() => {
    if (formData.values.city) getMarkets();
  }, [formData.values.city, getMarkets]);

  const handleOnChangeMarket = (value) => {
    console.log("onChangeMarket", value);
    console.log("Market ID", formData.values.market);
    formData.setFieldValue("market", value);
    const market = markets.find((m) => m._id === value);
    console.log("market info", market);
    if (market?.location) {
      const coordinates = market?.location?.coordinates;
      setLocation({
        lat: coordinates[1] ? parseFloat(coordinates[1]) : 0, // Use fallback values if invalid
        lng: coordinates[0] ? parseFloat(coordinates[0]) : 0,
      });
    }
  };

  const countryHandler = async (value) => {
    formData.setFieldValue("country", value);
    setRegions([]);
    setCities([]);
    setMarkets([]);
    await getRegions(); // Fetch regions based on selected country
  };

  const regionHandler = async (value) => {
    formData.setFieldValue("region", value);
    setCities([]);
    setMarkets([]);
    await getCities(); // Fetch cities based on selected region
  };

  const handleOnChangeCity = async (value) => {
    formData.setFieldValue("city", value);
    setMarkets([]);
    if (userData?.membership?.user_role === "kiosk") await getMarkets(); // Update markets when city changes
  };

  const handleLatLngUpdateFields = (lngLat) => {
    console.log("Current Locations: ", lngLat);
    formData.setFieldValue("lat", parseFloat(lngLat?.lat));
    formData.setFieldValue("lng", parseFloat(lngLat?.lng));
  };

  return (
    <Grid container spacing={3}>
      {/* Country Select */}
      <Grid item xs={12} sm={6} md={6}>
        <CustomSelectWithFormik
          selectFieldData={(countriesData?.countries || []).map((country) => ({
            label: country.name,
            value: country._id,
          }))}
          inputLabel="Country"
          passSelectedValue={countryHandler}
          fieldProps={formData.getFieldProps("country")}
        />
      </Grid>

      {/* Region Select */}
      <Grid item xs={12} sm={6} md={6}>
        <CustomSelectWithFormik
          selectFieldData={regions.map((region) => ({
            label: region.name,
            value: region._id,
          }))}
          inputLabel="Region"
          passSelectedValue={regionHandler}
          fieldProps={formData.getFieldProps("region")}
        />
      </Grid>

      {/* City Select */}
      <Grid item xs={12}>
        <CustomSelectWithFormik
          selectFieldData={cities.map((city) => ({
            label: `${city.name} zip: ${city?.zip}`,
            value: city._id,
          }))}
          inputLabel="City"
          passSelectedValue={handleOnChangeCity}
          fieldProps={formData.getFieldProps("city")}
        />
      </Grid>

      {/* Market Select */}
      {userData?.membership?.user_role === "kiosk" && (
        <>
          <Grid item xs={12} sm={6} md={6}>
            <CustomSelectWithFormik
              selectFieldData={markets.map((market) => ({
                label: market.name,
                value: market._id,
              }))}
              inputLabel="Market"
              passSelectedValue={handleOnChangeMarket}
              fieldProps={formData.getFieldProps("market")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextFieldWithFormik
              type="Building"
              label="Building"
              touched={formData.touched.building}
              errors={formData.errors.building}
              fieldProps={formData.getFieldProps("building")}
              onChangeHandler={(e) =>
                formData.setFieldValue("building", e.target.value)
              }
              value={formData.values.building || ""}
            />
          </Grid>
        </>
      )}

      {/* Google Map */}
      <Grid item xs={12} md={12}>
        <SellerJoinMapBlock
          location={location}
          setLocation={setLocation}
          markets={userData?.membership?.user_role === "kiosk" && markets}
          marketId={
            userData?.membership?.user_role === "kiosk" &&
            formData.values.market
          }
          handleOnClickMapMarket={handleOnChangeMarket}
          countryHandler={countryHandler}
          regionHandler={regionHandler}
          handleOnChangeCity={handleOnChangeCity}
          formData={formData}
          handleLatLngUpdateFields={handleLatLngUpdateFields}
        />
      </Grid>

      {/* Latitude & Longitude Display */}
      <Grid item xs={12} sm={6} md={6}>
        <CustomTextFieldWithFormik
          type="text"
          label="Latitude"
          touched={formData.touched.lat}
          errors={formData.errors.lat}
          fieldProps={formData.getFieldProps("lat")}
          onChangeHandler={(e) => formData.setFieldValue("lat", e.target.value)}
          value={formData.values.lat || ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <CustomTextFieldWithFormik
          type="text"
          label="Longitude"
          touched={formData.touched.lng}
          errors={formData.errors.lng}
          fieldProps={formData.getFieldProps("lng")}
          onChangeHandler={(e) => formData.setFieldValue("lng", e.target.value)}
          value={formData.values.lng || ""}
        />
      </Grid>

      <Grid container item xs={12} sm={12} md={12} spacing={2}>
        {featuredCategories?.response?.length > 0 ? (
          featuredCategories?.response.map((item, index) => {
            return (
              <Grid
                key={index}
                onClick={() =>
                  formData.setFieldValue("seller_category", item?._id)
                }
                item
                xs={6}
                sm={3}
                md={2}
                lg={2}
                align="center"
                sx={{
                  cursor: "pointer",
                }}
              >
                <CustomPaperBigCard
                  padding=".5rem"
                  sx={{
                    border:
                      item._id === formData.values.seller_category
                        ? "2px solid"
                        : "2px solid",
                    borderColor:
                      item._id === formData.values.seller_category
                        ? "primary.main"
                        : "#fff",
                  }}
                >
                  <CustomStackFullWidth spacing={1}>
                    <CustomImageContainer
                      height={isSmall ? "100px" : "150px"}
                      width="100%"
                      src={`${global?.base_urls?.category_image_path}/${item.image}`}
                    />
                    <CustomTypography>{item.name}</CustomTypography>
                  </CustomStackFullWidth>
                </CustomPaperBigCard>
              </Grid>
            );
          })
        ) : (
          <InterestShimmer />
        )}
      </Grid>
    </Grid>
  );
};

export default MapForSellerJoin;
