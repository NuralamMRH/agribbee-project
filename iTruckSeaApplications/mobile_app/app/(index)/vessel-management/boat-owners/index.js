import React, { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Link, Stack, useRouter } from "expo-router";
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
import { backgroundColors } from "@/constants/Colors";
import { useShoppingListIds } from "@/stores/ShoppingListsStore";
import { appleBlue, COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { IconCircle } from "@/components/IconCircle";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import { usePortListIds } from "@/stores/PostListsStore";
import PortListItem from "@/components/PortListItem";
import NotFoundCard from "@/components/NotFoundCard";
import { demoVesselData, seaPortList } from "@/data";
import DataTableComponent from "@/components/TableComponent";
import { useListCreation } from "@/context/ListCreationContext";

const ICON_COLOR = "#007AFF";

const Index = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();

  const [filteredPorts, setFilteredPorts] = useState([]);
  const [departFrom, setDepartFrom] = useState();
  const [departTo, setDepartTo] = useState();

  const { fishingZone, setFishingZone } = useListCreation();
  const { selectSeaPort, setSelectSeaPort } = useListCreation(
    seaPortList[0].portId
  );

  useEffect(() => {
    handlePortSearch();
  }, [departFrom, departTo]);

  const handlePortSearch = () => {
    let filtered = demoVesselData.filter((trip) => {
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
    "Owner",
    "citizenId",
    "residence",
    "registrationNumber",
    "vesselType",
    "purpose",
    "hullMaterial",
    "engineModel",
    "engineNumber",
    "boatEnergy",
    "additiveChemical",
    "tankQuantity",
    "captain",
    "captainLicense",
    "engineer",
    "engineerLicense",
    "totalWorkers",
    "crewMembers",
    "scannerName",
  ];

  const widthArr = [120, 120, 120, 120, 150];

  const handleRowPress = (row) => {
    console.log("Clicked row:", row);
    router.push(`/vessel-management/boat-owners/${row[0]}`);
  };

  const formatCell = (data) => {
    if (!data || (data.tanks == null && data.kg == null)) return "-";
    return `${data.tanks ?? 0} Tanks\n${data.kg ?? 0} kg`;
  };

  //   const portListIds = usePortListIds()

  const handleNewListPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/vessel-management/boat-owners/new-broker");
  };

  //   console.log("List: ", portListIds)

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
            Boat Owners
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
            title: "Boat Owners",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputBoxContainer}>
          <Text>Trip ID</Text>

          <Link
            style={{ marginTop: 10 }}
            href={{
              pathname: "/request-dock/request-departure/seaport-picker",
            }}
          >
            <View
              style={[
                styles.titleInput,
                {
                  backgroundColor: dark ? COLORS.dark1 : "#e9e9e9e9",
                  width: SIZES.width - 32,
                  height: 50,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                },
              ]}
            >
              <Text>F45E300125-1001</Text>
            </View>
          </Link>
        </View>
        <View style={styles.inputBoxContainer}>
          <Text>Ngư Trường</Text>

          <Link
            style={{ marginTop: 10 }}
            href={{
              pathname: "/request-dock/request-departure/fishing-area-picker",
            }}
          >
            <View
              style={[
                styles.titleInput,
                {
                  backgroundColor: dark ? COLORS.dark1 : "#e9e9e9e9",
                  width: SIZES.width - 32,
                  height: 50,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                },
              ]}
            >
              <Text>
                {seaPortList.find((x) => x.regionID == fishingZone)?.name ||
                  "Ngu Truong"}
              </Text>
            </View>
          </Link>
        </View>
      </View>

      <View>
        {demoVesselData.length > 0 ? (
          <DataTableComponent
            data={demoVesselData.map((vessel) => {
              return [
                vessel?.owner ?? "-",
                vessel?.citizenId ?? "-",
                vessel?.residence ?? "-",
                vessel?.registrationNumber ?? "-",
                vessel?.vesselType ?? "-",
                vessel?.purpose ?? "-",
                vessel?.hullMaterial ?? "-",
                vessel?.engineModel ?? "-",
                vessel?.engineNumber ?? "-",
                vessel?.boatEnergy ?? "-",
                vessel?.additiveChemical ?? "-",
                vessel?.tankQuantity ?? "-",
                vessel?.captain ?? "-",
                vessel?.engineer ?? "-",
                vessel?.captainLicense ?? "-",
                vessel?.totalWorkers ?? "-",
                vessel?.crewMembers ?? "-",
                vessel?.scannerName ?? "-",
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

  //another

  scrollViewContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleInput: {
    fontWeight: "400",
    fontSize: 16,
    padding: 5,
  },
  inputBoxContainer: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "auto",
    marginBottom: 10,
  },
  emojiButton: {
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
  },
  emojiContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionInput: {
    padding: 0,
  },
  createButtonText: {
    color: appleBlue,
    fontWeight: "normal",
  },
  colorButton: {
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
  },
  colorContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    borderRadius: 100,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },

  //OTP specific
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.secondaryWhite,
    borderBottomColor: "gray",
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
    borderColor: "gray",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
  },
});

export default Index;
