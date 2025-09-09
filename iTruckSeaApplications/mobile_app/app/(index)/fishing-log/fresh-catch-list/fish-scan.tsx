import { useState, useRef } from "react"
import { CameraView, useCameraPermissions } from "expo-camera"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import Button from "@/components/ui/button"
import * as ImageManipulator from "expo-image-manipulator"
import axios from "axios"

const GOOGLE_VISION_API_KEY = "AIzaSyDx1rIGBTOmapeI7EfPWVhfLj2KOra-shE" // Replace with your API key

export default function FishScanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const [fishInfo, setFishInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const cameraRef = useRef(null)

  const captureAndAnalyze = async () => {
    if (!cameraRef.current) return
    setLoading(true)

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true })
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 500 } }],
        { base64: true }
      )

      analyzeImage(resizedPhoto.base64)
    } catch (error) {
      console.error("Capture Error:", error)
      setLoading(false)
    }
  }

  const analyzeImage = async (base64Image) => {
    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
        {
          requests: [
            {
              image: { content: base64Image }, // Ensure this is a correct base64 string
              features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
            },
          ],
        }
      )

      const labels = response.data.responses?.[0]?.labelAnnotations || []
      const fishLabels = labels.filter((label) =>
        label.description.toLowerCase().includes("fish")
      )

      setFishInfo(fishLabels.length > 0 ? fishLabels[0] : null)
      console.log("fishInfo: ", labels)
    } catch (error) {
      console.error("Vision API Error:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!permission) return <View />
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera access</Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onPhotoCaptured={captureAndAnalyze}
      >
        <View style={styles.overlay}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : fishInfo ? (
            <Text style={styles.fishText}>
              🐟 {fishInfo.description} - {Math.round(fishInfo.score * 100)}%
            </Text>
          ) : (
            <Text style={styles.instruction}>Scanning for fish...</Text>
          )}
        </View>
      </CameraView>
      <Button onPress={captureAndAnalyze} style={styles.scanButton}>
        Scan Fish
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, width: "100%" },
  overlay: {
    position: "absolute",
    top: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 10,
  },
  instruction: { color: "white", fontSize: 18 },
  fishText: { color: "yellow", fontSize: 20, fontWeight: "bold" },
  scanButton: { position: "absolute", bottom: 20 },
})
