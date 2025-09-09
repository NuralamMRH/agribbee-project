import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import TextInput from "@/components/ui/text-input";
import { appleBlue, backgroundColors } from "@/constants/Colors";
import { useListCreation } from "@/context/ListCreationContext";
import { useAddPostCallback } from "@/stores/PostListsStore";
import { COLORS, SIZES } from "@/constants";
import Button from "@/components/ui/button";
import { offShoreRegions } from "@/data";
import { useRow } from "tinybase/ui-react";

export default function PortSearch() {
  const [name, setName] = useState("");
  const [classify, setClassify] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const { province, setProvince } = useListCreation();
  const { selectSeaPort, setSelectSeaPort } = useListCreation();

  const { dark } = useTheme();
  const router = useRouter();
  const useAddPostList = useAddPostCallback();

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

    const portId = useAddPostList("PORT", {
      name,
      classify,
      district,
      address,
      province,
      ward,
    });

    console.log("handleCreatePort: ", selectSeaPort);
    setSelectSeaPort(portId);

    router.replace({
      pathname: "/request-dock/port-list/[portId]",
      params: { portId },
    });
  };

  const post = useRow("posts", selectSeaPort || "");

  return (
    <>
      <View>
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
        <Button
          onPress={handleCreatePost}
          disabled={!name}
          style={{
            color: dark ? COLORS.primary : COLORS.white,
            backgroundColor: dark ? COLORS.white : COLORS.primary,
          }}
        >
          Tìm kiếm
        </Button>
      </View>
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
