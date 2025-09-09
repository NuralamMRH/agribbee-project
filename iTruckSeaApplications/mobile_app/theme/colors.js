import { COLORS, images } from "@/constants";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const CustomDefaultTheme = {
  ...DefaultTheme,
  dark: false,
  colored: {
    primary: "rgb(0, 122, 255)", // System Blue
    background: "rgb(242, 242, 247)", // Light mode background
    card: "rgb(255, 255, 255)", // White cards/surfaces
    text: "rgb(0, 0, 0)", // Black text for light mode
    border: "rgb(216, 216, 220)", // Light gray for separators/borders
    notification: "rgb(255, 59, 48)", // System Red
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colored: {
    primary: "rgb(10, 132, 255)", // System Blue (Dark Mode)
    background: "rgb(1, 1, 1)", // True black background for OLED displays
    card: "rgb(28, 28, 30)", // Dark card/surface color
    text: "rgb(255, 255, 255)", // White text for dark mode
    border: "rgb(44, 44, 46)", // Dark gray for separators/borders
    notification: "rgb(255, 69, 58)", // System Red (Dark Mode)
  },
};

export const lightColors = {
  ...CustomDefaultTheme,
  primary: COLORS.primary,
  text: COLORS.dark1,
  background: "rgb(255, 255, 255)", // Light mode background
};

export const darkColors = {
  ...CustomDarkTheme,
  primary: COLORS.primary,
  text: COLORS.white,
  background: COLORS.dark1,
};
