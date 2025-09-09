import React from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";
import { useListCreation } from "@/context/ListCreationContext";
import { offShoreRegions } from "@/data";
import { COLORS } from "@/constants";

export default function FishingZonePicker() {
  const router = useRouter();
  const { fishingZone, setFishingZone } = useListCreation();

  const handleZoneSelect = (zone: string) => {
    setFishingZone(zone);
    console.log(`Zone: ${zone}`);

  };

  return (
    <FlatList
      data={offShoreRegions}
      renderItem={({ item, index }) => (
        <Pressable
          key={index + 1}
          onPress={() => {
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            handleZoneSelect(item.regionID);
          }}
          style={{
            backgroundColor:
              item.regionID === fishingZone ? COLORS.primary : "transparent",
            padding: 10,
            marginVertical: 5,
            borderColor: COLORS.gray,
            borderWidth: 1,
            borderRadius: 10,
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color:
                item.regionID === fishingZone ? COLORS.white : COLORS.primary,
            }}
          >
            {item.name}
          </Text>
        </Pressable>
      )}
      //   numColumns={5}
      keyExtractor={(item) => item.id}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: 0 }}
      scrollIndicatorInsets={{ bottom: 0 }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 100,
      }}
    />
  );
}
