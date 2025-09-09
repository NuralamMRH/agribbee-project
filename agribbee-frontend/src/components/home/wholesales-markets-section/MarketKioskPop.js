import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import { Grid, IconButton, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

import { RTL } from "@/components/RTL/RTL";
import CityMarkets from "./CityMarkets";
import MarketKiosks from "./MarketKiosks";

const MarketKioskPop = ({
  markets,
  marketDataLoading,
  handleClickMarket,
  kioskDataLoading,
  kiosks,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const offset = 1;
  const page_limit = 20;
  const type = "all";
  const filterType = "all";
  const searchKey = "";
  let currentLocation = undefined;
  let languageDirection = undefined;
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const selectedMarketRef = useRef(null);
  const [cityMarkets, setCityMarkets] = useState(markets);
  const [allMarkets, setAllMarkets] = useState(markets);
  const [marketKiosks, setMarketKiosks] = useState(kiosks);
  const [allMarketKiosks, setAllMarketKiosks] = useState(kiosks);

  if (typeof window !== "undefined") {
    languageDirection = localStorage.getItem("direction");
  }
  if (typeof window !== "undefined") {
    currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
    //hostname = window.location.hostnam
  }

  const handleRouteToKiosk = (kiosk) => {
    router.push({
      pathname: `/restaurant/[id]`,
      query: {
        id: `${kiosk?.slug ? kiosk?.slug : kiosk?.id}`,
      },
    });
  };

  return (
    <RTL direction={languageDirection}>
      <Grid container>
        <Grid item xs={12} sm={6.5} md={7.5}>
          <Stack borderRadius="8px">
            <CityMarkets
              markets={cityMarkets}
              allMarkets={allMarkets}
              setMarkets={setCityMarkets}
              setAllMarkets={setAllMarkets}
              isLoading={marketDataLoading}
              selectedMarketRef={selectedMarketRef}
              handleClickOnMarket={handleClickMarket}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5.5} md={4.5}>
          <MarketKiosks
            kiosks={marketKiosks}
            allKiosks={allMarketKiosks}
            isLoading={kioskDataLoading}
            setKiosks={setMarketKiosks}
            setAllMarketKiosks={setAllMarketKiosks}
            handleClickOnKiosk={handleRouteToKiosk}
          />
        </Grid>
      </Grid>
    </RTL>
  );
};

export default MarketKioskPop;
