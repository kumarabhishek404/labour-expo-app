import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";

type ButtonProps = {
  isPrimary: boolean;
  title: string;
  onPress: any;
  icon?: any;
  style?: any;
  textStyle?: any;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  isPrimary,
  title,
  onPress,
  icon,
  style,
  textStyle,
  bgColor,
  borderColor,
  textColor,
  loading,
  disabled,
}: ButtonProps) {
  const handlePress = (data: any) => {
    Keyboard.dismiss(); // Dismiss the keyboard before button action
    onPress(data);
  };

  const containerStyles = {
    backgroundColor: bgColor || (isPrimary ? Colors.primary : Colors.white),
    borderWidth: 2,
    borderColor: borderColor || Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: loading || icon ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  const textStyles = {
    color: textColor || (isPrimary ? Colors.white : Colors.primary),
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    display: "flex",
    flexWrap: "wrap",
    ...textStyle,
  };

  const activityIndicatorColor = isPrimary ? Colors.white : Colors.primary;

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={handlePress}
      style={containerStyles}
    >
      {icon && icon}
      <CustomHeading style={textStyles}>{title}</CustomHeading>
      {loading && (
        <ActivityIndicator
          style={{ marginLeft: 10 }}
          color={activityIndicatorColor}
          animating={true}
        />
      )}
    </TouchableOpacity>
  );
}
