import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground,
} from "react-native";
import OnboardingStyles from "@/styles/OnboardingStyles";
import { COLORS, SIZES, icons, images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import Map from "@/components/Map";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import HomeHeader from "@/components/ui/HomeHeader";
import { FlatList } from "react-native";
import {
  mainAppFeatures,
  filteredCourses,
  category,
  topMentors,
  mostPopularBoats,
} from "@/data";
import WidgetList from "@/components/SortableList/WidgetList";
import CourseCard from "@/components/BoatCard";
import SectionHeader from "@/components/SectionHeader";
import { usePortListTripIds } from "@/stores/PostItemStore";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState(["1"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, dark } = useTheme();
  const router = useRouter();

  const keyExtractor = (item) => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handleChangePage = (path) => {
    console.log("path: ", path);
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(path);
  };

  console.log("Ports:, ", usePortListTripIds());

  /**
   * Render To Main Features Options
   */
  const renderTopMainFeatures = () => {
    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        onPress={() => handleChangePage(item.target)}
        style={[
          styles.mentorContainer,
          {
            maxWidth: SIZES.width / 6,
            alignContent: "center",
          },
        ]}
        key={index}
      >
        <Image
          source={item.avatar}
          resizeMode="cover"
          style={styles.userAvatar}
        />
        <Text
          style={[
            styles.firstName,
            {
              color: dark ? COLORS.white : COLORS.primary,
              fontSize: 7,
              textAlign: "center",
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={{
            color: dark ? COLORS.gray : COLORS.primary,
            fontSize: 5,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          {item.secondName}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View style={{ marginVertical: 15 }}>
        <FlatList
          data={mainAppFeatures}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
        />
      </View>
    );
  };

  /**
   * Render Top Mentors
   */
  const renderTopMentors = () => {
    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        onPress={() => router.push("/MentorProfile")}
        // style={styles.mentorContainer}
        key={index}
      >
        <Image
          source={item.avatar}
          resizeMode="cover"
          style={styles.userAvatar}
        />
        <Text
          style={[
            styles.firstName,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
              fontSize: 8,
            },
          ]}
        >
          {item.firstName}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View>
        <SectionHeader
          title="Vessel Managers"
          subtitle="See All"
          onPress={() => router.push(`/TopMentors`)}
        />
        <FlatList
          data={topMentors}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          // ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
        />
      </View>
    );
  };

  /**
   * Render popular courses
   */

  const renderPopularCourses = () => {
    const filteredCourses = mostPopularBoats.filter(
      (course) =>
        selectedCategories.includes("1") ||
        selectedCategories.includes(course.categoryId)
    );

    // Category item
    const renderCategoryItem = ({ item }) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.id)
            ? COLORS.primary
            : "transparent",
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.id)}
      >
        <Text
          style={{
            color: selectedCategories.includes(item.id)
              ? COLORS.white
              : COLORS.primary,
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );

    // Toggle category selection
    const toggleCategory = (categoryId) => {
      const updatedCategories = [...selectedCategories];
      const index = updatedCategories.indexOf(categoryId);

      if (index === -1) {
        updatedCategories.push(categoryId);
      } else {
        updatedCategories.splice(index, 1);
      }

      setSelectedCategories(updatedCategories);
    };

    return (
      <View>
        <SectionHeader
          title="Boats"
          subtitle="See All"
          onPress={() => router.push(`/transhipment/new`)}
        />
        {/* <FlatList
          data={category}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderCategoryItem}
        /> */}
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            return (
              <CourseCard
                name={item.name}
                image={item.image}
                category={item.category}
                price={item.price}
                isOnDiscount={item.isOnDiscount}
                oldPrice={item.oldPrice}
                rating={item.rating}
                numStudents={item.numStudents}
                onPress={() =>
                  router.push(`/transhipment/new/${item.id}/CourseDetailsMore`)
                }
                categoryId={item.categoryId}
              />
            );
          }}
        />
      </View>
    );
  };
  // StatusBar.setBarStyle(dark ? "light-content" : "dark-content");

  return (
    <ImageBackground
      source={images.backgroundImage}
      style={OnboardingStyles.backgroundImage}
    >
      <SafeAreaView style={[styles.area]}>
        <View
          style={[
            styles.container,
            { backgroundImage: images.backgroundImage },
          ]}
        >
          <HomeHeader />
          <ScrollView showsVerticalScrollIndicator={false}>
            <WidgetList />
            {renderTopMainFeatures()}
            {/* <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
                height: SIZES.height / 2 - 100,
                flex: 1,
                borderRadius: 20,
                overflowL: "hidden",
              }}
            >
              <Map />
            </View> */}
            {renderTopMentors()}
            {renderPopularCourses()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeeting: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginLeft: 12,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginTop: 10,
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
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
  },
  bannerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerDicount: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerDiscountName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white,
  },
  bannerDiscountNum: {
    fontSize: 46,
    fontFamily: "bold",
    color: COLORS.white,
  },
  bannerBottomContainer: {
    marginTop: 8,
  },
  bannerBottomTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
  },
  bannerBottomSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    marginTop: 4,
  },
  mentorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  firstName: {
    fontSize: 16,
    fontFamily: "safe sans-serif",
    fontWeight: "semiBold",
    color: COLORS.dark2,
    marginTop: 6,
  },
  bannerItemContainer: {
    width: "100%",
    paddingBottom: 10,
    backgroundColor: "transparent",
    height: 170,
    borderRadius: 32,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
  iTruckSeaLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // Half of the width/height for a circular border
    objectFit: "cover",
  },
});

export default Index;
