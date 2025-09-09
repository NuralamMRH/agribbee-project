import RenderHeader from "@/components/ui/RenderHeader";
import { COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useEffect, useRef, useState } from "react";
import { allBoats, allMentors, offShoreRegions, seaPortList } from "@/data";
import RBSheet from "react-native-raw-bottom-sheet";
import { getFormatedDate } from "react-native-modern-datepicker";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "@/components/Button";
import TextInput from "@/components/ui/text-input";
import Input from "@/components/Input";
import { Feather } from "@expo/vector-icons";
import CourseCard from "@/components/BoatCard";
import MentorCard from "@/components/MentorCard";
import NotFoundCard from "@/components/NotFoundCard";
import DatePickerModal from "@/components/DatePickerModal";
import { useRouter } from "expo-router";

const New = () => {
  const { dark, colors } = useTheme();
  const [offShoreRegion, setOffShoreRegion] = useState("0");
  const [seaPort, setSeaPort] = useState("0");
  const [priceRange, setPriceRange] = useState([0, 100]); // Initial price range

  const handleSliderChange = (values) => {
    setPriceRange(values);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {Platform.OS === "android" && <RenderHeader title={"Select boat"} />}

        <RenderContent
          offShoreRegion={offShoreRegion}
          setOffShoreRegion={setOffShoreRegion}
          setSeaPort={setSeaPort}
          seaPort={seaPort}
        />
      </View>
    </SafeAreaView>
  );
};

const RenderContent = ({
  offShoreRegion,
  setOffShoreRegion,
  setSeaPort,
  seaPort,
}) => {
  const [selectedTab, setSelectedTab] = useState("veCang");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryForDiVeChang, setSearchQueryForDiVeChang] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(allBoats);
  const [filteredMentors, setFilteredMentors] = useState(allMentors);
  const [resultsCount, setResultsCount] = useState(0);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedVesselType, setSelectedVesselType] = useState();
  const [openVesselTypeModal, setOpenVesselTypeModal] = useState(false);
  const [weight, setWeight] = useState("");
  const [tank, setTank] = useState("");

  const router = useRouter();
  const { dark } = useTheme();

  const handleVesselTypeChange = (value) => {
    if (!openVesselTypeModal) {
      setOpenVesselTypeModal(true);
    } else if (openVesselTypeModal && !value) {
      setOpenVesselTypeModal(false);
    } else {
      setSelectedVesselType(value);
      setOpenVesselTypeModal(false);
    }
  };

  const vesselTypes = [
    {
      label: "Fishing Vessel",
      value: "fishing",
    },
    { label: "4Share Vessel", value: "4Share" },
    { label: "Other Vessel", value: "other" },
  ];

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  const [startedDate, setStartedDate] = useState("");

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedTab]);

  const handleSearch = () => {
    if (selectedTab === "Courses") {
      const courses = allBoats.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(courses);
      setResultsCount(courses.length);
    } else if (selectedTab === "Mentors") {
      const mentors = allMentors.filter((mentor) =>
        mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMentors(mentors);
      setResultsCount(mentors.length);
    }
  };
  return (
    <>
      {/* Search Bar */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar
          handleSearch={handleSearch}
          searchFor={"Departure Ngu Truong?"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dataList={offShoreRegions}
          setSelectedItem={setOffShoreRegion}
          selectedItem={offShoreRegion}
        />
        <SearchBar
          handleSearch={handleSearch}
          searchFor={"Đi về cảng?"}
          searchQuery={searchQueryForDiVeChang}
          setSearchQuery={setSearchQueryForDiVeChang}
          setSelectedItem={setSeaPort}
          selectedItem={seaPort}
          dataList={seaPortList}
          setWeight={setWeight}
          weight={weight}
          setTank={setTank}
          tank={tank}
        />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedTab === "veCang" && styles.selectedTab,
            ]}
            onPress={() => {
              setSelectedTab("veCang");
              setSearchQuery(""); // Clear search query when changing tab
            }}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === "veCang" && styles.selectedTabText,
              ]}
            >
              Về Cảng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedTab === "VeCangNha" && styles.selectedTab,
            ]}
            onPress={() => {
              setSelectedTab("VeCangNha");
              setSearchQuery(""); // Clear search query when changing tab
            }}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === "VeCangNha" && styles.selectedTabText,
              ]}
            >
              Về Cảng Nhà
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View
          style={{
            marginVertical: 4,
          }}
        >
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.inputBtn,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.primary,
                  borderColor: dark ? COLORS.dark2 : COLORS.primary,
                },
              ]}
              onPress={handleOnPressStartDate}
            >
              <Text
                style={{
                  color: COLORS.white,
                }}
              >
                {startedDate || "Departure"}
              </Text>
              <Feather name="calendar" size={16} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.inputBtn,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.primary,
                  borderColor: dark ? COLORS.dark2 : COLORS.primary,
                },
              ]}
              onPress={() => handleVesselTypeChange("")}
            >
              <Text
                style={{
                  color: COLORS.white,
                }}
              >
                {selectedVesselType || "Vessel Type"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: SIZES.width - 32,
            marginVertical: 10,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <TextInput
            value={weight}
            placeholder="Weight (kg)"
            secureTextEntry={false}
            onChangeText={(password) => setWeight(password)}
            style={{
              width: SIZES.width / 2 - 20,
              height: 40,
              paddingHorizontal: 5,
            }}
          />
          <TextInput
            value={tank}
            placeholder="Tank"
            secureTextEntry={false}
            onChangeText={(x) => setTank(x)}
            style={{
              width: SIZES.width / 2 - 20,
              height: 40,
              paddingHorizontal: 5,
            }}
          />
        </View>

        {/* veCang result list */}
        <View style={{ marginVertical: 16 }}>
          {offShoreRegions && seaPort ? (
            <FlatList
              data={
                selectedTab === "veCang" ? filteredCourses : filteredMentors
              }
              keyExtractor={(item) => item.id}
              disableVirtualization={true}
              scrollEnabled={false}
              snapToEnd={true}
              renderItem={({ item }) => {
                return selectedTab === "veCang" ? (
                  <CourseCard
                    name={item.name}
                    image={item.image}
                    category={item.category}
                    isOnDiscount={item.isOnDiscount}
                    oldPrice={item.oldPrice}
                    rating={item.rating}
                    numStudents={item.numStudents}
                    onPress={() =>
                      router.push(
                        `/transhipment/new/${item.id}/CourseDetailsMore`
                      )
                    }
                    categoryId={item.categoryId}
                    isVertical={false}
                  />
                ) : (
                  <CourseCard
                    name={item.name}
                    image={item.image}
                    category={item.category}
                    isOnDiscount={item.isOnDiscount}
                    oldPrice={item.oldPrice}
                    rating={item.rating}
                    numStudents={item.numStudents}
                    onPress={() =>
                      router.push(
                        `/transhipment/new/${item.id}/CourseDetailsMore`
                      )
                    }
                    categoryId={item.categoryId}
                    isVertical={false}
                  />
                );
              }}
            />
          ) : (
            <NotFoundCard />
          )}
        </View>
      </ScrollView>

      <DatePickerModal
        open={openStartDatePicker}
        startDate={startDate}
        selectedDate={startedDate}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => setStartedDate(date)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={openVesselTypeModal}
      >
        <TouchableWithoutFeedback onPress={() => handleVesselTypeChange("")}>
          <View style={[styles.modalContainer]}>
            <View
              style={[
                styles.modalSubContainer,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                },
              ]}
            >
              <FlatList
                data={vesselTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      width: SIZES.width - 120,
                      padding: 10,
                      marginVertical: 5,
                      borderColor: COLORS.gray,
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor:
                        selectedVesselType == item.label
                          ? COLORS.primary
                          : "transparent",
                    }}
                    onPress={() => handleVesselTypeChange(item.label)}
                  >
                    <Text
                      style={{
                        padding: 10,
                        color:
                          selectedVesselType == item.label
                            ? COLORS.white
                            : "#000",
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export const SearchBar = ({
  handleSearch,
  searchFor,
  searchQuery,
  setSearchQuery,
  setSelectedItem,
  selectedItem,
  dataList,
  setWeight,
  weight,
  setTank,
  tank,
}) => {
  const refRBSheet = useRef();
  const { dark } = useTheme();
  const selectOption = dataList.find((x) => x.id == selectedItem);
  console.log(
    "selected:",
    dataList.find((x) => x.id)
  );
  return (
    <>
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
          },
        ]}
      >
        <View
          style={{ display: "flex", flex: 1, flexDirection: "row", gap: 10 }}
          onPress={handleSearch}
        >
          <Image
            source={icons.search2}
            resizeMode="contain"
            style={styles.searchIcon}
          />
          <Text>{selectOption?.name || searchFor}</Text>
        </View>

        <View onPress={() => refRBSheet.current.open()}>
          <Image
            source={icons.arrowDown}
            resizeMode="contain"
            style={styles.filterIcon}
          />
        </View>
      </TouchableOpacity>
      <SearchBottomSheet
        refRBSheet={refRBSheet}
        filterFor={searchFor}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        dataList={dataList}
        setWeight={setWeight}
        weight={weight}
        setTank={setTank}
        tank={tank}
      />
    </>
  );
};

const SearchBottomSheet = ({
  refRBSheet,
  filterFor,
  setSelectedItem,
  selectedItem,
  dataList,
  setWeight,
  weight,
  setTank,
  tank,
}) => {
  const { dark } = useTheme();
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  // Toggle category selection

  // Category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedItem?.includes(item.id)
          ? COLORS.primary
          : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 12,
      }}
      onPress={() => setSelectedItem(item.id)}
    >
      <Text
        style={{
          color: selectedItem === item.id ? COLORS.white : COLORS.primary,
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const resetSearch = () => {
    setSelectedItem();
    refRBSheet.current.close();
  };

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      draggable={true}
      height={filterFor === "Đi về cảng?" ? SIZES.height - 100 : 480}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: dark ? COLORS.dark3 : "#000",
        },
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          alignItems: "center",
          position: "relative",
        },
      }}
      useNativeDriver={true}
      customModalProps={{
        animationType: "slide",
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}
    >
      <Text
        style={[
          styles.bottomTitle,
          {
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {filterFor || "Search"}
      </Text>
      <View style={styles.separateLine} />

      <View style={{ width: SIZES.width - 32, marginBottom: 190 }}>
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          renderItem={renderCategoryItem}
        />
      </View>

      <View style={[styles.separateLine]} />

      <View
        style={[
          styles.bottomContainer,
          {
            position: "absolute",
            bottom: 20,
            zIndex: 11,
          },
        ]}
      >
        <Button
          title="Reset"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            borderRadius: 10,
            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
          }}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => resetSearch()}
        />
        <Button
          title="Find 4Share Boat"
          filled
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            backgroundColor: dark ? COLORS.primary : COLORS.info,
            borderRadius: 10,
            borderColor: dark ? COLORS.primary : COLORS.info,
          }}
          onPress={() => refRBSheet.current.close()}
        />
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSubContainer: {
    height: 250,
    width: SIZES.width * 0.86,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "regular",
    marginHorizontal: 8,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between",
  },
  tabBtn: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  inputBtn: {
    width: (SIZES.width - 32) / 2 - 6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.primary,
    height: 42,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  selectedTab: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  tabBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  selectedTabText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center",
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  subResult: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
  resultLeftView: {
    flexDirection: "row",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width,
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 12,
  },
  separateLine: {
    height: 0.4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginVertical: 12,
  },
});

export default New;
