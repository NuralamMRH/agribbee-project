import {
  alpha,
  Box,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material"
import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import React from "react"
import { useTranslation } from "react-i18next"

import { useDispatch } from "react-redux"
export const PrimaryButton = styled(Button)(
  ({
    backgroundColor,
    hoverBackgroundColor,
    borderRadius,
    theme,
    padding,
    color,
  }) => ({
    backgroundColor: backgroundColor,
    borderRadius: borderRadius ? borderRadius : "8px",
    color: theme.palette.neutral[100],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.8),
      color: hoverBackgroundColor,
    },
    [theme.breakpoints.down("sm")]: {
      padding: padding ? padding : "",
    },
  })
)
export default function globalTabType({ globalTabType, setGlobalTabType }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useDispatch()
  const [languageDirection, setLanguageDirection] = React.useState("ltr")
  React.useEffect(() => {
    if (localStorage.getItem("direction")) {
      setLanguageDirection(localStorage.getItem("direction"))
    }
  }, [])
  const handleClick = (value) => {
    setGlobalTabType({ page: value })
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabs = [
    "Surplus Auction",
    "Live Auction",
    "Future Delivery Auction",
    "Daily Catch Auction",
  ]

  return (
    <>
      {languageDirection && (
        <Stack
          // alignItems="center"
          // justifyContent="space-between"
          // direction="row"
          spacing={{ xs: 3, sm: 4, md: 5 }}
          // gap={languageDirection === "rtl" && "10px"}
          marginTop={{ xs: "10px", sm: "10px", md: "0px" }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant={isSmall ? "scrollable" : "fullWidth"}
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
            indicatorColor={"transparent"}
            textColor="inherit"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                onClick={() =>
                  handleClick(tab.toLowerCase().replace(/\s/g, "-"))
                }
                label={t(tab)}
                sx={{
                  background: theme.palette.blue[50],
                  border:
                    globalTabType === tab.toLowerCase().replace(/\s/g, "-")
                      ? `1px solid ${theme.palette.blue[400]}`
                      : `1px solid ${theme.palette.background.lightBg}`,
                  minWidth: { xs: "120px", md: "120px" },
                  borderRadius: "10px",
                  marginRight: "10px",
                  fontSize: { xs: "12px", md: "14px" },
                  paddingX: { xs: "10px", md: "15px" },
                }}
              />
            ))}
          </Tabs>
        </Stack>
      )}
    </>
  )
}
