import { StyleSheet, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-virtualized-view";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import CourseSectionCard from "@/components/CourseSectionCard";
import SectionSubItem from "@/components/SectionSubItem";
const Lessons = () => {
  const { dark } = useTheme();
  const router = useRouter();
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
            onPress={() => router.push("/CourseVideoPlay")}
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
      style={[
        styles.contentContainer,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
        },
      ]}
    >
      {generateCards()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.tertiaryWhite,
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default Lessons;
