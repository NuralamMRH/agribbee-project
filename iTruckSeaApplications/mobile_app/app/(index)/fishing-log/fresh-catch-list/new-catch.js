import React, { useEffect, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TextInput from "@/components/ui/text-input";
import { appleBlue, backgroundColors } from "@/constants/Colors";
import { useListCreation } from "@/context/ListCreationContext";
import { useAddPostCallback, usePortListIds } from "@/stores/PostListsStore";
import RenderHeader from "@/components/ui/RenderHeader";
import { COLORS, icons, SIZES } from "@/constants";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import Button from "@/components/ui/button";
import { offShoreRegions, seaPortList } from "@/data";
import { useRow } from "tinybase/ui-react";
import { useTheme } from "@/theme/ThemeProvider";

export default function CreateDepartureScreen() {
  const [vesselId, setVesselId] = useState("");
  const [name, setName] = useState("");
  const [crews, setCrews] = useState("");
  const [dateOfDeparture, setDateOfDeparture] = useState("");
  const [boatOwner, setBoatOwner] = useState("");
  const { placeOfDeparture, setPlaceOfDeparture } = useState("");
  const { departureReason, setDepartureReason } = useState("");
  const { planDuration, setPlanDuration } = useState("");

  // context
  const { fishingZone, setFishingZone } = useListCreation();
  const { selectSeaPort, setSelectSeaPort } = useListCreation(
    seaPortList[0].portId
  );
  const { province, setProvince } = useListCreation();

  const { dark } = useTheme();
  const router = useRouter();
  const useAddPostList = useAddPostCallback();

  const portListIds = usePortListIds();

  const allPortList = {
    ...seaPortList,
    ...portListIds,
  };

  useEffect(() => {
    setFishingZone("A");
    setSelectSeaPort("");
    setProvince("");

    // Cleanup function to reset context when unmounting
    return () => {
      setFishingZone("");
    };
  }, []);

  const handleCreatePost = () => {
    if (!name) {
      return;
    }

    const tripId = useAddPostList("TRIP", {
      vesselId,
      boatOwner,
      portId: selectSeaPort,
      name,
      crews,
      dateOfDeparture,
      province: fishingZone,
      placeOfDeparture,
      departureReason,
      planDuration,
    });

    console.log("handleCreatePort: ", selectSeaPort);

    router.replace({
      pathname: "/request-dock/request-departure/[tripId]/share",
      params: { tripId },
    });
  };

  const post = useRow("posts", selectSeaPort || "");

  return (
    <BodySafeAreaView>
      {Platform.OS === "android" ? (
        <RenderHeader title={"Nhật Ký Khai Thác Mẻ Lưới"} />
      ) : (
        <Stack.Screen
          options={{
            headerLargeTitle: false,
            headerTitle: "Nhật Ký Khai Thác Mẻ Lưới",
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
      <View style={styles.inputContainer}>
        <View style={styles.inputBoxContainer}>
          <Text>Case size</Text>

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
              <Text>15KG</Text>
            </View>
          </Link>
        </View>
        <View style={styles.inputBoxContainer}>
          <Text>Tank</Text>

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
              <Text>#Tank 1</Text>
            </View>
          </Link>
        </View>
        <View style={styles.inputBoxContainer}>
          <Text>Haul (mẻ lưới)</Text>

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
              <Text>3</Text>
            </View>
          </Link>
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => router.push("/fishing-log/fresh-catch-list/fish-scan")}
          style={{
            backgroundColor: dark ? COLORS.white : COLORS.primary,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Image
            source={icons.scanner}
            resizeMode="cover"
            style={{ width: 40, height: 40, tintColor: "#fff" }}
          />
          <Text style={{ color: dark ? COLORS.primary : COLORS.white }}>
            Ai Fish Scan
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        label="Fish Type"
        placeholder="Fish Type"
        value={planDuration}
        onChangeText={setPlanDuration}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <TextInput
        label="Fishing location"
        placeholder="Fishing location"
        value={vesselId}
        onChangeText={setVesselId}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <TextInput
        label="Ten Tau"
        placeholder="Vessel name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <TextInput
        label="Time"
        placeholder="Time"
        value={crews}
        onChangeText={setCrews}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <TextInput
        label="Ngày khởi hành"
        placeholder="Date of departure"
        value={dateOfDeparture}
        onChangeText={setDateOfDeparture}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />

      <TextInput
        label="Fish Name"
        placeholder="Fish Name"
        value={boatOwner}
        onChangeText={setBoatOwner}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <View style={styles.inputBoxContainer}>
        <Text>Species</Text>

        <Link style={{ marginTop: 10 }} href={{ pathname: "/province-picker" }}>
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
            <Text>Species</Text>
          </View>
        </Link>
      </View>
      <TextInput
        label="Fish Size"
        placeholder="Fish Size"
        value={placeOfDeparture}
        onChangeText={setPlaceOfDeparture}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
      />
      <TextInput
        label="Net kg/case"
        placeholder="Net kg/case"
        value={departureReason}
        onChangeText={setDepartureReason}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
        multiline={true}
      />
      <TextInput
        label="Case"
        placeholder="Case"
        value={departureReason}
        onChangeText={setDepartureReason}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
        multiline={true}
      />
      <TextInput
        label="Fish Weight"
        placeholder="Fish Weight"
        value={departureReason}
        onChangeText={setDepartureReason}
        onSubmitEditing={handleCreatePost}
        returnKeyType="done"
        autoFocus
        inputStyle={styles.titleInput}
        containerStyle={styles.inputBoxContainer}
        multiline={true}
      />
      <Button
        onPress={handleCreatePost}
        disabled={!name}
        style={{
          backgroundColor: dark ? COLORS.white : COLORS.primary,
          color: dark ? COLORS.primary : COLORS.white,
        }}
      >
        YÊU CẦU RỜI CẢNG
      </Button>
    </BodySafeAreaView>
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
