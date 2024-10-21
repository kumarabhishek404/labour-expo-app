import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Gender = ({ name, label, options, gender, setGender, containerStyle, errors }: any) => {
  return (
    <View style={styles.genderContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.genderSelectionWrapper}>
        {options &&
          options?.length > 0 &&
          options?.map((option: any) => (
            <TouchableOpacity
              key={option?.value}
              onPress={() => setGender(option?.value)}
              style={[
                styles.genderButton, containerStyle,
                gender === option?.value && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === option?.value && { color: Colors?.white },
                ]}
              >
                {option?.icon} {option?.title}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      {/* {errors[name] && ( */}
      <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  genderContainer: {},
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  genderSelectionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  selectedButton: {
    borderColor: Colors?.tertiery,
    backgroundColor: Colors?.tertiery,
  },
  genderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 20,
  },
});

export default Gender;
