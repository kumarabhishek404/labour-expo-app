import React from "react";
import { View, StyleSheet } from "react-native";
import Counter from "./Counter";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";

const Duration = ({ duration, setDuration, errors, name }: any) => {
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <View style={styles.container}>
        <CustomHeading fontSize={20}>
          Duration <CustomText fontSize={14}> (In Days)</CustomText>
        </CustomHeading>
        <Counter counter={duration} setCounter={setDuration} />
      </View>
      {errors[name] && (
        <CustomText textAlign="right" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default Duration;
