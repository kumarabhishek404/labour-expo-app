import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as Speech from "expo-speech";

const TextToSpeech = () => {
  const [text, setText] = useState("");

  const speak = () => {
    console.log("hello===");
    
    if (text.trim()) {
      Speech.speak(text, {
        language: "hi", // Change to "hi" for Hindi
        pitch: 1, // Adjust voice pitch (0.5 - 2)
        rate: 1, // Adjust speed (0.1 - 2)
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Enter Text:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Speak" onPress={speak} />
    </View>
  );
};

export default TextToSpeech;
