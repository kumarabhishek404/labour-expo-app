import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import ErrorText from "../commons/ErrorText";
import { t } from "@/utils/translationHelper";

type TextInputProps = {
  label?: string;
  name: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  onBlur?: any;
  icon?: any;
  errors?: any;
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
}: TextInputProps) => {
  return (
    <View style={styles?.inputField}>
      {label && (
        <CustomHeading textAlign="left" color={Colors?.inputLabel}>
          {t(label)}
        </CustomHeading>
      )}
      <View
        style={[
          styles.inputContainer,
          errors?.[name] && { borderColor: Colors?.error },
        ]}
      >
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
      {errors?.[name] && <ErrorText>{errors?.[name]?.message || ""}</ErrorText>}
    </View>
  );
};

export default TextAreaInputComponent;

const styles = StyleSheet.create({
  inputField: {
    gap: 5,
  },
  inputContainer: {
    height: 100,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  textInput: {
    verticalAlign: "top",
    paddingTop: 14,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
});
