import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { onErrorResponse } from "../../ErrorResponse";
import { Grid, IconButton, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { RTL } from "@/components/RTL/RTL";
import { MarketsApiNearBy } from "@/hooks/react-query/market/getNearByMarkets";
import MapComponentFindNearMarket from "./MapComponentFindNearMarket";
import CityMarkets from "./CityMarkets";

const NearByMarkets = ({ markets, zipCode, location }) => {
  const theme = useTheme();
  const router = useRouter();
  const offset = 1;
  const page_limit = 20;
  const searchKey = "";
  //   let currentLocation = undefined;
  let languageDirection = undefined;
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const selectedMarketRef = useRef(null);
  const [cityMarkets, setCityMarkets] = useState(markets);
  const [allMarkets, setAllMarkets] = useState(markets);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  if (typeof window !== "undefined") {
    languageDirection = localStorage.getItem("direction");
  }

  const { isLoading, data, isError, error, refetch, isRefetching } = useQuery(
    [offset, page_limit],
    () =>
      MarketsApiNearBy.markets({
        offset,
        page_limit,
        searchKey,
      }),
    {
      onError: onErrorResponse,
      enabled: false,
      onSuccess: (fetchData) => {
        // setCityMarkets(fetchData?.data?.markets);
        // setAllMarkets(fetchData?.data?.markets);
      },
    }
  );
  const handleRouteToMarket = (market) => {
    router.push({
      pathname: `/market/[id]`,
      query: {
        id: `${market?.slug ? market?.slug : market?.id}`,
        market_zone_id: market?.address?.city?.zip,
      },
    });
  };

  useEffect(async () => {
    await refetch();
  }, []);

  const customMapStyle = {
    width: "100%",
    height: isXSmall ? "55vh" : "67vh",
    borderRadius: isXSmall ? "0px" : "8px 0 0 8px",
  };

  // console.log(`Location Lat: ${location.lat} Location Lng: ${location.lng}`);
  // console.log(`Markets in NearbyFind: ${data}`);

  return (
    <RTL direction={languageDirection}>
      <Grid container>
        <Grid item xs={12} sm={6.5} md={7.5}>
          <Stack borderRadius="8px">
            <MapComponentFindNearMarket
              handleRouteToMarket={handleRouteToMarket}
              zipCode={zipCode}
              location={location}
              data={cityMarkets}
              customMapStyle={customMapStyle}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredMarkerId={setHoveredMarkerId}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5.5} md={4.5}>
          <CityMarkets
            markets={cityMarkets}
            allMarkets={allMarkets}
            setMarkets={setCityMarkets}
            setAllMarkets={setAllMarkets}
            isLoading={isRefetching}
            selectedMarketRef={selectedMarketRef}
            handleClickOnMarket={handleRouteToMarket}
            hoveredMarkerId={hoveredMarkerId}
          />
        </Grid>
      </Grid>
    </RTL>
  );
};

export default NearByMarkets;
