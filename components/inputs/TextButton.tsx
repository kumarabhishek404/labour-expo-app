import React from "react";
import { TouchableOpacity, Keyboard } from "react-native";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";

type TextButtonProps = {
  title: string;
  onPress: any;
  color?: string;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
};

export default function TextButton({
  title,
  onPress,
  color,
  style,
  textStyle,
  disabled,
}: TextButtonProps) {
  const handlePress = () => {
    if (!disabled) {
      Keyboard.dismiss();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          paddingVertical: 4,
          paddingHorizontal: 6,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <CustomHeading
        baseFont={14}
        style={[
          {
            color: color || Colors.primary,
            fontWeight: "600",
          },
          textStyle,
        ]}
      >
        {t(title)}
      </CustomHeading>
    </TouchableOpacity>
  );
}
