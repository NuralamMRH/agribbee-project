import {
  Card,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useState } from "react" // Import useState
import banner1 from "../../assets/images/banners/bannerlogoblock@3x.png"
import surplusLogo from "../../assets/images/banners/surpluslogo.png"
import Image from "../image"
import { getImageSource } from "@/utils/getImageSource"

const LiveAuctionBanner = (props) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("md"))
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"))
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"))

  // State to track the toggle for each image
  const [toggleStates, setToggleStates] = useState({})

  // Toggle function
  const handleToggle = (key) => {
    setToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the state for the specific key
    }))

    // Call the onClick prop with the keyword or empty value based on the toggle state
    props?.onClick({
      keyword: toggleStates[key] ? "" : props?.[key] || "",
    })
  }

  const ImageRoot = styled("div")(({ theme, image }) => ({
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${getImageSource(image)})`,
    padding: isSmall ? theme.spacing(10, 0) : theme.spacing(20, 0),
    height: "100%",
    width: "100%",
  }))

  return (
    <Stack
      sx={{
        backgroundColor: "#EOF6FF",
        maxHeight: {
          xs: "300px",
          md: "400px",
        },
        padding: "10px",
      }}
    >
      <Grid container spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
        <Grid item xs={3} md={3} lg={3} overflow={"hidden"}>
          <Card
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "100%", md: "100%" },
              borderRadius: isSmall ? "5px" : "10px",
            }}
          >
            <ImageRoot image={props?.banner ? props?.banner : banner1}>
              <Image
                src={getImageSource(props?.logo || surplusLogo)}
                alt={props?.logo || ""}
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "50px", md: "100%" },
                  height: { xs: "50px", md: "100%" },
                  maxWidth: 100,
                  maxHeight: 100,
                  borderRadius: "5px",
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: "25%",
                  transform: "translate(-50%, 50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "8px", md: "18px" },
                  fontWeight: "700",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.title ? props?.title : "Hai Sản Vào Mùa"}
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: "15%",
                  transform: "translate(-50%, 50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "8px", md: "14px" },
                  fontWeight: "600",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.mainSlogan
                  ? props?.mainSlogan
                  : "AI-POWERED LIVE AUCTION"}
              </Typography>
            </ImageRoot>
          </Card>
        </Grid>
        <Grid item xs={9} md={9} lg={9} overflow={"hidden"}>
          <Card
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "100%", md: "100%" },
              borderRadius: isSmall ? "5px" : "10px",
            }}
          >
            <ImageRoot
              image={
                props?.liveAuctionBanner ? props?.liveAuctionBanner : banner1
              }
            >
              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "40%",
                  transform: "translate(-50%, -50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "16px", md: "40px" },
                  fontWeight: "600",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.liveAuctionText
                  ? props?.liveAuctionText
                  : "Live Auction"}
              </Typography>
            </ImageRoot>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default LiveAuctionBanner
