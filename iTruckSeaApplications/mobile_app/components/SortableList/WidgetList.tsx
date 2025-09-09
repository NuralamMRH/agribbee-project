import React from "react";
import * as Haptics from "expo-haptics";
import Tile from "./Tile";
import SortableList from "./SortableList";
import { Image, Text, View } from "react-native";
import { mainAppFeatures } from "@/data";
import { useRouter } from "expo-router";
import OnboardingStyles from "@/styles/OnboardingStyles";
import { images } from "@/constants";

const tiles = [
  {
    id: "spent",
  },
  {
    id: "cashback",
  },
  {
    id: "recent",
  },
  {
    id: "cards",
  },
];

const WidgetList = () => {
  const router = useRouter();

  const handleChangePage = (path: string): void => {
    console.log("path: ", path);

    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    router.push(path);
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 0,
          marginBottom: 10,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{ width: 140, height: 140, borderRadius: 100 }}
        />
        {/* <Image
                            source={images.ornament}
                            resizeMode="contain"
                            style={OnboardingStyles.ornament}
                        /> */}

        <Image
          source={images.fullLogo}
          resizeMode="contain"
          style={{ width: 160, height: 80 }}
        />
        <View style={OnboardingStyles.titleContainer}>
          <Text style={[OnboardingStyles.title]}>
            Supply chain boat - share
          </Text>
          <Text style={OnboardingStyles.subTitle}>traceability</Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 0,
          marginBottom: 10,
        }}
      >
        <SortableList
          editing={false}
          onDragEnd={(positions) =>
            console.log(JSON.stringify(positions, null, 2))
          }
        >
          {[...mainAppFeatures].map((tile, index) => (
            <Tile
              onLongPress={() => true}
              key={tile.shortKey + "-" + index}
              id={tile.shortKey}
              onClick={() => handleChangePage(tile.target)}
            />
          ))}
        </SortableList>
      </View>
    </>
  );
};

export default WidgetList;
