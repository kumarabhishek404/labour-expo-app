import Colors from "@/constants/Colors";
import { Foundation } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";
import ErrorText from "../commons/ErrorText";

const Counter = ({ label, counter, setCounter, style, errors, name }: any) => {
  const handleClick1 = () => {
    setCounter(counter + 1);
  };

  const handleClick2 = () => {
    if (counter > 0) setCounter(counter - 1);
  };

  return (
    <View style={styles.container}>
      {label && (
        <CustomHeading
          textAlign="left"
          color={Colors?.inputLabel}
          baseFont={16}
          fontWeight="500"
        >
          {t(label)}
        </CustomHeading>
      )}
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, style]} onPress={handleClick1}>
          <Foundation style={styles.counterIcon} name="plus" />
        </TouchableOpacity>
        <CustomHeading baseFont={32} color={Colors?.inputText}>
          {counter}
        </CustomHeading>
        <TouchableOpacity
          disabled={counter === 0}
          style={[styles.button, style]}
          onPress={handleClick2}
        >
          <Foundation
            style={styles.counterIcon}
            name="minus"
            color={counter === 0 ? Colors?.secondary : "black"}
          />
        </TouchableOpacity>
      </View>
      {errors?.[name] && <ErrorText>{errors?.[name]?.message}</ErrorText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 42,
    gap: 5,
  },
  buttons: {
    height: "100%",
    padding: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    zIndex: 0,
  },
  counterIcon: {
    fontWeight: 900,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 12,
    height: 42,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.secondary,
    borderWidth: 1,
  },
});

export default Counter;
