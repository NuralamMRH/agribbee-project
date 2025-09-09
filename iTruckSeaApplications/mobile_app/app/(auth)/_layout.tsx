import React, { useState, useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
      const checkIfFirstLaunch = async () => {
        try {
          const value = await AsyncStorage.getItem("alreadyLaunched");
          if (value === null) {
            await AsyncStorage.setItem("alreadyLaunched", "true");
            setIsFirstLaunch(true);
          } else {
            setIsFirstLaunch(false);
          }
        } catch (error) {
          console.error("Error checking launch status:", error);
          // Decide how to handle errors, possibly set isFirstLaunch to false
          setIsFirstLaunch(false);
        }
      };

      checkIfFirstLaunch();
    }, []);

  if (isFirstLaunch) {
    return <Redirect href="/(onboard)" />;
  } else if (isSignedIn) {
    return <Redirect href="/(index)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> // Login page
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="reset-password"
        options={{ headerTitle: "Reset Password" }}
      />
    </Stack>
  );
}
