import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import TextInputComponent from "./TextInputWithIcon";

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

const PasswordComponent = ({
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
  const [secureEntry, setSecureEntry] = useState(true);

  return (
    <View style={styles?.inputField}>
      <View style={containerStyle}>
        <TextInputComponent
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureEntry}
          label={label}
          name="firstName"
          containerStyle={errors?.firstName && styles.errorInput}
          errors={errors}
          icon={icon && icon}
          secondIcon={
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => setSecureEntry((prev) => !prev)}
            >
              <Feather
                name={secureEntry ? "eye" : "eye-off"}
                size={20}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          }
        />
      </View>
      {errors[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

export default PasswordComponent;

const styles = StyleSheet.create({
  inputField: { gap: 5 },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
