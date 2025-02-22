import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import ErrorText from "../commons/ErrorText";

const Gender = ({
  name,
  label,
  options,
  gender,
  setGender,
  errors,
}: any) => {
  return (
    <View style={styles.genderContainer}>
      <CustomHeading textAlign="left">{label}</CustomHeading>
      <View style={styles.genderSelectionWrapper}>
        {options &&
          options?.length > 0 &&
          options?.map((option: any) => (
            <TouchableOpacity
              key={option?.value}
              onPress={() => setGender(option?.value)}
              style={[
                styles.genderButton,
                errors?.[name] && { borderColor: Colors?.error },
                gender === option?.value && styles.selectedButton,
              ]}
            >
              <CustomHeading
                style={[gender === option?.value && { color: Colors?.white }]}
              >
                {option?.icon} {option?.title}
              </CustomHeading>
            </TouchableOpacity>
          ))}
      </View>
      {errors?.[name] && <ErrorText> {errors?.[name]?.message || ""}</ErrorText>}
    </View>
  );
};

const styles = StyleSheet.create({
  genderContainer: { gap: 5 },
  genderSelectionWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  selectedButton: {
    borderColor: Colors?.tertiery,
    backgroundColor: Colors?.tertiery,
  },
});

export default Gender;
