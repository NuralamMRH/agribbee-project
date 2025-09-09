import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import RenderHeader from "@/components/ui/RenderHeader";
import { COLORS, SIZES, icons } from "@/constants";
import { requestToDock } from "@/data";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import DataTableComponent from "@/components/TableComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/theme/ThemeProvider";
const ICON_COLOR = "#007AFF";
const Index = () => {
  const router = useRouter();
  const [filteredPorts, setFilteredPorts] = useState([]);

  const [departFrom, setDepartFrom] = useState("");
  const [departTo, setDepartTo] = useState("");

  const { colors, dark } = useTheme();

  useEffect(() => {
    handlePortSearch();
  }, [departFrom, departTo]);

  const handlePortSearch = () => {
    let filtered = requestToDock.filter((trip) => {
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

  const headers = [
    "Vessel ID",
    "Boat owner",
    "Address",
    "Date of departure",
    "Place of departure",
    "Fishing Region",
    "DockReason",
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
    router.push(`/request-dock/dock-list/${row[0]}`);
  };

  const handleNewListPress = (row) => {
    console.log("Clicked row:", row);
    router.push(`/request-dock/dock-list/${row[0]}`);
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
            YÊU CẦU CẬP CẢNG
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
            title: "YÊU CẦU CẬP CẢN",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={{ height: SIZES.height - 100, marginTop: 20 }}>
        <DataTableComponent
          data={filteredPorts.map((trip) => {
            return [
              trip?.vesselID ?? null,
              trip?.boatOwner ?? null,
              trip?.address ?? null,
              trip?.dateOfDock ?? null,
              trip?.placeOfDock ?? null,
              trip?.fishingRegion ?? null,
              trip?.dockReason ?? null,
              trip?.tripId ?? "N/A", // portId will always be included as a fallback
            ].filter((value) => value !== null); // Remove keys that are missing
          })}
          headers={headers}
          subHeaders={[]}
          widthArr={widthArr}
          onRowPress={handleRowPress}
        />
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
