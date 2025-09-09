import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { COLORS, icons, images } from "../constants";
import { ScrollView } from "react-native-virtualized-view";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

const CourseAbout = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const description = `We Catch fish The main species of sea fish in Vietnam include grouper, snapper, seabream, yellowtail, kingfish, wrasse, seabass, milkfish, mullet, and Tilapia. 
Floating net-cage culture 
grouper, snapper, seabream, yellowtail, kingfish, and wrasse.
Pond, lagoon, and pen culture Seabass, Milkfish, Mullet, and Tilapia`;
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = showFullDescription
    ? description
    : description.slice(0, 150);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text
        style={[
          styles.title,
          {
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        Vessel Manager
      </Text>
      <View style={styles.mentorCardContainer}>
        <View style={styles.mentorCardLeft}>
          <TouchableOpacity onPress={() => router.push("/MentorProfile")}>
            <Image
              source={images.user4}
              resizeMode="contain"
              style={styles.avatarImage}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                styles.userFullname,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Jonathan Williams
            </Text>
            <Text style={styles.position}>4 Boat owner</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Inbox")}>
          <Image
            source={icons.chatBubble2Outline}
            resizeMode="contain"
            style={styles.chatBubbleIcon}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.title,
          {
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        About Owner
      </Text>
      <View>
        <Text style={styles.description}>{truncatedDescription}</Text>
        {description.length > 150 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={{ color: COLORS.primary, marginTop: 10 }}>
              {showFullDescription ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 96,
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 12,
  },
  mentorCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mentorCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 999,
    marginRight: 16,
  },
  userFullname: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  position: {
    fontSize: 13,
    fontFamily: "medium",
    color: "gray",
  },
  chatBubbleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    color: "gray",
  },
  toolContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  toolIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  toolName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
  },
});

export default CourseAbout;
