import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES, icons, images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { Image } from "react-native";
import { useRouter } from "expo-router";
/**
 * render header
 */
const HomeHeader = () => {
  const { dark } = useTheme();
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <View style={{ width: 130, height: 48 }}>
          <Image source={images.fullLogo} style={styles.iTruckSeaLogo} />
        </View>

        {/* <Image
			  source={images.user1}
			  resizeMode='contain'
			  style={styles.userIcon}
			/> */}
        {/* <View style={styles.viewNameContainer}>
			   <Text style={styles.greeeting}>Good Morning👋</Text>
			   <Text style={[styles.title, { 
				color: dark ? COLORS.white : COLORS.greyscale900
			   }]}>Andrew Ainsley</Text>
			</View> */}
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[
              styles.bellIcon,
              {
                tintColor: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/my-bookmark")}>
          <Image
            source={icons.bookmarkOutline}
            resizeMode="contain"
            style={[
              styles.bookmarkIcon,
              {
                tintColor: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: -12,
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
    marginRight: 10,
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

export default HomeHeader;
