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
import { StatusBar } from "expo-status-bar";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { CourseAbout, CourseLessons, CourseReviews } from "@/tabs";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from "react-native-virtualized-view";
import Input from "@/components/Input";
import { useRouter } from "expo-router";
import TextInput from "@/components/ui/text-input";
const renderScene = SceneMap({
  first: CourseLessons,
  second: CourseAbout,
  third: CourseReviews,
});

const isTestMode = true;

// Initial state for form validation
const initialState = {
  inputValues: {
    PO: "",
    FromVesselID: "",
    ToVesselID: "",
    gps: "",
    Capacity: "",
    Sharechuyentai: "",
    TankID: "",
    price: "",
  },
  inputValidities: {},
  formIsValid: false,
};

// Reducer function for handling form updates
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      const updatedValues = {
        ...state.inputValues,
        [action.inputId]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.inputId]: action.isValid,
      };

      const formIsValid = Object.values(updatedValidities).every(Boolean);

      return {
        ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid,
      };
    default:
      return state;
  }
};

// Validation function
const validateInput = (id, value) => {
  if (!value.trim()) return "This field is required";
  if (id === "price" && isNaN(value)) return "Price must be a number";
  if (id === "Capacity" && isNaN(value)) return "Capacity must be a number";
  return "";
};

const POBookBottomSheet = ({ refRBSheet, poFor }) => {
  const { dark } = useTheme();
  const router = useRouter();

  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState(null);
  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  // Input Change Handler
  const inputChangedHandler = useCallback((inputId, inputValue) => {
    const errorMessage = validateInput(inputId, inputValue);
    dispatchFormState({
      type: "INPUT_CHANGE",
      inputId,
      value: inputValue,
      isValid: !errorMessage,
    });
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  const handleScanner = () => {
    router.push(`/scan`);
  };

  const handlePaymentRequest = () => {
    // if (!formState.formIsValid) {
    //   Alert.alert(
    //     "Validation Error",
    //     "Please fix the errors before proceeding."
    //   );
    //   return;
    // }
    refRBSheet.current.close();
    router.push(`/transhipment/new/${"456776"}/SelectPaymentMethods`);
  };

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={680}
      customStyles={{
        wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
        draggableIcon: { backgroundColor: dark ? COLORS.dark3 : "#000" },
        container: {
          borderTopRightRadius: 32,
          borderTopLeftRadius: 32,
          height: 680,
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          alignItems: "center",
          position: "relative",
        },
      }}
    >
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
              key={id}
              id={id}
              onInputChanged={inputChangedHandler}
              errorText={
                formState.inputValidities[id]
                  ? ""
                  : validateInput(id, formState.inputValues[id])
              }
              placeholder={placeholder}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              handleScanner={isScan ? handleScanner : undefined}
              value={
                isScan && scanResult ? scanResult : formState.inputValues[id]
              }
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
    </RBSheet>
  );
};

const CourseDetailsMore = ({ navigation }) => {
  const router = useRouter();
  const refRBSheet = useRef();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const layout = useWindowDimensions();
  const { colors, dark } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Tanks" },
    { key: "second", title: "About" },
    { key: "third", title: "Reviews" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={[
            {
              color: focused ? COLORS.primary : "gray",
              fontSize: 16,
              fontFamily: "semiBold",
            },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar hidden />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerContainer}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Image
          source={isMapOpen ? images.mapScreenshot : images.boat1}
          resizeMode="cover"
          style={styles.courseImage}
        />

        {/* course info */}
        <View style={styles.courseInfoContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.courseName,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              iTruckSea xyzs
            </Text>
            <View flexDirection="row">
              <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
                <Image
                  source={
                    isBookmarked ? icons.bookmark2 : icons.bookmark2Outline
                  }
                  resizeMode="contain"
                  style={styles.bookmarkIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsMapOpen(!isMapOpen)}>
                <Image
                  source={isMapOpen ? icons.mapPointer : icons.mapPointer}
                  resizeMode="contain"
                  style={styles.bookmarkIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Reviews and rating container */}
          <View style={styles.ratingContainer}>
            <TouchableOpacity style={styles.categoryContainer}>
              <Text style={styles.categoryName}>Captain: Nguyen Van A</Text>
            </TouchableOpacity>

            <View style={styles.starContainer}>
              <Image
                source={icons.star2}
                resizeMode="contain"
                style={styles.starIcon}
              />
              <Text
                style={[
                  styles.starTitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                {"   "}4.8 (9 reviews)
              </Text>
            </View>
          </View>
          {/* Price container */}
          <View style={styles.infoContainer}>
            <Text style={styles.info}>SPH-SeaPortHome:</Text>
            <Text style={styles.info}>28 BaRia</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Capacity:</Text>
            <Text style={styles.info}>180 tons</Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <View style={styles.priceContainer}>
              <Text style={styles.infoLeft}>24 tons</Text>
              <Text style={styles.infoRight}>Available 4Share(III)</Text>
            </View>
            <Text style={styles.bottomBtn}>(2 Tanks x 12 tons)</Text>
          </View>

          {/* course resume container */}
          <View style={styles.courseResumeContainer}>
            <View style={styles.courseViewContainer}>
              <Image
                source={icons.users}
                resizeMode="contain"
                style={styles.courseViewIcon}
              />
              <Text
                style={[
                  styles.courseViewTitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                75 kilometers away
              </Text>
            </View>
            <View style={styles.courseViewContainer}>
              <Image
                source={icons.time}
                resizeMode="contain"
                style={styles.courseViewIcon}
              />
              <Text
                style={[
                  styles.courseViewTitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                2,5 Hours
              </Text>
            </View>
            <View style={styles.courseViewContainer}>
              <Image
                source={icons.document2}
                resizeMode="contain"
                style={styles.courseViewIcon}
              />
              <Text
                style={[
                  styles.courseViewTitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                0 Compliance
              </Text>
            </View>
          </View>
          <View style={styles.separateLine} />
        </View>

        <View style={styles.tabContainer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </View>

        <View
          style={[
            styles.bottomContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: dark ? COLORS.dark3 : COLORS.gray,
              borderWidth: dark ? 1 : 0.2,
            },
          ]}
        >
          <Button
            title="Select"
            filled
            style={styles.bottomBtn}
            onPress={() => refRBSheet.current.open()}
          />
        </View>
      </View>

      <POBookBottomSheet
        refRBSheet={refRBSheet}
        poFor={"For Buyer to issue PO)"}
        navigation={navigation}
      />
    </>
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

export default CourseDetailsMore;
