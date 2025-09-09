import { useLocalSearchParams } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"

const Form = () => {
  const { boatId } = useLocalSearchParams()
  return (
    <View>
      <Text>{boatId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Form
