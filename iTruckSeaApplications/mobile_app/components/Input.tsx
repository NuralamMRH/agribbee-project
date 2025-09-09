import React, { useState } from "react"
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from "react-native"
import { useTheme } from "@/theme/ThemeProvider"
import { COLORS } from "@/constants"

interface InputProps extends TextInputProps {
  id: string
  onInputChanged: (id: string, text: string) => void
  icon?: ImageSourcePropType
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
}

const Input: React.FC<InputProps> = ({
  id,
  onInputChanged,
  icon,
  containerStyle,
  inputStyle,
  ...props
}) => {
  const { colors, dark } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChangeText = (text: string) => onInputChanged(id, text)

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? COLORS.primary
              : dark
              ? COLORS.dark2
              : COLORS.greyscale500,
            backgroundColor: isFocused
              ? COLORS.transparentPrimary
              : dark
              ? COLORS.dark2
              : COLORS.greyscale500,
          },
        ]}
      >
        {icon && <Image source={icon} style={styles.icon} />}
        <TextInput
          {...props}
          style={[styles.input, inputStyle, { color: colors.text }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
})

export default Input
