import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode } from "expo-av";
import { WebView } from "react-native-webview"; // For YouTube and Vimeo videos
import { COLORS, icons } from "@/constants";
import { useRouter, useLocalSearchParams } from "expo-router";

const CourseVideoPlay = ({}) => {
  const video = useRef(null);
  const router = useRouter();
  const [setStatus] = useState({});
  const { portId } = useLocalSearchParams();
  const {
    videoType = "youtube",
    videoUri = "https://www.youtube.com/embed/upXH53tB1yY",
  } = portId || {};

  // Helper to render the appropriate player
  const renderVideoPlayer = () => {
    if (videoType === "youtube" || videoType === "vimeo") {
      // Use WebView for YouTube or Vimeo
      return (
        <WebView
          source={{ uri: videoUri }}
          style={styles.webview}
          allowsFullscreenVideo
        />
      );
    } else if (videoType === "mp4") {
      // Use expo-av for MP4 or local files
      return (
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      );
    } else {
      return (
        <Text style={styles.errorText}>
          Unsupported video type: {videoType}
        </Text>
      );
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <StatusBar hideTransitionAnimation="fade" style="light" />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={styles.arrowBackIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fish Catching Video</Text>
        </View>
        {renderVideoPlayer()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  arrowBackIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginLeft: 16,
  },
  headerContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  webview: {
    flex: 1,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CourseVideoPlay;
