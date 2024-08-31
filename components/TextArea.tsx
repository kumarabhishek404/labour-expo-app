import { darkGreen } from "@/constants/Colors";
import React from "react";
import { TextInput } from "react-native";

const TextArea = (props: any) => {
  return (
    <TextInput
      {...props}
      multiline={true}
      numberOfLines={4}
      style={{
        borderRadius: 10,
        color: darkGreen,
        paddingHorizontal: 10,
        width: "78%",
        backgroundColor: "rgb(220,220, 220)",
        marginVertical: 10,
        ...props.style
      }}
      placeholderTextColor={darkGreen}
    ></TextInput>
    // <TextInput
    //     multiline={true}
    //     numberOfLines={10}
    //     style={{ height:200, textAlignVertical: 'top',}}/>
  );
};

export default TextArea;
