import React, { useEffect, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import TextInput from "@/components/ui/text-input";
import { appleBlue, backgroundColors } from "@/constants/Colors";
import { useListCreation } from "@/context/ListCreationContext";
import { useAddPostCallback, usePortListIds } from "@/stores/PostListsStore";
import RenderHeader from "@/components/ui/RenderHeader";
import { COLORS, SIZES } from "@/constants";
import BodySafeAreaView from "@/components/ui/BodySafeAreaView";
import Button from "@/components/ui/button";
import { offShoreRegions, seaPortList } from "@/data";
import Checkbox from "expo-checkbox";
import { useAddShoppingListProductCallback } from "@/stores/ShoppingListStore";
import SectionHeader from "@/components/SectionHeader";
import { useTheme } from "@/theme/ThemeProvider";

export default function SeafoodProcessing() {
  const { selectSeaPort, setSelectSeaPort } = useListCreation(
    seaPortList[0].portId
  );

  const portId = selectSeaPort || null;

  const { dark } = useTheme();
  const router = useRouter();
  const addShoppingListProduct = useAddShoppingListProductCallback(portId);

  // Company Information
  const [companyName, setCompanyName] = useState("");
  const [companyIntro, setCompanyIntro] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [countryRegion, setCountryRegion] = useState("");
  const [provinceState, setProvinceState] = useState("");
  const [cityTown, setCityTown] = useState("");
  const [streetRoad, setStreetRoad] = useState("");
  const [zipPostCode, setZipPostCode] = useState("");

  // Payment Information
  const [acceptedCurrencies, setAcceptedCurrencies] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [shippingPort, setShippingPort] = useState("");

  // File Uploads
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyBrochure, setCompanyBrochure] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  // Services
  const [selectedServices, setSelectedServices] = useState([]);

  // Context and Theme

  const currencyOptions = [
    "USD",
    "EUR",
    "JPY",
    "CAD",
    "AUD",
    "HKD",
    "GBP",
    "CNY",
    "CHF",
  ];
  const paymentMethodOptions = [
    "L/C",
    "D/P",
    "D/A",
    "MoneyGram",
    "Credit Card",
    "PayPal",
    "Western Union",
    "Cash",
  ];
  const serviceOptions = [
    "Customs Clearance",
    "Destination Charges",
    "Dry Warehouse",
    "Cold Warehouse",
  ];

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleFileUpload = async (type) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (type === "logo") setCompanyLogo(res);
      if (type === "brochure") setCompanyBrochure(res);
      if (type === "banner") setBannerImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = () => {
    const companyData = {
      companyName,
      companyIntro,
      mainProducts,
      countryRegion,
      provinceState,
      cityTown,
      streetRoad,
      zipPostCode,
      acceptedCurrencies,
      paymentTerms,
      shippingPort,
      companyLogo,
      companyBrochure,
      bannerImage,
      selectedServices,
    };

    console.log("Company Profile Data:", companyData);
    router.back();
  };

  return (
    <BodySafeAreaView>
      {Platform.OS === "android" ? (
        <RenderHeader title={"Đăng ký thông tin Nhà Máy Chế Biến Thu Mua"} />
      ) : (
        <Stack.Screen
          options={{
            headerLargeTitle: false,
            headerTitle: "Đăng ký thông tin Nhà Máy Chế Biến Thu Mua",
          }}
        />
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {/* Company Information Section */}
        <SectionHeader title="Company Details" />
        <TextInput
          label="Company Name"
          placeholder="ABC Trading Company"
          value={companyName}
          onChangeText={setCompanyName}
          style={styles.input}
        />

        <TextInput
          label="Company Introduction"
          placeholder="Leading supplier of agricultural products since 1990"
          value={companyIntro}
          onChangeText={setCompanyIntro}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <TextInput
          label="Main Products"
          placeholder="Rice, Coffee, Cashew Nuts"
          value={mainProducts}
          onChangeText={setMainProducts}
          style={styles.input}
        />

        {/* Address Section */}
        <SectionHeader title="Company Address" />
        <View style={styles.addressRow}>
          <TextInput
            label="Country/Region"
            placeholder="Vietnam"
            value={countryRegion}
            onChangeText={setCountryRegion}
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Province/State"
            placeholder="Ho Chi Minh"
            value={provinceState}
            onChangeText={setProvinceState}
            style={[styles.input, styles.halfWidth]}
          />
        </View>

        <View style={styles.addressRow}>
          <TextInput
            label="City/Town"
            placeholder="District 1"
            value={cityTown}
            onChangeText={setCityTown}
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Zip/Post Code"
            placeholder="700000"
            value={zipPostCode}
            onChangeText={setZipPostCode}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
        </View>

        <TextInput
          label="Street/Road"
          placeholder="123 Nguyen Hue Boulevard"
          value={streetRoad}
          onChangeText={setStreetRoad}
          style={styles.input}
        />

        {/* Payment Section */}
        <SectionHeader title="Payment & Shipping" />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginVertical: 8,
          }}
        >
          {currencyOptions.map((service, index) => (
            <View key={index + 1} style={{ width: 100, marginBottom: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Checkbox
                  style={styles.checkbox}
                  value={selectedServices.includes(service)}
                  color={
                    selectedServices.includes(service)
                      ? COLORS.primary
                      : dark
                      ? COLORS.primary
                      : "gray"
                  }
                  onValueChange={() => selectedServices.includes(service)}
                  checked={selectedServices.includes(service)}
                  // onToggle={() => handleServiceToggle(service)}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.privacy,
                      {
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                  >
                    {service}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {paymentMethodOptions.map((service, index) => (
            <View key={index + 1} style={{ width: 150, marginBottom: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Checkbox
                  style={styles.checkbox}
                  value={selectedServices.includes(service)}
                  color={
                    selectedServices.includes(service)
                      ? COLORS.primary
                      : dark
                      ? COLORS.primary
                      : "gray"
                  }
                  onValueChange={() => selectedServices.includes(service)}
                  checked={selectedServices.includes(service)}
                  // onToggle={() => handleServiceToggle(service)}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.privacy,
                      {
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                  >
                    {service}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TextInput
          label="Shipping Port"
          placeholder="Cat Lai Port"
          value={shippingPort}
          onChangeText={setShippingPort}
          style={styles.input}
        />

        {/* File Upload Section */}
        <SectionHeader title="Company Assets" />
        <FileUploadButton
          label="Company Logo"
          onPress={() => handleFileUpload("logo")}
          file={companyLogo}
        />

        <FileUploadButton
          label="Company Brochure"
          onPress={() => handleFileUpload("brochure")}
          file={companyBrochure}
        />

        <FileUploadButton
          label="Banner Image"
          onPress={() => handleFileUpload("banner")}
          file={bannerImage}
        />

        {/* Services Section */}
        <SectionHeader title="Additional Services" />
        {serviceOptions.map((service, index) => (
          <View key={index + 1} style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={selectedServices.includes(service)}
                color={
                  selectedServices.includes(service)
                    ? COLORS.primary
                    : dark
                    ? COLORS.primary
                    : "gray"
                }
                onValueChange={() => selectedServices.includes(service)}
                checked={selectedServices.includes(service)}
                // onToggle={() => handleServiceToggle(service)}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                    },
                  ]}
                >
                  {service}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Button
        onPress={handleSubmit}
        style={{
          backgroundColor: dark ? COLORS.white : COLORS.primary,
          color: dark ? COLORS.primary : COLORS.white,
        }}
      >
        Submit Profile
      </Button>
    </BodySafeAreaView>
  );
}

const MultiSelect = ({ items, selectedItems, onToggle, label }) => (
  <View style={styles.multiSelectContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.optionsContainer}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.optionButton,
            selectedItems.includes(item) && styles.selectedOption,
          ]}
          onPress={() =>
            onToggle(
              selectedItems.includes(item)
                ? selectedItems.filter((i) => i !== item)
                : [...selectedItems, item]
            )
          }
        >
          <Text
            style={[
              styles.optionText,
              selectedItems.includes(item) && styles.selectedText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const FileUploadButton = ({ label, onPress, file }) => (
  <View style={styles.fileUploadContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Text style={styles.uploadText}>{file ? file.name : "Choose File"}</Text>
    </TouchableOpacity>
    {file && <Text style={styles.fileInfo}>Uploaded: {file.size} MB</Text>}
  </View>
);

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

  fileUploadContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 4,
  },
  uploadText: {
    color: "#007bff",
  },
  fileInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
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
});
