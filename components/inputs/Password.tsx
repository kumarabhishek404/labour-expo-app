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
}: TextInputProps) => {
  const [secureEntry, setSecureEntry] = useState(true);

  return (
    <View style={styles?.inputField}>
      <TextInputComponent
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureEntry}
        type="number"
        label={label}
        name={name}
        maxLength={4}
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
  );
};

export default PasswordComponent;

const styles = StyleSheet.create({
  inputField: { width: "100%", gap: 5 },
});
