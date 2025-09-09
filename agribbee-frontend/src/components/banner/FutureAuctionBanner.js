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

const FutureAuctionBanner = (props) => {
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
        <Grid item xs={3} md={3} lg={3} overflow={"hidden"}>
          <Card
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "100%", md: "100%" },
              borderRadius: isSmall ? "5px" : "10px",
            }}
          >
            <ImageRoot
              image={props?.calender ? props?.calender : banner1}
            ></ImageRoot>
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
          <Grid item xs={12} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: isSmall ? "5px" : "10px",
                cursor: props?.imageText1 ? "pointer" : "default",
              }}
              onClick={() => handleToggle("imageText1")}
            >
              <ImageRoot image={props?.image1 ? props?.image1 : banner1}>
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
                  {props?.imageText1 ? props?.imageText1 : "Trai Cay Trung Vu"}
                </Typography>
              </ImageRoot>
            </Card>
          </Grid>
          <Grid item xs={12} spacing={isSmall ? 0.3 : isMedium ? 1 : 2}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: isSmall ? "5px" : "10px",
                cursor: props?.imageText2 ? "pointer" : "default",
              }}
              onClick={() => handleToggle("imageText2")}
            >
              <ImageRoot image={props?.image2 ? props?.image2 : banner1}>
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
                  {props?.imageText2 ? props?.imageText2 : "Trai Cay Trung Vu"}
                </Typography>
              </ImageRoot>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={3} md={3} lg={3} overflow={"hidden"}>
          <Card
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "100%", md: "100%" },
              borderRadius: isSmall ? "5px" : "10px",
            }}
          >
            <ImageRoot image={props?.banner2 ? props?.banner2 : banner1}>
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
                {props?.mainSlogan2
                  ? props?.mainSlogan2
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
                  bottom: "22%",
                  transform: "translate(-50%, 50%)",
                  color: (theme) => theme.palette.text.white,
                  fontSize: { xs: "12px", md: "18px" },
                  fontWeight: "700",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {props?.title2 ? props?.title2 : "Hai Sản Vào Mùa"}
              </Typography>
            </ImageRoot>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default FutureAuctionBanner
