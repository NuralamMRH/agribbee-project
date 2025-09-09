import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Components

// import ShoppingListItem from "@/components/ShoppingListItem"
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
// Constants & Hooks
import { backgroundColors } from "@/constants/Colors";
import { useShoppingListIds } from "@/stores/ShoppingListsStore";
import { COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { IconCircle } from "@/components/IconCircle";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import PortListItem from "@/components/PortListItem";
import NotFoundCard from "@/components/NotFoundCard";
import { demoTrips } from "@/data";
import DataTableComponent from "@/components/TableComponent";

const ICON_COLOR = "#007AFF";

const Index = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [filteredPorts, setFilteredPorts] = useState([]);

  const [departFrom, setDepartFrom] = useState("");
  const [departTo, setDepartTo] = useState("");

  useEffect(() => {
    handlePortSearch();
  }, [departFrom, departTo]);

  const handlePortSearch = () => {
    let filtered = demoTrips.filter((trip) => {
      return (
        (departFrom
          ? (trip.tripId || "").toLowerCase().includes(departFrom.toLowerCase())
          : true) &&
        (departTo
          ? (trip.dateOfDeparture || "")
              .toLowerCase()
              .includes(departTo.toLowerCase())
          : true)
      );
    });

    setFilteredPorts(filtered);
  };

  const handleNewListPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/request-dock/request-departure/new");
  };

  const headers = [
    "Vessel ID",
    "Boat owner",
    "Address",
    "Date of departure",
    "Place of departure",
    "Trip ID",
  ];
  const subHeaders = [
    "Seaport name",
    "Address",
    "Phone#",
    "Classify",
    "Province/City",
    "Seaport status",
  ];
  const widthArr = [120, 120, 120, 120, 150];

  const handleRowPress = (row) => {
    console.log("Clicked row:", row);
    router.push(`/request-dock/request-departure/${row[0]}`);
  };

  const renderHeaderRight = () => (
    <Pressable onPress={handleNewListPress} style={styles.headerButton}>
      <IconSymbol name="plus" color={ICON_COLOR} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.back()}
      style={[styles.headerButton, styles.headerButtonLeft]}
    >
      <IconSymbol
        name="arrow.left"
        color={ICON_COLOR}
        style={{ marginRight: Platform.select({ default: 0, android: 8 }) }}
      />
    </Pressable>
  );

  /**
   * Render android header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Request departure
          </Text>
        </View>
        <TouchableOpacity onPress={handleNewListPress}>
          <Text>New</Text>
          <Image
            source={icons.plus}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BodySafeAreaView>
      {Platform.OS === "android" ? (
        renderHeader()
      ) : (
        <Stack.Screen
          options={{
            title: "THÔNG TIN CẢNG CÁ",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}

      <View>
        {demoTrips.length > 0 ? (
          <>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 8,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                Kết quả tìm kiếm (result)
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 8,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                Tổng số tìm kiếm (Total results) : {filteredPorts.length}
              </Text>
            </View>

            <DataTableComponent
              data={demoTrips.map((trip) => {
                return [
                  trip?.vesselId ?? null,
                  trip?.boatOwner ?? null,
                  trip?.address ?? null,
                  trip?.dateOfDeparture ?? null,
                  trip?.placeOfDeparture ?? null,
                  trip?.tripId ?? "N/A", // portId will always be included as a fallback
                ].filter((value) => value !== null); // Remove keys that are missing
              })}
              headers={headers}
              subHeaders={[]}
              widthArr={widthArr}
              onRowPress={handleRowPress}
            />
          </>
        ) : (
          <NotFoundCard
            btn={handleCreatePortLists}
            btnText={"Create demo Ports"}
          />
        )}
      </View>
    </BodySafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  headerButton: {
    padding: 8,
    paddingRight: 0,
    marginHorizontal: Platform.select({ web: 16, default: 0 }),
  },
  headerButtonLeft: {
    paddingLeft: 0,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 16,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});

export default Index;
