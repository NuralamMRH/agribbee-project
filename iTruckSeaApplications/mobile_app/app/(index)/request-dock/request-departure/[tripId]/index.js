import { ThemedText } from "@/components/ThemedText"
import BodySafeAreaView from "@/components/ui/BodySafeAreaView"
import RenderHeader from "@/components/ui/RenderHeader"
import { useLocalSearchParams } from "expo-router"
import React from "react"
import { Platform, StyleSheet, Text, View } from "react-native"

const Index = () => {
  const { tripId } = useLocalSearchParams()
  return (
    <BodySafeAreaView>
      {Platform.OS == "android" && <RenderHeader title={"Port Details"} />}
      <View>
        <Text style={{ fontSize: 40, textTransform: "uppercase" }}>
          {tripId}
        </Text>
        <Text style={{ fontSize: 40, textTransform: "uppercase" }}>
          Details
        </Text>
      </View>
    </BodySafeAreaView>
  )
}

const styles = StyleSheet.create({})

export default Index
