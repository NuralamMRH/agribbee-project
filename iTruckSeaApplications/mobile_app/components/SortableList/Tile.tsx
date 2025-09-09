import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS, images, SIZES } from "@/constants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    width: SIZES.width / 2 - 25,
    height: SIZES.width / 2 - 25,
    backgroundColor: "rgb(12, 192, 222)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
interface TileProps {
  id: string;
  onLongPress: () => void;
  onClick: () => void;
}

const Tile = ({ id, onClick }: TileProps) => {
  if (id === "RD1") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={[styles.container, { position: "relative", overflow: "hidden" }]}
        pointerEvents="none"
      >
        <View
          style={{
            backgroundColor: "background: rgb(254, 101, 2);",
            padding: 5,
            width: SIZES.width / 2 - 25,
            position: "absolute",
            top: 0,
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 8, color: "#ffffff" }}>
            DURING THE FISHING VOYAGE
          </Text>
        </View>

        <Image
          source={images.requestDock}
          resizeMode="cover"
          style={{
            width: 55,
            height: 55,
            borderRadius: 100,
          }}
        />
        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          YÊU CẦU CẬP CẢNG
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 0,
            textAlign: "center",
          }}
        >
          Request to Dock
        </Text>
      </TouchableWithoutFeedback>
    );
  }
  if (id === "FL2") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={styles.container}
        pointerEvents="none"
      >
        <View
          style={{
            backgroundColor: "background: rgb(254, 101, 2);",
            borderRadius: 100,
            padding: 10,
          }}
        >
          <Image
            source={images.penIcon2}
            resizeMode="cover"
            style={{
              width: 35,
              height: 35,
              borderRadius: 100,
            }}
          />
        </View>

        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          NHẬT KÝ KHAI THÁC
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          Fishing Logbook
        </Text>
      </TouchableWithoutFeedback>
    );
  }
  if (id === "TDL3") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={styles.container}
        pointerEvents="none"
      >
        <View
          style={{
            backgroundColor: "background: rgb(254, 101, 2);",
            borderRadius: 100,
            padding: 10,
          }}
        >
          <Image
            source={images.tradingLogbook2}
            resizeMode="contain"
            style={{
              width: 35,
              height: 35,
            }}
          />
        </View>

        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          NHẬT KÝ MUA BÁN
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          {"Trading Logbook > Offshore FishMarket"}
        </Text>
      </TouchableWithoutFeedback>
    );
  }
  if (id === "TSL4") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={styles.container}
        pointerEvents="none"
      >
        <View
          style={{
            padding: 10,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: -10,
            }}
          >
            <Image
              source={images.boatBlack}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
            <Image
              source={images.boatBlack}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
          </View>
          <Image
            source={images.seaWater}
            resizeMode="contain"
            style={{
              width: 80,
              height: 30,
            }}
          />
        </View>

        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 0,
          }}
        >
          NHẬT KÝ CHUYỂN TẢI{" "}
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          {"Transhipment Logbook > Boat4Share"}
        </Text>
      </TouchableWithoutFeedback>
    );
  }

  if (id === "VM5") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={styles.container}
        pointerEvents="none"
      >
        <View
          style={{
            backgroundColor: "background: rgb(254, 101, 2);",
            borderRadius: 100,
            padding: 10,
          }}
        >
          <Image
            source={images.vesselWhite}
            resizeMode="cover"
            style={{
              width: 35,
              height: 35,
            }}
          />
        </View>

        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          QUẢN LÝ TÀU
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          {"Vessel Management"}
        </Text>
      </TouchableWithoutFeedback>
    );
  }

  if (id === "SFP6") {
    return (
      <TouchableWithoutFeedback
        onPress={onClick}
        style={styles.container}
        pointerEvents="none"
      >
        <Image
          source={images.factoryImg}
          resizeMode="contain"
          style={{
            width: 100,
            height: 50,
          }}
        />

        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 12,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          NHÀ MÁY CHẾ BIẾN THỦY SẢN
        </Text>
        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "300",
            fontSize: 12,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          {"Seafood Processing Factory"}
        </Text>
      </TouchableWithoutFeedback>
    );
  }
};

export default Tile;
