import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style";
import { Stack, Typography, alpha, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CustomImageContainer from "../CustomImageContainer";
import { HomeTextTypography } from "../home/HomeStyle";
// import 'react-multi-carousel/lib/styles.css'

const MarketBoxCard = (props) => {
  const {
    className,
    marketImagePath,
    image,
    name,
    id,
    handleClickOnMarket,
    hoveredMarkerId,
    marketCardHeight,
    marketCardWidth,
  } = props;

  const { global } = useSelector((state) => state.globalSettings);
  let currencySymbol;
  let currencySymbolDirection;
  let digitAfterDecimalPoint;

  if (global) {
    currencySymbol = global.currency_symbol;
    currencySymbolDirection = global.currency_symbol_direction;
    digitAfterDecimalPoint = global.digit_after_decimal_point;
  }
  const logo = `${marketImagePath}/${image}`;
  const theme = useTheme();

  const settings = {
    dots: false,
    infinite: true,
    fade: true,

    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Stack
      onClick={() => handleClickOnMarket(id)}
      className={className}
      height={"100%"}
      id={`market-${id}`}
    >
      <CustomPaperBigCard
        nopadding="true"
        noboxshadow="true"
        sx={{
          padding: "10px 10px 25px 10px",
          borderRadius: "24px",
          cursor: "pointer",
          width: "100%",
          height: "100%",
          border:
            hoveredMarkerId === id
              ? `1px solid ${theme.palette.primary.main}`
              : `0px solid #fff0`,
          "&:hover": {
            boxShadow: `0px 0px 2px rgba(145, 158, 171, 0.2), 0px 5px 20px ${theme.palette.paperBoxShadow}`,
          },
        }}
      >
        <CustomStackFullWidth spacing={1}>
          <Stack sx={{ overflow: "hidden", position: "relative" }}>
            <Box
              sx={{
                width: "100%",
                height: { sm: "200px", md: "220px", lg: "250px" },
                transition: `${theme.transitions.create(
                  ["background-color", "transform"],
                  {
                    duration: theme.transitions.duration.standard,
                  }
                )}`,
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <CustomImageContainer
                src={`${marketImagePath}/${image}`}
                height={marketCardHeight || "100%"}
                width={marketCardWidth || "100%"}
                objectFit="cover"
                borderRadius="20px"
              />
            </Box>
          </Stack>
          <CustomStackFullWidth paddingX="5px" spacing={0.4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ position: "relative", justifyContent: "center" }}
            >
              <HomeTextTypography>{name}</HomeTextTypography>
            </Stack>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </CustomPaperBigCard>
    </Stack>
  );
};

export default MarketBoxCard;
