import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { t } from "i18next";
import CustomImageContainer from "@/components/CustomImageContainer";
import CustomContainer from "@/components/container";
import { useDispatch, useSelector } from "react-redux";
import { CustomButtonPrimary } from "@/styled-components/CustomButtons.style";
import { useRouter } from "next/router";
import useClickOutside from "@/utils/use-click-outside";
import SearchBox from "../hero-section-with-search/SearchBox";
import { CustomNavSearchIcon } from "@/components/navbar/Navbar.style";
import { setSuggestedKeywords } from "@/redux/slices/storedData";
import { ProductsApi } from "@/hooks/react-query/config/productsApi";
import { useQuery } from "react-query";

const SearchWithSuggest = ({}) => {
  const { landingPageData } = useSelector((state) => state.storedData);
  const { global } = useSelector((state) => state.globalSettings);
  const home_image_path = global?.base_urls?.home_page_image_path;
  const banner_bg = `${home_image_path}/${landingPageData?.response?.search_bg}`;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [list, setList] = useState([]);
  const { token } = useSelector((state) => state.userToken);
  const [openSearchBox, setOpenSearchBox] = useState(true);
  const [selectValue, setSelectValue] = useState("");
  const router = useRouter();
  const { query } = router.query;

  const { suggestedKeywords } = useSelector((state) => state.storedData);

  const handleSearchBoxOpen = (e) => {
    e.stopPropagation();
    setOpenSearchBox(true);
  };
  const searchBoxRef = useClickOutside(() => {
    setOpenSearchBox(false);
  });

  const dispatch = useDispatch();

  const handleSearchSuccess = (res) => {
    dispatch(setSuggestedKeywords(res.data));
    //setSuggestedKeywords(res.data)
  };
  const { refetch, isRefetching } = useQuery(
    [],
    () => ProductsApi.suggestedProducts(),
    {
      onSuccess: handleSearchSuccess,
      enabled: false,
    }
  );

  const routeHandler = (value) => {
    if (value !== "") {
      router.push(
        {
          pathname: "/search",
          query: {
            query: value,
          },
        },
        undefined,
        { shallow: router.pathname === "/home" ? true : false }
      );
    }
  };

  useEffect(() => {
    let getItem = JSON.parse(localStorage.getItem("searchedValues"))
      ?.reverse()
      ?.slice(0, 5);
    if (getItem && getItem.length > 0) {
      setList(getItem);
    }
    if (token && suggestedKeywords?.length === 0) {
      refetch();
    }
  }, []);

  const HistoryHandler = () => {
    return (
      <>
        {list.length > 0 && (
          <Stack spacing={1} width="100%" marginTop={"10px"}>
            <Stack
              gap="10px"
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {list.map((item, index) => {
                return (
                  <Stack
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginInlineEnd: "10px",
                      padding: "6px 10px",
                      borderRadius: "50px",
                      border: "1px solid #000",
                      backgroundColor: theme.palette.background.green,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.greenOpacity,
                      },
                      minWidth: { xs: "40px", md: "100px" },
                    }}
                    key={index}
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    onClick={() => routeHandler(item)}
                  >
                    <Typography
                      color={theme.palette.neutral[1200]}
                      textTransform={"capitalize"}
                    >
                      {item}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </>
    );
  };

  const SuggestHandler = () => {
    return (
      <>
        {suggestedKeywords.length > 0 && (
          <Stack spacing={1} width="100%" marginTop={"10px"}>
            <Stack
              gap="10px"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {suggestedKeywords.map((item, index) => {
                return (
                  <Stack
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginInlineEnd: "10px",
                      padding: "6px 10px",
                      borderRadius: "50px",
                      border: "1px solid #000",
                      backgroundColor: theme.palette.background.green,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.greenOpacity,
                      },
                      minWidth: { xs: "40px", md: "100px" },
                    }}
                    key={index}
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    onClick={() => routeHandler(item?.name)}
                  >
                    <Typography
                      color={theme.palette.neutral[1200]}
                      textTransform={"capitalize"}
                    >
                      {item?.name}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </>
    );
  };

  const handleShowSearch = () => {
    if (openSearchBox) {
      return (
        <Box
          sx={{
            width: { xs: "100%", md: "600px" },
            marginInlineEnd: "20px",
            padding: isSmall ? "10px" : "10px",
          }}
        >
          <SearchBox
            placeholder={t("Tìm đấu giá")}
            query={query}
            selectValue={selectValue}
          />
        </Box>
      );
    } else if (
      router.pathname !== "/home" &&
      location &&
      router.pathname !== "/"
    ) {
      return (
        <Stack
          onClick={(e) => handleSearchBoxOpen(e)}
          sx={{ transition: "all ease .4s" }}
        >
          <CustomNavSearchIcon>
            <SearchOutlinedIcon sx={{ fontSize: "14px" }} color="primary" />
          </CustomNavSearchIcon>
        </Stack>
      );
    }
  };

  return (
    <CustomStackFullWidth
      sx={{
        backgroundImage: `url(${banner_bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        marginTop: { xs: "30px", md: "50px" },
      }}
    >
      <CustomStackFullWidth
        sx={{
          backgroundColor: theme.palette.primary.greenOpacity,
          padding: { xs: "20px 0", md: "50px 0" },
          minHeight: "300px",
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
            padding: { xs: "20px 0", md: "50px 0" },
          }}
        >
          <Typography
            fontSize={"18px"}
            fontWeight={"700"}
            color={"white"}
            marginBottom={"10px"}
          >
            {t(`TÌM SẢN PHẨM ĐẤU GIÁ`)}
          </Typography>
          {handleShowSearch()}
          {list == null || list.length == 0 ? (
            <SuggestHandler />
          ) : (
            <HistoryHandler />
          )}
        </Grid>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default SearchWithSuggest;
