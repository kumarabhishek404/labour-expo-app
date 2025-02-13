import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";
import ErrorText from "../commons/ErrorText";

type TextInputProps = {
  label: string;
  name: string;
  type?: string;
  maxLength?: number;
  placeholder: string;
  value: string;
  onChangeText: any;
  onBlur?: any;
  icon?: any;
  secureTextEntry?: any;
  secondIcon?: any;
  errors?: any;
  isMobileNumberExist?: boolean | null;
  style?: any;
  inputStyle?: any;
  textStyles?: any;
  disabled?: boolean | null;
  loading?: boolean;
};

const TextInputComponent = ({
  label,
  name,
  type,
  maxLength,
  placeholder,
  value,
  onChangeText,
  onBlur,
  icon,
  secureTextEntry,
  secondIcon,
  errors,
  isMobileNumberExist,
  style,
  inputStyle,
  textStyles,
  disabled,
  loading,
}: TextInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleLabelPress = () => {
    if (!isFocused) {
      inputRef.current?.focus();
    }
  };

  // Function to handle focus event
  const handleFocus = () => setIsFocused(true);

  // Function to handle blur event
  const handleBlur = () => setIsFocused(false);

  return (
    <View
      style={[styles?.inputField, style, disabled && styles?.disabledInput]}
    >
      {label && (
        <CustomHeading
          textAlign="left"
          color={Colors?.inputLabel}
          baseFont={16}
          fontWeight="500"
        >
          {t(label)}
        </CustomHeading>
      )}
      <View
        style={[
          styles.inputContainer,
          errors?.[name] && { borderColor: Colors?.error }, inputStyle
        ]}
      >
        {icon && (
          <TouchableOpacity activeOpacity={1} onPress={handleLabelPress}>
            {icon}
          </TouchableOpacity>
        )}
        <TextInput
          ref={inputRef}
          style={[styles?.input, textStyles]}
          keyboardType={type === "number" ? "numeric" : "ascii-capable"}
          maxLength={maxLength}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.secondary}
        />
        {secondIcon && secondIcon}
        {loading && (
          <ActivityIndicator
            style={{ marginRight: 10 }}
            color={Colors?.primary}
            animating={true}
          />
        )}
      </View>
      {isMobileNumberExist && !errors?.[name] && (
        <ErrorText>
          {loading ? "Wait..." : "Mobile number already exists"}
        </ErrorText>
      )}
      {errors?.[name] && <ErrorText>{errors?.[name]?.message || ""}</ErrorText>}
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  inputField: {
    gap: 5
  },
  disabledInput: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors?.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    height: "100%",
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
});
