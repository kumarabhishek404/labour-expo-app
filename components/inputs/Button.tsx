import { ActivityIndicator, Keyboard, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import { Button } from "react-native-paper";

type ButtonProps = {
  isPrimary: boolean;
  title: any;
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

export default function ButtonComp({
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
    if (!disabled && !loading) {
      Keyboard.dismiss();
      onPress(data);
    }
  };

  const containerStyles = {
    minHeight: 30,
    backgroundColor: disabled
      ? Colors.gray // Faded color when disabled
      : bgColor || (isPrimary ? Colors?.primaryButton : Colors.white),
    borderWidth: 2,
    borderColor: disabled ? Colors.gray : borderColor || Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    flexDirection: loading || icon ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.6 : 1, // Fades button when disabled
    pointerEvents: disabled ? "none" : "auto", // Prevents interaction
    ...style,
  };

  const textStyles = {
    color: disabled
      ? Colors.darkGray // Adjust text color when disabled
      : textColor || (isPrimary ? Colors.white : Colors.primary),
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
    display: "flex",
    flexWrap: "wrap",
    ...textStyle,
  };

  const activityIndicatorColor = disabled
    ? Colors.darkGray
    : isPrimary
    ? Colors.white
    : Colors.primary;

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={handlePress}
      style={containerStyles}
    >
      {icon && icon}
      <CustomHeading style={textStyles} baseFont={textStyles?.fontSize}>
        {title}
      </CustomHeading>
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
