import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

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
  style?: any;
  containerStyle?: any;
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
  style,
  containerStyle,
}: TextInputProps) => {
  const inputRef = useRef(null);
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
    <View style={[styles?.inputField, style]}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      <View style={[styles.inputContainer, containerStyle]}>
        {icon && (
          <TouchableOpacity activeOpacity={1} onPress={handleLabelPress}>
            {icon}
          </TouchableOpacity>
        )}
        <TextInput
          ref={inputRef}
          style={styles?.input}
          keyboardType={type === "number" ? "numeric" : "ascii-capable"}
          maxLength={maxLength}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholder={placeholder ?? "Work Title"}
          placeholderTextColor={Colors.secondary}
        />
        {secondIcon && secondIcon}
      </View>
      {errors?.[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  inputField: {
    gap: 5,
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
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
