import React, { useState, useEffect } from "react";
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
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
// Constants & Hooks
import { COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { IconCircle } from "@/components/IconCircle";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import NotFoundCard from "@/components/NotFoundCard";
import { demoFishingLogBook } from "@/data";
import DataTableComponent from "@/components/TableComponent";

const ICON_COLOR = "#007AFF";

const Index = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [filteredPorts, setFilteredPorts] = useState([]);
  const [departFrom, setDepartFrom] = useState();
  const [departTo, setDepartTo] = useState();

  useEffect(() => {
    handlePortSearch();
  }, [departFrom, departTo]);

  const handlePortSearch = () => {
    let filtered = demoFishingLogBook.filter((trip) => {
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
    "Fishing date",
    "Total Catch\n(Tank/Kg)",
    "Transfer 4Share\n(Tank/Kg)",
    "Ship 4Sales\n(Tank/Kg)",
    "InTank On Boat\n(Tank/Kg)",
  ];

  const widthArr = [120, 120, 120, 120, 150];

  const handleRowPress = (row) => {
    console.log("Clicked row:", row);
    router.push(`/request-dock/dock-list/${row[0]}`);
  };

  const formatCell = (data) => {
    if (!data || (data.tanks == null && data.kg == null)) return "-";
    return `${data.tanks ?? 0} Tanks\n${data.kg ?? 0} kg`;
  };

  //   console.log("List: ", portListIds)

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
            Catch report by vessel
          </Text>
        </View>
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
            title: "catch-report-by-vessel",
            headerLeft: renderHeaderLeft,
          }}
        />
      )}

      <View>
        {demoFishingLogBook.length > 0 ? (
          <DataTableComponent
            data={demoFishingLogBook.map((trip) => {
              return [
                trip?.fishingTime ?? "-",
                formatCell(trip?.totalCatch),
                formatCell(trip?.transfer4Share),
                formatCell(trip?.ship4Sales),
                formatCell(trip?.inTankOnBoat),
              ];
            })}
            headers={headers}
            subHeaders={[]}
            widthArr={widthArr}
            onRowPress={handleRowPress}
          />
        ) : (
          <NotFoundCard />
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
