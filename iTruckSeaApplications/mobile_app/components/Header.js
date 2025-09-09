import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";
import { SIZES, COLORS, icons } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";

const Header = ({ title, pathRoute = null }) => {
  const router = useRouter();
  const { colors, dark } = useTheme();

  const onNavigatePress = React.useCallback(
    async (path) => {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push(path);
    },
    [router]
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onNavigatePress(pathRoute)}
        disabled={pathRoute ? false : true}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={[
            styles.backIcon,
            {
              tintColor: colors.text,
            },
          ]}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default Header;
