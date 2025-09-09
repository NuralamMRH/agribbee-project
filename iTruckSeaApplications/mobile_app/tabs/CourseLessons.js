import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../constants";
import { ScrollView } from "react-native-virtualized-view";
import SectionSubItem from "../components/SectionSubItem";
import CourseSectionCard from "../components/CourseSectionCard";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

const CourseLessons = () => {
  const navigation = useRouter();
  const { colors, dark } = useTheme();

  const totalWeight = 15 * 1000; // 15 tons in kilograms
  const weightPerCard = 15; // 15 kg per card
  const numCards = totalWeight / weightPerCard; // 60 cards

  const generateCards = () => {
    const cards = [];
    for (let i = 0; i < numCards; i++) {
      cards.push(
        <View
          key={i}
          style={[
            {
              backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
            },
          ]}
        >
          {/* Tank Summary */}
          {i === 0 && (
            <SectionSubItem
              title="Tank 1"
              subtitle={`${totalWeight / 1000}/${
                totalWeight / 1000
              } Tons fish caught`}
            />
          )}

          {/* Individual Card */}
          <CourseSectionCard
            num={(i + 1).toString().padStart(2, "0")}
            title={`${weightPerCard}kg fishes`}
            duration={`Fish caught ${10 - Math.floor(i / 10)} hour ago`}
            onPress={() => navigation.push("/CourseVideoPlay")}
            isCompleted={true}
          />
        </View>
      );
    }
    return cards;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.area, { backgroundColor: colors.background }]}
    >
      <View style={styles.subHeaderContainer}>
        <Text
          style={[
            styles.subHeaderLeft,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          8 Tanks
        </Text>
        <TouchableOpacity
          onPress={() => navigation.push("/CourseDetailsMyLessons")}
        >
          <Text style={styles.subHeaderRight}>See All</Text>
        </TouchableOpacity>
      </View>

      {generateCards()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  subHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  subHeaderLeft: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginRight: 16,
  },
  subHeaderRight: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  contentContainer: {
    backgroundColor: COLORS.tertiaryWhite,
    flex: 1,
  },
});

export default CourseLessons;
