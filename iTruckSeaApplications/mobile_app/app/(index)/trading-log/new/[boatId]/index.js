import { useLocalSearchParams } from "expo-router"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

const Index = () => {
  const { boatId } = useLocalSearchParams()
  return (
    <View>
      <Text>{boatId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Index
