import CustomShimmerCard from "@/components/customShimmerForProfile/CustomShimmerCard";
import { MarketsApi } from "@/hooks/react-query/config/marketApi";
import { RegionsApi } from "@/hooks/react-query/config/regionApi";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

function WholesaleMarketListBottom() {
  const [regions, setRegions] = useState([]);

  const [region1markets, setRegion1markets] = useState([]);
  const [region2markets, setRegion2markets] = useState([]);
  const [region3markets, setRegion3markets] = useState([]);

  // Function to fetch markets for each region and update state
  const markets = async () => {
    try {
      const allRegions = await RegionsApi.regions();

      setRegions(allRegions);

      const region1Markets = await MarketsApi.regionWiseMarketList(
        "66e480ec5f5cd8b3cc32dc8a"
      );
      const region2Markets = await MarketsApi.regionWiseMarketList(
        "66e482a25f5cd8b3cc32dc9b"
      );
      const region3Markets = await MarketsApi.regionWiseMarketList(
        "66e2eead48be8cecc559d0d5"
      );

      // Update state with the fetched Markets

      setRegion1markets(region1Markets);
      setRegion2markets(region2Markets);
      setRegion3markets(region3Markets);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  // Call the markets function when the component mounts
  useEffect(async () => {
    await markets(); // Call the function
  }, []);

  return (
    <Grid>
      <Grid alignItems="start">
        <Grid
          sx={{
            textTransform: "capitalize",
            background: (theme) => theme.palette.background.lightBlue,
            padding: { xs: "10px 20px", md: "15px 25px" },
          }}
        >
          <Typography
            fontSize={{ xs: "14px", md: "16px" }}
            fontWeight={{ xs: "600", md: "700" }}
            color={(theme) => theme.palette.text.dark}
          >
            {regions?.data?.regions?.map((region) =>
              region?.position === "1" ? region?.name : ""
            )}
          </Typography>
        </Grid>

        {region1markets?.data?.markets?.length > 0 ? (
          <Grid
            sx={{
              display: "column",
            }}
            flexWrap={"wrap"}
          >
            {region1markets?.data?.markets?.slice(0, 3).map((item) => (
              <Grid
                item
                key={item._id}
                sx={{ display: "flex", gap: "5px", margin: "10px 0" }}
              >
                <ArrowCircleRightIcon
                  sx={{
                    fontSize: { xs: "15px", md: "24px" },
                    color: (theme) => theme.palette.primary.blue,
                  }}
                />
                <Typography
                  key={item}
                  fontSize={{ xs: "12px", md: "14px" }}
                  fontWeight={{ xs: "500", md: "600" }}
                  color={(theme) => theme.palette.text.gray2}
                >
                  {item.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <CustomShimmerCard
            noSearchShimmer="true"
            itemCount="5"
            smItemCount="5"
          />
        )}
      </Grid>
      {/* FIrst region close  */}
      <Grid alignItems="start">
        <Grid
          sx={{
            textTransform: "capitalize",
            background: (theme) => theme.palette.background.lightBlue,
            padding: { xs: "10px 20px", md: "15px 25px" },
          }}
        >
          <Typography
            fontSize={{ xs: "14px", md: "16px" }}
            fontWeight={{ xs: "600", md: "700" }}
            color={(theme) => theme.palette.text.dark}
          >
            {regions?.data?.regions?.map((region) =>
              region?.position === "2" ? region?.name : ""
            )}
          </Typography>
        </Grid>

        {region2markets?.data?.markets?.length > 0 ? (
          <Grid
            sx={{
              display: "column",
            }}
            flexWrap={"wrap"}
          >
            {region2markets?.data?.markets?.slice(0, 3).map((item) => (
              <Grid
                item
                key={item._id}
                sx={{ display: "flex", gap: "5px", margin: "10px 0" }}
              >
                <ArrowCircleRightIcon
                  sx={{
                    fontSize: { xs: "15px", md: "24px" },
                    color: (theme) => theme.palette.primary.blue,
                  }}
                />
                <Typography
                  fontSize={{ xs: "12px", md: "14px" }}
                  fontWeight={{ xs: "500", md: "600" }}
                  color={(theme) => theme.palette.text.gray2}
                >
                  {item.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <CustomShimmerCard
            noSearchShimmer="true"
            itemCount="5"
            smItemCount="5"
          />
        )}
      </Grid>
      {/* Second Region close */}

      <Grid alignItems="start">
        <Grid
          sx={{
            textTransform: "capitalize",
            background: (theme) => theme.palette.background.lightBlue,
            padding: { xs: "10px 20px", md: "15px 25px" },
          }}
        >
          <Typography
            fontSize={{ xs: "14px", md: "16px" }}
            fontWeight={{ xs: "600", md: "700" }}
            color={(theme) => theme.palette.text.dark}
          >
            {regions?.data?.regions?.map((region) =>
              region?.position === "3" ? region?.name : ""
            )}
          </Typography>
        </Grid>

        {region3markets?.data?.markets?.length > 0 ? (
          <Grid
            sx={{
              display: "column",
            }}
            flexWrap={"wrap"}
          >
            {region3markets?.data?.markets?.slice(0, 5).map((item) => (
              <Grid sx={{ display: "flex", gap: "5px", margin: "10px 0" }}>
                <ArrowCircleRightIcon
                  sx={{
                    fontSize: { xs: "15px", md: "24px" },
                    color: (theme) => theme.palette.primary.blue,
                  }}
                />
                <Typography
                  key={item}
                  fontSize={{ xs: "12px", md: "14px" }}
                  fontWeight={{ xs: "500", md: "600" }}
                  color={(theme) => theme.palette.text.gray2}
                >
                  {item.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <CustomShimmerCard
            noSearchShimmer="true"
            itemCount="5"
            smItemCount="5"
          />
        )}
      </Grid>
    </Grid>
  );
}

export default WholesaleMarketListBottom;
