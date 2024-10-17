import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

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
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, containerStyle]}>
        {icon && icon}
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          style={styles.textInput}
          secureTextEntry={secureEntry}
          placeholder={placeholder}
          placeholderTextColor={Colors.secondary}
        />
        <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
          <Feather
            name={secureEntry ? "eye" : "eye-off"}
            size={20}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      </View>
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      )}
    </View>
  );
};

export default PasswordComponent;

const styles = StyleSheet.create({
  inputField: {},
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    padding: 10,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
