import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const SignupScreen = () => {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name="sickle"
        size={30}
        color={Colors.secondary}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Work Title"
        placeholderTextColor={Colors.secondary}
      />
    </View>
  );
};

export default SignupScreen;

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
    paddingHorizontal: 10,
  },
});
