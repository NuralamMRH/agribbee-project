import React from "react"
import * as Haptics from "expo-haptics"
import { Link } from "expo-router"
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native"
// import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { Swipeable } from "react-native-gesture-handler";

import Animated, {
  configureReanimatedLogger,
  FadeIn,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import Reanimated from "react-native-reanimated"
import { appleRed, borderColor } from "@/constants/Colors"
import { useDelShoppingListCallback } from "@/stores/ShoppingListsStore"

import { ThemedText } from "./ThemedText"
import { IconSymbol } from "./ui/IconSymbol"
import { usePortListTripCount, usePortListValue } from "@/stores/PostItemStore"

configureReanimatedLogger({ strict: false })

export default function PortListItem({ portId }: { portId: string }) {
  // Listening to just these cells means that the component won't unnecessarily
  // re-render if anything else in the row changes (such as the timestamps).
  const name = usePortListValue(portId, "name")
  const [address] = usePortListValue(portId, "address")
  const [classify] = usePortListValue(portId, "classify")
  const [province] = usePortListValue(portId, "province")
  const [district] = usePortListValue(portId, "district")
  const [ward] = usePortListValue(portId, "ward")
  const [phone] = usePortListValue(portId, "phone")
  const [description] = usePortListValue(portId, "description")
  const [isActive] = usePortListValue(portId, "isActive")
  const [createdAt] = usePortListValue(portId, "createdAt")
  const productCount = usePortListTripCount(portId)

  const deleteCallback = useDelShoppingListCallback(portId)

  // console.log("PORT: ", portId)

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 200 }],
    }))

    return (
      <Pressable
        onPress={() => {
          if (process.env.EXPO_OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          }
          deleteCallback()
        }}
      >
        <Reanimated.View style={[styleAnimation, styles.rightAction]}>
          <IconSymbol name="trash.fill" size={24} color="white" />
        </Reanimated.View>
      </Pressable>
    )
  }

  return (
    <Animated.View entering={FadeIn}>
      <Swipeable
        key={portId}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        overshootRight={false}
        enableContextMenu
      >
        <Link
          href={{
            pathname: "/request-dock/port-list/[portId]",
            params: { portId },
          }}
        >
          <View style={styles.swipeable}>
            <View style={styles.leftContent}>
              {/* <IconCircle emoji={emoji} backgroundColor={color} /> */}
              <View style={styles.textContent}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ textTransform: "uppercase" }}
                  numberOfLines={5}
                >
                  {portId}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.productCount}>
                  {province ? province : ""} {productCount}
                  {productCount >= 1 ? " trips" : " trip"}
                </ThemedText>
              </View>
            </View>

            <View style={styles.rightContent}>
              <IconSymbol name="chevron.right" size={14} color="#A1A1AA" />
            </View>
          </View>
        </Link>
      </Swipeable>
    </Animated.View>
  )
}

export const NicknameCircle = ({
  nickname,
  color,
  index = 0,
  isEllipsis = false,
}: {
  nickname: string
  color: string
  index?: number
  isEllipsis?: boolean
}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <ThemedText
      type="defaultSemiBold"
      style={[
        styles.nicknameCircle,
        isEllipsis && styles.ellipsisCircle,
        {
          backgroundColor: color,
          borderColor: isDark ? "#000000" : "#ffffff",
          marginLeft: index > 0 ? -6 : 0,
        },
      ]}
    >
      {isEllipsis ? "..." : nickname[0].toUpperCase()}
    </ThemedText>
  )
}

const styles = StyleSheet.create({
  rightAction: {
    width: 200,
    height: 65,
    backgroundColor: appleRed,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeable: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: borderColor,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  textContent: {
    flexShrink: 1,
  },
  productCount: {
    fontSize: 12,
    color: "gray",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nicknameContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  nicknameCircle: {
    fontSize: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 16,
    padding: 1,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  ellipsisCircle: {
    lineHeight: 0,
    marginLeft: -6,
  },
})
