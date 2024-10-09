import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type TextInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  icon?: any;
};

const TextInputComponent = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
}: TextInputProps) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && (
          <MaterialCommunityIcons
            name="sickle"
            size={30}
            color={Colors.secondary}
            style={styles?.icon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.textInput}
          placeholder={placeholder ?? "Work Title"}
          placeholderTextColor={Colors.secondary}
        />
      </View>
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    marginVertical: 10,
  },
});
