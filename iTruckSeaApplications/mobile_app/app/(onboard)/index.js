import React, { useState, useEffect } from "react"
import { View, Text, Image, ImageBackground, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import PageContainer from "@/components/PageContainer"
import DotsView from "@/components/DotsView"
import Button from "@/components/Button"
import OnboardingStyles from "@/styles/OnboardingStyles"
import { images } from "@/constants"
import { useTheme } from "@/theme/ThemeProvider"
import { useRouter } from "expo-router"

const Onboarding = ({ navigation }) => {
  const [progress, setProgress] = useState(0)
  const { colors, dark } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(intervalId)
          return prevProgress
        }
        return prevProgress + 0.5
      })
    }, 2000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (progress >= 1) {
      // navigate to the Onboarding2 Screen
      // navigation.navigate('Onboarding2')
    }
  }, [progress, navigation])

  const onNavigatePress = () => {
    router.push("/(auth)") // Replace with your target route
  }

  StatusBar.setBarStyle(dark ? "light-content" : "dark-content")

  return (
    <ImageBackground
      source={images.seaWithBoat1}
      style={OnboardingStyles.backgroundImage}
    >
      <SafeAreaView
        style={[
          OnboardingStyles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <PageContainer>
          <View style={OnboardingStyles.contentContainer}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={OnboardingStyles.illustration}
            />
            {/* <Image
                            source={images.ornament}
                            resizeMode="contain"
                            style={OnboardingStyles.ornament}
                        /> */}

            <Image
              source={images.fullLogo}
              style={OnboardingStyles.iTruckSeaLogo}
            />

            <View
              style={[
                OnboardingStyles.buttonContainer,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <View style={OnboardingStyles.titleContainer}>
                <Text style={[OnboardingStyles.title]}>
                  Supply chain boat - share
                </Text>
                <Text style={OnboardingStyles.subTitle}>traceability</Text>
              </View>

              {/* <Text
                            style={[
                                OnboardingStyles.description,
                                { color: colors.text },
                            ]}
                        >
                            We provide the best learning courses and great
                            mentors tailored for your needs.
                        </Text> */}

              <View style={OnboardingStyles.dotsContainer}>
                {progress < 1 && <DotsView progress={progress} numDots={4} />}
              </View>
              {/* <Button
                                title="Next"
                                filled
                                onPress={() =>
                                    navigation.navigate('Onboarding2')
                                }
                                style={OnboardingStyles.nextButton}
                            /> */}
              <Button
                title="Next"
                onPress={() => onNavigatePress("/(auth)/index")}
                textColor={colors.primary}
                style={OnboardingStyles.skipButton}
              />
            </View>
          </View>
        </PageContainer>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Onboarding
