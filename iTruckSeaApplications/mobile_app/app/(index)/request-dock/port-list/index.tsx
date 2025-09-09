import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { Link, Stack, useRouter } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// Components
// import ShoppingListItem from "@/components/ShoppingListItem"

import { IconSymbol } from "@/components/ui/IconSymbol";
// Constants & Hooks

import { COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import { offShoreRegions, seaPortList } from "@/data";
import DataTableComponent from "@/components/TableComponent";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import NotFoundCard from "@/components/NotFoundCard";
import ShoppingListsStore, {
  useAddShoppingListCallback,
  useDelShoppingListCallback,
  useShoppingListIds,
  useShoppingLists,
} from "@/stores/ShoppingListsStore";

const ICON_COLOR = "#007AFF";

const Index = () => {
  const router = useRouter();

  // Search States
  const [name, setName] = useState("");
  const [classify, setClassify] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState("");
  const [filteredPorts, setFilteredPorts] = useState([]);

  const useAddPostList = useAddShoppingListCallback();

  const portAllList = useShoppingLists();
  // const portAllList = useShoppingListIds();

  // Filtered Ports List

  useEffect(() => {
    handlePortSearch();
  }, [name, classify, district, address, ward, province]);

  // name,
  // classify,
  // district,
  // address,
  // province,
  // ward,

  const handleCreatePortLists = () => {
    if (!seaPortList || seaPortList.length === 0) {
      console.error("No ports available to create.");
      return;
    }

    // Loop through each port and add individually
    seaPortList.forEach((port) => {
      useAddPostList(
        port.portId, // Ensure it matches the function parameters
        port.name,
        port.classify,
        port.district,
        port.address,
        port.province,
        port.ward
      );
    });

    // Navigate back to the main list view
    router.replace("/request-dock/port-list");
  };

  const deleteCallback = useDelShoppingListCallback(
    "9ea49a53-4eac-461d-a141-201df1098a76"
  );

  const handlePortSearch = () => {
    let filtered = seaPortList.filter((port) => {
      return (
        (name
          ? (port.name || "").toLowerCase().includes(name.toLowerCase())
          : true) &&
        (classify
          ? (port.classify || "").toLowerCase().includes(classify.toLowerCase())
          : true) &&
        (district
          ? (port.district || "").toLowerCase().includes(district.toLowerCase())
          : true) &&
        (address
          ? (port.address || "").toLowerCase().includes(address.toLowerCase())
          : true) &&
        (ward
          ? (port.ward || "").toLowerCase().includes(ward.toLowerCase())
          : true) &&
        (province
          ? (port.province || "").toLowerCase().includes(province.toLowerCase())
          : true)
      );
    });

    setFilteredPorts(filtered);
  };

  console.log("filteredPorts:", filteredPorts);

  const headers = [
    "Tên cảng\n(Seaport name)",
    "Địa chỉ\n(Address)",
    "Đ.Thoại\n(Phone#)",
    "Phân loại\n(Classify)",
    "Tỉnh/TP\n(Province/City)",
    "Trạng thái\n(Seaport status)",
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
    router.push(`/request-dock/port-list/${row[0]}`);
  };

  const { colors, dark } = useTheme();

  const handleNewListPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/request-dock/port-list/new");
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
            Tàu Chuyển Tải
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
    <>
      <View style={{ padding: 16, backgroundColor: colors.background }}>
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
      </View>
      <BodySafeAreaView>
        <TextInput
          label="Tên cảng"
          placeholder="Seaport name"
          value={name}
          onChangeText={setName}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Phân loại"
          placeholder="Classify"
          value={classify}
          onChangeText={setClassify}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Quận huyện"
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Địa chỉ"
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Xã/Phường"
          placeholder="Ward"
          value={ward}
          onChangeText={setWard}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Tỉnh/Thành phố"
          placeholder="Province/City"
          value={province}
          onChangeText={setProvince}
          returnKeyType="done"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <Button
          onPress={handlePortSearch}
          disabled={!name}
          style={{
            color: dark ? COLORS.primary : COLORS.white,
            backgroundColor: dark ? COLORS.white : COLORS.primary,
          }}
        >
          Tìm kiếm
        </Button>

        {filteredPorts.length > 0 ? (
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
              data={filteredPorts.map((port) => {
                return [
                  port?.name ?? null,
                  port?.classify ?? null,
                  port?.district ?? null,
                  port?.province ?? null,
                  port?.address ?? null,
                  port?.portId ?? "N/A", // portId will always be included as a fallback
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
      </BodySafeAreaView>
    </>
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
});

export default Index;
