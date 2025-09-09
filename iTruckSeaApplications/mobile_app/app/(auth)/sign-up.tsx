import * as React from "react"
import * as Haptics from "expo-haptics"
import { Href, useRouter } from "expo-router"
import { ThemedText } from "@/components/ThemedText"
import { OtpInput } from "react-native-otp-entry"
import Button from "@/components/ui/button"
import TextInput from "@/components/ui/text-input"
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo"
import { ClerkAPIError } from "@clerk/types"
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useTheme } from "@/theme/ThemeProvider"
import { COLORS, icons, images, SIZES } from "@/constants"
import Header from "@/components/Header"
import { Image } from "react-native"
import Checkbox from "expo-checkbox"
import OrSeparator from "@/components/OrSeparator"
import SocialButton from "@/components/SocialButton"

export default function SignUpScreen() {
  const [time, setTime] = React.useState(55)
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState("")
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [isChecked, setChecked] = React.useState(false)
  const { colors, dark } = useTheme()

  // implementing apple authentication
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

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setIsLoading(true)
    setErrors([])

    try {
      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
      console.log("setPendingVerification(true)")
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      // console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setIsLoading(true)

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace("/(index)")
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setErrors(err.errors)
      console.log(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigatePress = React.useCallback(
    async (path: Href) => {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      router.push(path)
    },
    [router]
  )

  if (!isLoaded) return null // Show loader
  StatusBar.setBarStyle(dark ? "light-content" : "dark-content")

  if (pendingVerification) {
    return (
      <SafeAreaView
        style={[styles.area, { backgroundColor: colors.background }]}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Header title="OTP Verification" />
          <ScrollView>
            <View style={{ paddingVertical: 50 }}>
              {/* <TextInput
              value={code}
              label={`Enter the verification code we sent to ${emailAddress}`}
              placeholder="Enter your verification code"
              onChangeText={(code) => setCode(code)}
            /> */}
              <Text
                style={[
                  styles.time,
                  {
                    color: dark ? COLORS.white : COLORS.black,
                    marginBottom: 10,
                  },
                ]}
              >
                {` Code has been send to ${emailAddress}`}
              </Text>
              <OtpInput
                numberOfDigits={6}
                onTextChange={(code) => setCode(code)}
                focusColor={COLORS.primary}
                focusStickBlinkingDuration={500}
                onFilled={(text) => console.log(`OTP is ${text}`)}
                theme={{
                  pinCodeContainerStyle: {
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.secondaryWhite,
                    borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                    borderWidth: 0.4,
                    borderRadius: 6,
                    height: 45,
                    width: 45,
                  },
                  pinCodeTextStyle: {
                    color: dark ? COLORS.white : COLORS.black,
                  },
                }}
              />

              {errors.map((error) => (
                <ThemedText key={error.longMessage} style={{ color: "red" }}>
                  {error.longMessage}
                </ThemedText>
              ))}

              <View style={styles.codeContainer}>
                <Text
                  style={[
                    styles.code,
                    {
                      color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                  ]}
                >
                  Code was expired in
                </Text>
                <Text style={styles.time}>{`  ${time}  `}</Text>
                <Text
                  style={[
                    styles.code,
                    {
                      color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                  ]}
                >
                  s
                </Text>
              </View>
            </View>
          </ScrollView>

          <Button
            onPress={onVerifyPress}
            disabled={!code || isLoading}
            loading={isLoading}
            style={styles.button}
          >
            Verify
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {Platform.OS === "android" && (
          <Header title={""} pathRoute={"/(auth)"} />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            position: "relative",
            height: SIZES.height,
          }}
        >
          <View style={styles.logoContainer}>
            <Image
              source={images.mainLogo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Create Your Account
          </Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            keyboardType="email-address"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
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
                  By continuing you accept our Privacy Policy
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
            onPress={onSignUpPress}
            disabled={!emailAddress || !password || isLoading}
            loading={isLoading}
            style={{ backgroundColor: dark ? COLORS.white : COLORS.primary }}
          >
            Continue
          </Button>
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
              Already have an account ?
            </Text>
            <TouchableOpacity
              onPress={() => onNavigatePress("/(auth)")}
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
                    fontSize: 14,
                  },
                ]}
              >
                Sign In
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
    marginVertical: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
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

  //OTP specific
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.secondaryWhite,
    borderBottomColor: "gray",
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
    borderColor: "gray",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
  },
})
