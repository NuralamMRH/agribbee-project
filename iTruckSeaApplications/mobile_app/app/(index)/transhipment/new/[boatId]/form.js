import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { COLORS, SIZES, icons, images } from "@/constants";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from "react-native-virtualized-view";
import { useRouter } from "expo-router";
import TextInput from "@/components/ui/text-input";

const Form = () => {
  const { dark } = useTheme();
  const router = useRouter();
  const [poFor, setPoFor] = useState("");

  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    PO: "",
    FromVesselID: "",
    ToVesselID: "",
    gps: "",
    Capacity: "",
    Sharechuyentai: "",
    TankID: "",
    price: "",
  });

  const [formValidities, setFormValidities] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    console.log("POBookBottomSheet", formValues);
  }, [formValues]);

  // Validation function
  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required";
    if (id === "price" && isNaN(value)) return "Price must be a number";
    if (id === "Capacity" && isNaN(value)) return "Capacity must be a number";
    return "";
  };

  // Input Change Handler
  const inputChangedHandler = (inputId, inputValue) => {
    const errorMessage = validateInput(inputId, inputValue);

    setFormValues((prevValues) => ({
      ...prevValues,
      [inputId]: inputValue,
    }));

    console.log("inputId", inputId + " changed", inputValue);

    setFormValidities((prevValidities) => ({
      ...prevValidities,
      [inputId]: !errorMessage,
    }));

    setFormIsValid(
      Object.values({ ...formValidities, [inputId]: !errorMessage }).every(
        Boolean
      )
    );
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  const handleScanner = () => {
    router.push(`/scan`);
  };

  const handlePaymentRequest = () => {
    if (!formIsValid) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before proceeding."
      );
      return;
    }
    refRBSheet.current.close();
    router.push(`/transhipment/new/${"456776"}/SelectPaymentMethods`);
  };

  return (
    <View>
      <Text
        style={[
          styles.bottomTitle,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {poFor || "For Buyer to issue PO"}
      </Text>
      <View style={styles.separateLine} />

      <ScrollView
        style={{ width: SIZES.width - 32, marginBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {[
            { id: "PO", placeholder: "PO#" },
            {
              id: "FromVesselID",
              placeholder: "From Vessel ID#",
              isScan: true,
            },
            { id: "ToVesselID", placeholder: "To Vessel ID#", isScan: true },
            { id: "gps", placeholder: "GPS" },
            { id: "Capacity", placeholder: "Capacity" },
            { id: "Sharechuyentai", placeholder: "4Share chuyen tai" },
            { id: "TankID", placeholder: "Tank ID#" },
            { id: "price", placeholder: "Price" },
          ].map(({ id, placeholder, isScan }) => (
            <TextInput
              autoCapitalize="none"
              key={id}
              keyboardType={id}
              onInputChanged={(value) => inputChangedHandler(id, value)}
              errorText={
                formValidities[id] ? "" : validateInput(id, formValues[id])
              }
              placeholder={placeholder}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              handleScanner={isScan ? handleScanner : undefined}
              value={isScan && scanResult ? scanResult : formValues[id]}
              isScan={isScan}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomSheetBottomContainer,
          { position: "absolute", bottom: 20, zIndex: 11 },
        ]}
      >
        <Button
          title="Reset"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            borderRadius: 32,
            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
          }}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => refRBSheet.current.close()}
        />
        <Button
          title="Book"
          filled
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: COLORS.primary,
            borderRadius: 32,
          }}
          onPress={handlePaymentRequest}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  courseImage: {
    width: SIZES.width,
    height: SIZES.width * 0.625,
  },
  headerContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 999,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseName: {
    fontSize: 26,
    fontFamily: "bold",
    color: COLORS.black,
  },
  courseInfoContainer: {
    padding: 16,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
    marginLeft: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  categoryContainer: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.transparentTertiary,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 22,
  },
  starTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  priceContainer: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  info: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.gray,
    marginEnd: 15,
  },
  infoRight: {
    fontSize: 14,
    fontFamily: "bold",

    color: COLORS.gray,
  },

  infoLeft: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    marginEnd: 15,
  },
  price: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  oldPrice: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.gray,
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  courseResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseViewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseViewIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  courseViewTitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    marginLeft: 6,
  },
  separateLine: {
    width: SIZES.width,
    height: 0.4,
    backgroundColor: COLORS.gray,
    marginTop: 16,
  },
  tabContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    height: 96,
    width: SIZES.width,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width,
  },
  bottomBtn: {
    width: SIZES.width - 32,
  },
});

export default Form;
