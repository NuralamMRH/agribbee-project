import React from "react";
import { router, Stack } from "expo-router";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { Provider as TinyBaseProvider } from "tinybase/ui-react";
import { ListCreationProvider } from "@/context/ListCreationContext";
import Button from "@/components/ui/button";
import ShoppingListsStore from "@/stores/ShoppingListsStore";
import { Alert } from "react-native";
import { useNetworkState } from "expo-network";
import { Redirect } from "expo-router";

export default function Layout() {
  const { user } = useUser();
  const networkState = useNetworkState();

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <SignedIn>
      <TinyBaseProvider>
        <ShoppingListsStore />
        <ListCreationProvider>
          <Stack
            screenOptions={{
              ...(process.env.EXPO_OS !== "ios"
                ? { headerShown: false }
                : {
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBlurEffect: "systemChromeMaterial",
                    headerLargeTitleShadowVisible: false,
                    headerShadowVisible: true,
                    headerLargeStyle: {
                      // NEW: Make the large title transparent to match the background.
                      backgroundColor: "transparent",
                    },
                  }),
            }}
          >
            <Stack.Screen
              name="index"
              options={{ headerTitle: "Home", headerShown: false }}
            />
            <Stack.Screen
              name="notifications"
              options={{ headerTitle: "Notifications" }}
            />
            <Stack.Screen
              name="my-bookmark"
              options={{ headerTitle: "Bookmark" }}
            />
            <Stack.Screen
              name="fishing-log/index"
              options={{ headerTitle: "Fishing Log" }}
            />
            <Stack.Screen
              name="fishing-log/fresh-catch-list/index"
              options={{ headerTitle: "Fishing Log List" }}
            />
            <Stack.Screen
              name="fishing-log/daily-catch-report/index"
              options={{ headerTitle: "Daily catch list" }}
            />
            <Stack.Screen
              name="fishing-log/fresh-catch-list/new-catch"
              options={{ headerTitle: "New fishing catch Log" }}
            />
            <Stack.Screen
              name="fishing-log/fresh-catch-list/fish-catch"
              options={{ headerTitle: "AI Fish Scan" }}
            />
            <Stack.Screen
              name="fishing-log/fresh-catch-list/[catchId]/index"
              options={{ headerTitle: "Catch Tank" }}
            />
            <Stack.Screen
              name="fishing-log/fresh-catch-list/[catchId]/share"
              options={{ headerTitle: "Catch Tank share" }}
            />
            <Stack.Screen
              name="request-dock/index"
              options={{
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/dock-list/index"
              options={{
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/dock-list/[tripId]/index"
              options={{
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/port-list/index"
              options={{
                headerTitle: "THÔNG TIN CẢNG CÁ",
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/port-list/new/index"
              options={{
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/port-list/[portId]/index"
              options={{
                headerTitle: "Port",
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/port-list/[portId]/edit"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Seaport picker",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/request-departure/index"
              options={{
                headerTitle: "YÊU CẦU RỜI CẢNG",
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/request-departure/[tripId]/new"
              options={{
                presentation: "fullScreenModal",
                headerLargeTitle: false,
                headerTitle: "Request departure",
                headerLeft: () => (
                  <Button variant="ghost" onPress={() => router.back()}>
                    Cancel
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="request-dock/request-departure/[tripId]/share"
              options={{
                presentation: "fullScreenModal",
                headerLargeTitle: false,
                headerTitle: "Scan QR code",
                headerLeft: () => (
                  <Button variant="ghost" onPress={() => router.back()}>
                    Cancel
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="request-dock/request-departure/seaport-picker"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Seaport picker",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="request-dock/request-departure/fishing-area-picker"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Fishing picker",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
            {/* <Stack.Screen name="scan/index" options={{ headerTitle: "Scan" }} /> */}
            <Stack.Screen
              name="seafood-processing/index"
              options={{ headerTitle: "Seafood Processing" }}
            />
            <Stack.Screen
              name="trading-log/index"
              options={{ headerTitle: "Trading Log" }}
            />
            <Stack.Screen
              name="trading-log/book-for-share/index"
              options={{ headerTitle: "Book for Share" }}
            />
            <Stack.Screen
              name="trading-log/new/index"
              options={{ headerTitle: "Select boat" }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/index"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "New Trading-log",
              }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/QrPay"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "QrPay",
              }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/CourseDetails"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/CourseDetailsMore"
              options={{
                presentation: "modal",
                gestureDirection: "horizontal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/SelectPaymentMethods"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="trading-log/new/[boatId]/ConfirmPayment"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="trading-log/list/index"
              options={{ headerTitle: "Shipment List" }}
            />
            <Stack.Screen
              name="trading-log/list/[shipmentId]/edit"
              options={{ headerTitle: "Edit Shipment" }}
            />
            <Stack.Screen
              name="trading-log/list/[shipmentId]/index"
              options={{ headerTitle: "Shipment Details" }}
            />
            <Stack.Screen
              name="trading-log/list/[shipmentId]/payment"
              options={{ headerTitle: "Shipment Payment" }}
            />
            // Transhipment
            <Stack.Screen
              name="transhipment/index"
              options={{ headerTitle: "Transhipment" }}
            />
            <Stack.Screen
              name="transhipment/book-for-share/index"
              options={{ headerTitle: "Book for Share" }}
            />
            <Stack.Screen
              name="transhipment/new/index"
              options={{ headerTitle: "Select boat" }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/index"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "New Transhipment",
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/QrPay"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "QrPay",
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/form"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "QrPay",
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/CourseDetails"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/CourseDetailsMore"
              options={{
                presentation: "modal",
                gestureDirection: "horizontal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/SelectPaymentMethods"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="transhipment/new/[boatId]/ConfirmPayment"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="transhipment/list/index"
              options={{ headerTitle: "Shipment List" }}
            />
            <Stack.Screen
              name="transhipment/list/[shipmentId]/edit"
              options={{ headerTitle: "Edit Shipment" }}
            />
            <Stack.Screen
              name="transhipment/list/[shipmentId]/index"
              options={{ headerTitle: "Shipment Details" }}
            />
            <Stack.Screen
              name="transhipment/list/[shipmentId]/payment"
              options={{ headerTitle: "Shipment Payment" }}
            />
            <Stack.Screen
              name="province-picker"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Choose an emoji",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
            // Vessel managers
            <Stack.Screen
              name="vessel-management/index"
              options={{ headerTitle: "Vessel management" }}
            />
            <Stack.Screen
              name="vessel-management/fleet-brokers/index"
              options={{ headerTitle: "Fleet brokers" }}
            />
            <Stack.Screen
              name="vessel-management/fleet-brokers/new-broker"
              options={{ headerTitle: "New Fleet broke" }}
            />
            <Stack.Screen
              name="vessel-management/fleet-brokers/broker-doc-scan"
              options={{ headerTitle: "Fleet broker doc scan" }}
            />
            <Stack.Screen
              name="vessel-management/fleet-brokers/[brokerId]/index"
              options={{ headerTitle: "Fleet brokers" }}
            />
            <Stack.Screen
              name="vessel-management/boat-owners/index"
              options={{ headerTitle: "Boat Owner" }}
            />
            <Stack.Screen
              name="vessel-management/boat-owners/new-broker"
              options={{ headerTitle: "New boat owner" }}
            />
            <Stack.Screen
              name="vessel-management/boat-owners/broker-doc-scan"
              options={{ headerTitle: "Boat owner doc scan" }}
            />
            <Stack.Screen
              name="vessel-management/boat-owners/[brokerId]/index"
              options={{ headerTitle: "Boat owners" }}
            />
          </Stack>
        </ListCreationProvider>
      </TinyBaseProvider>
    </SignedIn>
  );
}
