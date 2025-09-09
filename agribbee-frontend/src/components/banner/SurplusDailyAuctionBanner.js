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

const SurplusDailyAuctionBanner = (props) => {
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
    padding: isSmall ? theme.spacing(5, 0) : theme.spacing(10, 0),
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
              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "10%",
                  transform: "translate(-50%, -50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "10px", md: "14px" },
                  fontWeight: "600",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.slogan ? props?.slogan : "Đưa Gia Siêu Ré"}
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "22%",
                  transform: "translate(-50%, -50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "10px", md: "14px" },
                  fontWeight: "600",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.mainSlogan
                  ? props?.mainSlogan
                  : "AI-POWERED SURPLUS AUCTION"}
              </Typography>
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
                  bottom: "20%",
                  transform: "translate(-50%, 50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "12px", md: "18px" },
                  fontWeight: "700",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.title ? props?.title : "Hai Sản Vào Mùa"}
              </Typography>
            </ImageRoot>
          </Card>
        </Grid>
        <Grid
          item
          spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          container
          xs={3}
          md={3}
          lg={3}
        >
          <Grid
            item
            container
            xs={12}
            spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          >
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText1 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText1")}
              >
                <ImageRoot image={props?.image1 ? props?.image1 : banner1} />
              </Card>
            </Grid>
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText2 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText2")}
              >
                <ImageRoot image={props?.image2 ? props?.image2 : banner1} />
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: isSmall ? "5px" : "10px",
                cursor: props?.imageText3 ? "pointer" : "default",
              }}
              onClick={() => handleToggle("imageText3")}
            >
              <ImageRoot image={props?.image3 ? props?.image3 : banner1}>
                <Typography
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    color: (theme) => theme.palette.text.white,
                    fontSize: { xs: "12px", md: "18px" },
                    fontWeight: "700",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {props?.imageText3
                    ? props?.imageText3
                    : "Hang Thanh Ly Ton Kho"}
                </Typography>
              </ImageRoot>
            </Card>
          </Grid>
        </Grid>
        <Grid
          item
          spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          container
          xs={3}
          md={3}
          lg={3}
        >
          <Grid item xs={12} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: isSmall ? "5px" : "10px",
                cursor: props?.imageText4 ? "pointer" : "default",
              }}
              onClick={() => handleToggle("imageText4")}
            >
              <ImageRoot image={props?.image4 ? props?.image4 : banner1}>
                <Typography
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    color: (theme) => theme.palette.text.white,
                    fontSize: { xs: "12px", md: "18px" },
                    fontWeight: "700",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {props?.imageText4 ? props?.imageText4 : "Trai Cay Trung Vu"}
                </Typography>
              </ImageRoot>
            </Card>
          </Grid>
          <Grid
            item
            container
            xs={12}
            spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          >
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText5 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText5")}
              >
                <ImageRoot image={props?.image5 ? props?.image5 : banner1} />
              </Card>
            </Grid>
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText6 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText6")}
              >
                <ImageRoot image={props?.image6 ? props?.image6 : banner1} />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          container
          xs={3}
          md={3}
          lg={3}
        >
          <Grid
            item
            container
            xs={12}
            spacing={isSmall ? 0.3 : isMedium ? 1 : 2}
          >
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText7 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText7")}
              >
                <ImageRoot image={props?.image7 ? props?.image7 : banner1} />
              </Card>
            </Grid>
            <Grid item xs={6} md={6} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  borderRadius: isSmall ? "5px" : "10px",
                  cursor: props?.imageText8 ? "pointer" : "default",
                }}
                onClick={() => handleToggle("imageText8")}
              >
                <ImageRoot image={props?.image8 ? props?.image8 : banner1} />
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: isSmall ? "5px" : "10px",
                cursor: props?.imageText9 ? "pointer" : "default",
              }}
              onClick={() => handleToggle("imageText9")}
            >
              <ImageRoot image={props?.image9 ? props?.image9 : banner1}>
                <Typography
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    color: (theme) => theme.palette.text.white,
                    fontSize: { xs: "12px", md: "18px" },
                    fontWeight: "700",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {props?.imageText9 ? props?.imageText9 : "Trai Cay Trung Vu"}
                </Typography>
              </ImageRoot>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default SurplusDailyAuctionBanner
