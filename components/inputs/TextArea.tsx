import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

type TextInputProps = {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  onBlur?: any;
  icon?: any;
  errors?: any;
  containerStyle?: any;
};

const TextAreaInputComponent = ({
  label,
  name,
  placeholder,
  value,
  onChangeText,
  onBlur,
  icon,
  errors,
  containerStyle,
}: TextInputProps) => {
  return (
    <View style={styles?.inputField}>
      <CustomHeading textAlign="left" color={Colors?.white}>
        {label}
      </CustomHeading>
      <View style={[styles.inputContainer, containerStyle]}>
        {icon && icon}
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          style={styles.textInput}
          placeholder={placeholder ?? "Work Title"}
          placeholderTextColor={Colors.secondary}
          verticalAlign="top"
          textAlignVertical="top"
          editable
          multiline
          numberOfLines={10}
        />
      </View>
      {errors[name] && (
        <CustomText textAlign="left" baseFont={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

export default TextAreaInputComponent;

const styles = StyleSheet.create({
  inputField: {
    gap: 5,
  },
  inputContainer: {
    height: 140,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  textInput: {
    paddingVertical: 12,
    verticalAlign: "top",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
});
