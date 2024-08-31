import Colors from "@/constants/Colors";
import { AntDesign, Foundation } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const Counter = () => {
  const [counter, setCounter] = useState(0);
  const [initialCount, setInitialCount] = useState(0);

  const handleInitialCountChange = (value: any) => {
    setInitialCount(Number(value));
  };

  const handleReset = () => {
    setCounter(initialCount);
  };

  const handleClick1 = () => {
    setCounter(counter + 1);
  };

  const handleClick2 = () => {
    if(counter > 0) setCounter(counter - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleClick1}>
          <Foundation style={styles.counterIcon} name="plus" size={28} />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{counter}</Text>
        <TouchableOpacity style={styles.button} onPress={handleClick2}>
          <Foundation style={styles.counterIcon} name="minus" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: 56,
    // borderColor: 'red',
    // borderWidth: 1
  },
  buttons: {
    height: '100%',
    padding:0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    gap: 8,
  },
  counterValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  counterIcon: {
    fontWeight: 900,
    fontSize: 20
  },
  button: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: "rgb(220,220, 220)",
  },
});

export default Counter;