import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES, icons, illustrations } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import SectionSubItem from "@/components/SectionSubItem";
import CourseSectionCard from "@/components/CourseSectionCard";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import Rating from "@/components/Rating";
import { useRouter } from "expo-router";
const CourseDetails = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { colors, dark } = useTheme();

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Buying Tank Details
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContainer]}>
            <View
              style={[
                styles.modalSubContainer,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                },
              ]}
            >
              <View style={styles.backgroundIllustration}>
                <Image
                  source={illustrations.background}
                  resizeMode="contain"
                  style={styles.modalIllustration}
                />
                <Image
                  source={icons.editPencil}
                  resizeMode="contain"
                  style={styles.editPencilIcon}
                />
              </View>
              <Text style={styles.modalTitle}>PO Completed!</Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                Please leave a review for your PO.
              </Text>
              <Rating color={COLORS.primary} />
              <TextInput
                placeholder="The PO & fishes are good 🔥"
                placeholderTextColor={
                  dark ? COLORS.secondaryWhite : COLORS.black
                }
                style={styles.modalInput}
              />
              <Button
                title="Write Review"
                filled
                onPress={() => {
                  setModalVisible(false);
                  router.back();
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                }}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                }}
                textColor={dark ? COLORS.white : COLORS.primary}
                style={{
                  width: "100%",
                  marginTop: 12,
                  backgroundColor: dark
                    ? COLORS.dark3
                    : COLORS.transparentTertiary,
                  borderColor: dark ? COLORS.dark3 : COLORS.transparentTertiary,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  /**
   * Render content
   */

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
            styles.contentContainer,
            { backgroundColor: colors.background },
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
            onPress={() => navigation.navigate("CourseVideoPlay")}
            isCompleted={true}
          />
        </View>
      );
    }
    return cards;
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {generateCards()}
        </ScrollView>
      </View>
      <View
        style={[styles.bottomContainer, { backgroundColor: colors.background }]}
      >
        <Button
          title="Check Status"
          style={styles.button}
          filled
          onPress={() => setModalVisible(true)}
        />
      </View>
      {renderModal()}
    </SafeAreaView>
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
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    margin: 16,
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
  contentContainer: {
    backgroundColor: COLORS.tertiaryWhite,
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    height: 72,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
  },
  button: {
    width: SIZES.width - 32,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSubContainer: {
    height: 622,
    width: SIZES.width * 0.86,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999,
  },
  modalIllustration: {
    height: 150,
    width: 150,
  },
  modalInput: {
    width: "100%",
    height: 52,
    backgroundColor: COLORS.transparentTertiary,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginVertical: 12,
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 60,
  },
});

export default CourseDetails;
