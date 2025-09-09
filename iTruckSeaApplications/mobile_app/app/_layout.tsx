import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, Platform, LogBox } from "react-native";
import { useEffect } from "react";
import { tokenCache } from "@/cache";
import "react-native-reanimated";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// CLERK AUTHENTICATION
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
export default function RootLayout() {
  const { dark } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!publishableKey) {
    throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  }
  if (Platform.OS === "android") {
    LogBox.ignoreLogs([
      "Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`",
    ]);
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider>
          <GestureHandlerRootView>
            <Slot />
          </GestureHandlerRootView>
          <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
