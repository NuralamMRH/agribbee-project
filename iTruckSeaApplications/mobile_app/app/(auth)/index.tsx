import React, { useState } from "react"
import * as Haptics from "expo-haptics"
import { Href, useRouter } from "expo-router"
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ThemedText } from "@/components/ThemedText"
import Button from "@/components/ui/button"
import TextInput from "@/components/ui/text-input"
import { useSignIn } from "@clerk/clerk-expo"
import { COLORS, icons, images, SIZES } from "@/constants"
import { useTheme } from "@/theme/ThemeProvider"
import Header from "@/components/Header"
import Checkbox from "expo-checkbox"
import OrSeparator from "@/components/OrSeparator"
import SocialButton from "@/components/SocialButton"
import { ClerkAPIError } from "@clerk/types"

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [isChecked, setChecked] = useState<boolean | false>(false)
  const { colors, dark } = useTheme()
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([])
  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setIsSigningIn(true)

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("/(index)")
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setErrors(err.errors)
      // console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsSigningIn(false)
    }
  }, [isLoaded, emailAddress, password])

  const onNavigatePress = React.useCallback(
    async (path: Href) => {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      router.push(path)
    },
    [router]
  )

  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  }

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication")
  }

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication")
  }

  StatusBar.setBarStyle(dark ? "light-content" : "dark-content")

  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {Platform.OS === "android" && (
          <Header title={""} pathRoute={"/(onboard)"} />
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.mainLogo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <ThemedText
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Login to Your Account
          </ThemedText>

          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            label="Email"
            keyboardType="email-address"
            placeholder="Enter email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            value={password}
            label="Password"
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={
                  isChecked ? COLORS.primary : dark ? COLORS.primary : "gray"
                }
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                    },
                  ]}
                >
                  Remenber me
                </Text>
              </View>
            </View>
          </View>
          {errors.map((error) => (
            <ThemedText
              key={error.longMessage}
              style={{ color: "red", marginBottom: 5 }}
            >
              {error.longMessage}
            </ThemedText>
          ))}
          <Button
            onPress={onSignInPress}
            loading={isSigningIn}
            disabled={!emailAddress || !password || isSigningIn}
            style={{ backgroundColor: dark ? COLORS.white : COLORS.primary }}
          >
            Sign in
          </Button>
          <TouchableOpacity onPress={() => onNavigatePress("/reset-password")}>
            <Text style={styles.forgotPasswordBtnText}>
              Forgot the password?
            </Text>
          </TouchableOpacity>

          <View>
            <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={dark ? COLORS.white : COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
                tintColor={null}
              />
              <SocialButton
                icon={icons.google}
                onPress={googleAuthHandler}
                tintColor={null}
              />
            </View>
          </View>
          <View
            style={[
              styles.bottomContainer,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              },
            ]}
          >
            <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
              {`Don't have an account ?`}
            </Text>
            <TouchableOpacity
              onPress={() => onNavigatePress("/sign-up")}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                width: 100,
                height: 40,
                borderWidth: 0.2,
                borderColor: "#333",
                padding: 10,
                borderRadius: 50,
                marginLeft: 10,
                paddingHorizontal: 15,
                backgroundColor: COLORS.white,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: COLORS.primary,
                  padding: 2,
                  borderRadius: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: dark ? COLORS.white : "yellow",
                    fontWeight: "700",
                  }}
                >
                  vip
                </Text>
              </View>

              <Text
                style={[
                  styles.bottomRight,
                  {
                    textTransform: "uppercase",
                    fontSize: 12,
                  },
                ]}
              >
                Join VIP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    borderRadius: 100,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    marginTop: 25,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12,
  },
})
