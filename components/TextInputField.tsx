// src/components/TextInputField.tsx

import React from "react";
import { TextInput, StyleProp, TextStyle } from "react-native";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextInputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
}: Props) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    style={style}
  />
);

export default TextInputField;
