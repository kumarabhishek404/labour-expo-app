import Colors from "@/constants/Colors";
import { Foundation } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";

const Counter = ({ counter, setCounter, style }: any) => {
  const handleClick1 = () => {
    setCounter(counter + 1);
  };

  const handleClick2 = () => {
    if (counter > 0) setCounter(counter - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, style]} onPress={handleClick1}>
          <Foundation style={styles.counterIcon} name="plus" size={28} />
        </TouchableOpacity>
        <CustomHeading fontSize={30}>{counter}</CustomHeading>
        <TouchableOpacity
          disabled={counter === 0}
          style={[styles.button, style]}
          onPress={handleClick2}
        >
          <Foundation
            style={styles.counterIcon}
            name="minus"
            size={32}
            color={counter === 0 ? Colors?.secondary : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
  },
  buttons: {
    height: "100%",
    padding: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  counterValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
  },
  counterIcon: {
    fontWeight: 900,
    fontSize: 20,
  },
  button: {
    padding: 10,
    height: 44,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.secondary,
    borderWidth: 1,
  },
});

export default Counter;
