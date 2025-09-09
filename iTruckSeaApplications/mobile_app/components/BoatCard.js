import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES, icons } from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

const CourseCard = ({
  name,
  image,
  forShare,
  capacity,
  onPress,
  captain,
  availableForShare,
  sHpSeaPortHome,
  isVertical,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(name)}
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          flexDirection: isVertical ? "column" : "row",
          height: !isVertical && 148,
          overflow: "hidden",
        },
      ]}
    >
      {/* Boat Image */}
      <Image
        source={image}
        resizeMode="cover"
        style={{
          width: !isVertical ? 124 : "100%",
          height: !isVertical ? 124 : 150,
          borderRadius: isVertical ? 0 : 15,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          marginRight: !isVertical && 16,
        }}
      />

      <View style={{ flex: 1, marginTop: isVertical ? 10 : 0 }}>
        {/* Top Container */}
        <View style={[styles.topContainer, { width: "100%" }]}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{captain || "Nguyen Van A"}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
            <Image
              source={isBookmarked ? icons.bookmark2 : icons.bookmark2Outline}
              resizeMode="contain"
              style={[
                styles.bookmarkIcon,
                {
                  tintColor: isBookmarked ? COLORS.primary : COLORS.primary,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text
          style={[
            styles.name,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          {name}
        </Text>

        {/* Share Details */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{availableForShare || "24 Tons"}</Text>
          <Text style={styles.oldPrice}>{forShare || " 4Share"}</Text>
        </View>

        {/* Rating & Capacity */}
        <View style={styles.ratingContainer}>
          <FontAwesome name="balance-scale" size={15} color="orange" />
          <Text style={styles.rating}> {capacity || "180 tons"}</Text>
          <Text style={styles.numStudents}>
            {` | SPH  ${sHpSeaPortHome || "28 BaRia"}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
    marginVertical: 8,
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.transparentTertiary,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  name: {
    fontSize: 13,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 12,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  oldPrice: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  numStudents: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.gray,
    marginLeft: 8,
  },
});
