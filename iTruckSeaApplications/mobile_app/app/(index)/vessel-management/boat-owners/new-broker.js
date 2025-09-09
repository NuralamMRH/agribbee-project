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
  // Vessel Information
  const [owner, setOwner] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [residence, setResidence] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [hullMaterial, setHullMaterial] = useState("");
  const [engineModel, setEngineModel] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [boatEnergy, setBoatEnergy] = useState("");

  // Cold Room
  const [additiveChemical, setAdditiveChemical] = useState("");
  const [tankQuantity, setTankQuantity] = useState("");

  // Crew Information
  const [captain, setCaptain] = useState("");
  const [captainLicense, setCaptainLicense] = useState("");
  const [engineer, setEngineer] = useState("");
  const [engineerLicense, setEngineerLicense] = useState("");
  const [totalWorkers, setTotalWorkers] = useState("");
  const [crewMembers, setCrewMembers] = useState([
    "ss",
    "dsf",
    "fdf",
    "df",
    "fdf",
  ]);

  // Scanner Information
  const [scannerName, setScannerName] = useState("");

  // Existing states
  const [dateOfDeparture, setDateOfDeparture] = useState("");
  const [province, setProvince] = useState("");
  const [fishingZone, setFishingZone] = useState("");
  const [selectSeaPort, setSelectSeaPort] = useState("");

  // Context and theme
  const { dark } = useTheme();
  const router = useRouter();
  const useAddPostList = useAddPostCallback();

  useEffect(() => {
    setFishingZone("A");
    setSelectSeaPort("");
    setProvince("");

    return () => {
      setFishingZone("");
    };
  }, []);

  const handleCreatePost = () => {
    const tripData = {
      owner,
      citizenId,
      residence,
      registrationNumber,
      vesselType,
      purpose,
      hullMaterial,
      engineModel,
      engineNumber,
      boatEnergy,
      additiveChemical,
      tankQuantity,
      captain,
      captainLicense,
      engineer,
      engineerLicense,
      totalWorkers,
      crewMembers,
      scannerName,
      dateOfDeparture,
      province,
      fishingZone,
      selectSeaPort,
    };

    const tripId = useAddPostList("TRIP", tripData);

    router.replace({
      pathname: "/request-dock/request-departure/[tripId]/share",
      params: { tripId },
    });
  };

  return (
    <BodySafeAreaView>
      {Platform.OS === "android" ? (
        <RenderHeader title={"Fleet Brokers /Add Vessel"} />
      ) : (
        <Stack.Screen
          options={{
            headerLargeTitle: false,
            headerTitle: "Fleet Brokers /Add Vessel",
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
          onPress={() =>
            router.push("/vessel-management/boat-owners/new-broker")
          }
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
            Ai doc scan
          </Text>
        </TouchableOpacity>
      </View>
      {/* Vessel Information Section */}
      <View>
        <TextInput
          label="Chủ tàu (Boat Owner)"
          placeholder="Nguyễn Văn A"
          value={owner}
          onChangeText={setOwner}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="CCCD (Citizen ID)"
          placeholder="XYZ123"
          value={citizenId}
          onChangeText={setCitizenId}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Nơi thường trú (Residence)"
          placeholder="19/2, Thị trấn Long Điền"
          value={residence}
          onChangeText={setResidence}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Số đăng ký (Registration Number)"
          placeholder="BV-94171-TB"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Kiểu tàu (Vessel Type)"
          placeholder="Tàu cá"
          value={vesselType}
          onChangeText={setVesselType}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Công dụng (Purpose)"
          placeholder="Lưới vây"
          value={purpose}
          onChangeText={setPurpose}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Vật liệu vỏ (Hull Material)"
          placeholder="Gỗ"
          value={hullMaterial}
          onChangeText={setHullMaterial}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Ký hiệu máy (Engine Model)"
          placeholder="HINO"
          value={engineModel}
          onChangeText={setEngineModel}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Số máy (Engine Number)"
          placeholder="B-11124"
          value={engineNumber}
          onChangeText={setEngineNumber}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
      </View>

      {/* Cold Room Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cold Room</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Tên hóa chất phụ gia (Additive Chemical)"
          placeholder="Muối/Urea/Hàn the"
          value={additiveChemical}
          onChangeText={setAdditiveChemical}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Số lượng Tank (Tank Quantity)"
          placeholder="6"
          value={tankQuantity}
          onChangeText={setTankQuantity}
          keyboardType="numeric"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
      </View>

      {/* Crew Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin thuyền viên</Text>
      </View>
      <View>
        <TextInput
          label="Thuyền trưởng (Captain)"
          placeholder="Nguyễn Văn A"
          value={captain}
          onChangeText={setCaptain}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Số bằng (License Number)"
          placeholder="XYZ"
          value={captainLicense}
          onChangeText={setCaptainLicense}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Cơ khí thơ máy (Engineer)"
          placeholder="Nguyễn Văn B"
          value={engineer}
          onChangeText={setEngineer}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        <TextInput
          label="Tổng số công nhân (Total Workers)"
          placeholder="5"
          value={totalWorkers}
          onChangeText={setTotalWorkers}
          keyboardType="numeric"
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />

        {crewMembers.map((_, index) => (
          <TextInput
            key={index}
            label={`Công nhân ${index + 1}`}
            placeholder={`Đoàn Văn ${String.fromCharCode(65 + index)}`}
            value={crewMembers[index]}
            onChangeText={(text) => {
              const newCrew = [...crewMembers];
              newCrew[index] = text;
              setCrewMembers(newCrew);
            }}
            inputStyle={styles.titleInput}
            containerStyle={styles.inputBoxContainer}
          />
        ))}
      </View>

      {/* Scanner Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Al scanner</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Tên scanner"
          placeholder="LỆ THỊ NGỌC LÝ"
          value={scannerName}
          onChangeText={setScannerName}
          inputStyle={styles.titleInput}
          containerStyle={styles.inputBoxContainer}
        />
      </View>
      <Button
        onPress={handleCreatePost}
        style={{
          backgroundColor: dark ? COLORS.white : COLORS.primary,
          color: dark ? COLORS.primary : COLORS.white,
        }}
      >
        Submit
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
