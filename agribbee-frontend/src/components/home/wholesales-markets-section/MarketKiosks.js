import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import {
  CircularProgress,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import CustomEmptyResult from "@/components/empty-view/CustomEmptyResult";
import { noRestaurantsImage } from "@/utils/LocalImages";
import MarketBoxCard from "@/components/market/MarketBoxCard";
import SearchRestaurent from "../visit-again/SearchRestaurent";
import KioskBoxCard from "@/components/kiosk/KioskBoxCard";

const MarketKiosks = ({
  kiosks,
  allKiosks,
  setKiosks,
  isLoading,
  selectedKioskRef,
  handleClickOnKiosk,
}) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { global } = useSelector((state) => state.globalSettings);
  const [searchTerm, setSearchTerm] = useState("");

  const forSmallDevice = {
    height: "100%",
    width: "100%",
  };
  const forLargeDevice = {
    maxHeight: "55vh",
  };

  return (
    <CustomStackFullWidth
      padding={{ xs: "20px", sm: "10px 0 0 10px", md: "20px 0 0 20px" }}
      borderRadius="8px"
      gap="20px"
    >
      <Stack pr={!isXSmall && "30px"}>
        <SearchRestaurent
          restaurants={kiosks}
          setRestaurants={setKiosks}
          allRestaurants={allKiosks}
          placeholder={`${t("Search kiosks....")}`}
        />
      </Stack>
      {isLoading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          minHeight={isXSmall ? "210px" : "55vh"}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <SimpleBar style={isXSmall ? forSmallDevice : forLargeDevice}>
          <CustomStackFullWidth
            paddingBlock={isXSmall && "10px"}
            gap="20px"
            flexDirection={isXSmall ? "row" : "column"}
            ref={selectedKioskRef}
          >
            {kiosks?.length === 0 ? (
              <CustomStackFullWidth alignItems="center" justifyContent="center">
                <CustomEmptyResult
                  height="150px"
                  width="150px"
                  image={noRestaurantsImage}
                  label="No Restaurants Found"
                />
              </CustomStackFullWidth>
            ) : (
              <>
                {kiosks?.map((kioskData, index) => {
                  return (
                    <KioskBoxCard
                      // className={isSmall? "" : (index === imageIndex ? "custom-active-slide" : "custom-slide")}

                      id={kioskData._id}
                      image={kioskData?.image}
                      name={kioskData?.name}
                      kioskImagePath={global?.base_urls?.seller_image_path}
                      handleClickOnKiosk={handleClickOnKiosk}
                    />
                  );
                })}
              </>
            )}
          </CustomStackFullWidth>
        </SimpleBar>
      )}
    </CustomStackFullWidth>
  );
};

export default MarketKiosks;
