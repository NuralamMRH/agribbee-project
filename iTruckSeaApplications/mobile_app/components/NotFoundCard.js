import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS, illustrations } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import Button from "./ui/button";

const NotFoundCard = ({ text, notFound, btn, btnText }) => {
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={illustrations.notFound}
        resizeMode="contain"
        style={styles.illustration}
      />
      <Text
        style={[
          styles.title,
          {
            color: dark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {notFound || " Not Found"}
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            color: dark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        {text ||
          "Sorry, Cannot be found anything, please check again or search."}
      </Text>

      <View style={{ marginTop: 20 }}>
        {btn && <Button onPress={btn}>{btnText || "Go Back"}</Button>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: 340,
    height: 250,
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
  },
});

export default NotFoundCard;
