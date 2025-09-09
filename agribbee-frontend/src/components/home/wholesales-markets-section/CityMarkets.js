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

const CityMarkets = ({
  markets,
  allMarkets,
  setMarkets,
  isLoading,
  selectedMarketRef,
  handleClickOnMarket,
  hoveredMarkerId,
}) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { global } = useSelector((state) => state.globalSettings);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (hoveredMarkerId && selectedMarketRef.current) {
      const cardElement = document.getElementById(`market-${hoveredMarkerId}`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  }, [hoveredMarkerId, selectedMarketRef]);

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
          restaurants={markets}
          setRestaurants={setMarkets}
          allRestaurants={allMarkets}
          placeholder={`${t("Search markets....")}`}
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
            ref={selectedMarketRef}
            pr={!isXSmall && "30px"}
          >
            {markets?.length === 0 ? (
              <CustomStackFullWidth alignItems="center" justifyContent="center">
                <CustomEmptyResult
                  height="150px"
                  width="150px"
                  image={noRestaurantsImage}
                  label="No Markets Found"
                />
              </CustomStackFullWidth>
            ) : (
              <>
                {markets?.map((marketData, index) => (
                  <MarketBoxCard
                    // className={isSmall? "" : (index === imageIndex ? "custom-active-slide" : "custom-slide")}
                    key={marketData._id}
                    id={`market-${marketData._id}`}
                    image={marketData?.image}
                    name={marketData?.name}
                    marketImagePath={global?.base_urls?.market_image_path}
                    zone_id={marketData?.address?.city.zip}
                    handleClickOnMarket={handleClickOnMarket}
                    hoveredMarkerId={hoveredMarkerId}
                    marketCardWidth={isXSmall ? "200px" : "100%"}
                    marketCardHeight={isXSmall ? "150px" : "100%"}
                  />
                ))}
              </>
            )}
          </CustomStackFullWidth>
        </SimpleBar>
      )}
    </CustomStackFullWidth>
  );
};

export default CityMarkets;
