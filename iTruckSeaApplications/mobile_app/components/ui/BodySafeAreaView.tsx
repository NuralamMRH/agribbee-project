import React, { forwardRef } from "react"
import {
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle,
} from "react-native"
import { useTheme } from "@/theme/ThemeProvider"

interface BodyScrollViewProps extends ScrollViewProps {
  safeAreaStyle?: ViewStyle
  containerStyle?: ViewStyle
}

const BodySafeAreaView = forwardRef<ScrollView, BodyScrollViewProps>(
  ({ children, safeAreaStyle, containerStyle, ...props }, ref) => {
    const { colors } = useTheme()
    return (
      <SafeAreaView
        style={[safeAreaStyle, { flex: 1, backgroundColor: colors.background }]}
      >
        <ScrollView
          ref={ref}
          style={{ flex: 1 }}
          contentContainerStyle={[
            containerStyle,
            { backgroundColor: colors.background, padding: 16 },
          ]}
          {...props}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    )
  }
)

export default BodySafeAreaView
