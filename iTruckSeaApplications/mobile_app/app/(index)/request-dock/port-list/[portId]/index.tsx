import React, { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import ShoppingListProductItem from "@/components/ShoppingListProductItem";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  useShoppingListProductIds,
  useShoppingListValue,
} from "@/stores/ShoppingListStore";
import { Image } from "react-native";
import { COLORS, icons, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet } from "react-native";
import { Platform } from "react-native";
import { seaPortList } from "@/data";

const ICON_COLOR = "#007AFF";

export default function ListScreen() {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const { portId } = useLocalSearchParams() as { portId: string };

  const newProductHref = {
    pathname: "/request-dock/port-list/[portId]/product/new",
    params: { portId },
  } as const;

  const portData = seaPortList.find((port) => port.name === portId);

  console.log("portId", portData);

  const handleNewListPress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/request-dock/port-list/${portData.name}/edit`);
  };

  const renderHeaderRight = () => (
    <Pressable onPress={handleNewListPress} style={styles.headerButton}>
      <IconSymbol name="plus" color={ICON_COLOR} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.back()}
      style={[styles.headerButton, styles.headerButtonLeft]}
    >
      <IconSymbol
        name="arrow.left"
        color={ICON_COLOR}
        style={{ marginRight: Platform.select({ default: 0, android: 8 }) }}
      />
    </Pressable>
  );

  /**
   * Render android header
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
            Tàu Chuyển Tải
          </Text>
        </View>
        <TouchableOpacity onPress={handleNewListPress}>
          <Text>Edit</Text>
          <Image
            source={icons.editPencil}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={{ padding: 16, backgroundColor: colors.background }}>
        {Platform.OS === "android" ? (
          renderHeader()
        ) : (
          <Stack.Screen
            options={{
              title: "THÔNG TIN CẢNG CÁ",
              headerRight: renderHeaderRight,
              headerLeft: renderHeaderLeft,
            }}
          />
        )}

        <View style={styles.container}>
          <View style={styles.titleInput}>
            <Text>PortId: {portData.portId || ""}</Text>
          </View>
          <View style={styles.titleInput}>
            <Text>Port Name: {portData.name || ""}</Text>
          </View>
          <View style={styles.titleInput}>
            <Text>Port classify: {portData.classify || ""}</Text>
          </View>
          <View style={styles.titleInput}>
            <Text>Port district: {portData.district || ""}</Text>
          </View>
          <View style={styles.titleInput}>
            <Text>Port address: {portData.address || ""}</Text>
          </View>
          <View style={styles.titleInput}>
            <Text>Port province: {portData.province || ""}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  headerButton: {
    padding: 8,
    paddingRight: 0,
    marginHorizontal: Platform.select({ web: 16, default: 0 }),
  },
  headerButtonLeft: {
    paddingLeft: 0,
  },

  container: {
    padding: 16,
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
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
});
