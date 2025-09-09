import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@clerk/clerk-expo";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        await AsyncStorage.setItem("alreadyLaunched", "false");
        setIsFirstLaunch(false);
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };

    checkIfFirstLaunch();
  }, []);

  if (!isLoaded) return null; // Show loader

  if (isSignedIn) {
    return <Redirect href="/(index)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: "On boarding 1" }} />
    </Stack>
  );
}
