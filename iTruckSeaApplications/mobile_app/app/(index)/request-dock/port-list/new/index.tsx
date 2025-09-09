import React, { useEffect, useMemo, useState } from "react";
import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TextInput from "@/components/ui/text-input";
import { appleBlue, backgroundColors } from "@/constants/Colors";
import { useListCreation } from "@/context/ListCreationContext";
import RenderHeader from "@/components/ui/RenderHeader";
import { COLORS, SIZES } from "@/constants";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import Button from "@/components/ui/button";
import { offShoreRegions } from "@/data";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
// import { useAddPostCallback } from "@/stores/PostListsStore";
import {
  useAddShoppingListCallback,
  useJoinShoppingListCallback,
} from "@/stores/ShoppingListsStore";
import { useShoppingListValue } from "@/stores/ShoppingListStore";
import { useTheme } from "@/theme/ThemeProvider";
const isValidUUID = (id: string | null) => {
  if (!id) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
export default function CreateListScreen() {
  const params = useGlobalSearchParams();

  const [name, setName] = useState("");
  const [classify, setClassify] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [coordinateLocation, setCoordinateLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [averageShipSize, setAverageShipSize] = useState("");
  const [dockingDepth, setDockingDepth] = useState("");
  const [stationPosition, setStationPosition] = useState("");
  const [intelDepth, setIntelDepth] = useState("");
  const [intelDirection, setIntelDirection] = useState("");
  const [lengthOfWharf, setLengthOfWharf] = useState("");
  const [loadingCapacity, setLoadingCapacity] = useState("");
  const { province, setProvince } = useListCreation();
  const { selectSeaPort, setSelectSeaPort } = useListCreation();

  const { dark } = useTheme();
  const router = useRouter();
  const useAddPostList = useAddShoppingListCallback();

  useEffect(() => {
    setProvince("A");

    // Cleanup function to reset context when unmounting
    return () => {
      setProvince("");
    };
  }, []);

  const handleCreatePost = () => {
    if (!name) {
      return;
    }

    const portId = useAddPostList(
      name,
      classify,
      district,
      address,
      province,
      ward,
      contactNumber,
      coordinateLocation,
      averageShipSize,
      dockingDepth,
      stationPosition,
      intelDepth,
      intelDirection,
      lengthOfWharf,
      loadingCapacity
    );

    console.log("handleCreatePort: ", selectSeaPort);
    setSelectSeaPort(portId);

    // router.replace({
    //   pathname: "/request-dock/port-list/[portId]",
    //   params: { portId },
    // });
  };

  // const xxxxxxx = useShoppingListValue(
  //   "0877ed65-6f85-4508-a86f-20cc953917d7",
  //   "portId"
  // );

  return (
    <>
      <View style={{ padding: 16 }}>
        {Platform.OS === "android" ? (
          <RenderHeader title={"Add Seaport/Thêm Cảng"} />
        ) : (
          <Stack.Screen
            options={{
              headerLargeTitle: false,
              headerTitle: "Add Seaport/Thêm Cảng",
            }}
          />
        )}
      </View>
      <BodyScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Tên cảng"
            placeholder="Seaport name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleCreatePost}
            returnKeyType="done"
            autoFocus
            inputStyle={styles.titleInput}
            containerStyle={styles.inputBoxContainer}
          />
        </View>
        <TextInput
          label="Phân loại"
          placeholder="Classify"
          value={classify}
          onChangeText={setClassify}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Quận huyện"
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Địa chỉ"
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <View style={styles.inputBoxContainer}>
          <Text>Tỉnh/Thành phố</Text>

          <Link
            style={{ marginTop: 10 }}
            href={{ pathname: "/province-picker" }}
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
                {offShoreRegions.find((x) => x.regionID == province)?.name ||
                  "Province/City"}
              </Text>
            </View>
          </Link>
        </View>
        <TextInput
          label="Xã/Phường"
          placeholder="Ward"
          value={ward}
          onChangeText={setWard}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Vị trí tọa độ (Kình, vì độ)"
          placeholder="Vị trí tọa độ (Kình, vì độ)"
          value={coordinateLocation}
          onChangeText={setCoordinateLocation}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Tần số liên lạc"
          placeholder="Tần số liên lạc"
          value={contactNumber}
          onChangeText={setContactNumber}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <View style={{ marginVertical: 10 }}>
          <Text>Đặc điểm kỹ thuật cảng cá</Text>
          <Text style={{ marginTop: 10, color: COLORS.gray }}></Text>
        </View>
        <TextInput
          label="Cô tàu lớn nhất (CV)"
          placeholder="Cô tàu lớn nhất (CV)"
          value={averageShipSize}
          onChangeText={setAverageShipSize}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Độ sâu đậu tàu (m)"
          placeholder="Độ sâu đậu tàu (m)"
          value={dockingDepth}
          onChangeText={setDockingDepth}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Vị trí bắt đầu của luồng"
          placeholder="Vị trí bắt đầu của luồng"
          value={stationPosition}
          onChangeText={setStationPosition}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Độ sâu luồng vào (m)"
          placeholder="Độ sâu luồng vào (m)"
          value={intelDepth}
          onChangeText={setIntelDepth}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Hướng luồng vào (độ N)"
          placeholder="Hướng luồng vào (độ N)"
          value={intelDirection}
          onChangeText={setIntelDirection}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Chiều dài cầu cảng (m)"
          placeholder="Chiều dài cầu cảng (m)"
          value={lengthOfWharf}
          onChangeText={setLengthOfWharf}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <TextInput
          label="Năng lực bốc xếp (tấn)"
          placeholder="Năng lực bốc xếp (tấn)"
          value={loadingCapacity}
          onChangeText={setLoadingCapacity}
          onSubmitEditing={handleCreatePost}
          returnKeyType="done"
          autoFocus
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
        <Button
          onPress={handleCreatePost}
          disabled={!name}
          style={{
            color: dark ? COLORS.primary : COLORS.white,
            backgroundColor: dark ? COLORS.white : COLORS.primary,
          }}
        >
          Submit (admin)
        </Button>
      </BodyScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
