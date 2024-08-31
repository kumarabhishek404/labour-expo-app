import { darkGreen } from "@/constants/Colors";
import React from "react";
import { TextInput } from "react-native";

const Field = (props: any) => {
  return (
    <TextInput
      {...props}
      style={{
        borderRadius: 100,
        color: darkGreen,
        paddingHorizontal: 10,
        width: "78%",
        backgroundColor: "rgb(220,220, 220)",
        marginVertical: 10,
        ...props.style
      }}
      placeholderTextColor={darkGreen}
    ></TextInput>
  );
};

export default Field;
