// import React, { useState, useEffect } from "react";
// import { View, Text, Button } from "react-native";
// import Voice from "@react-native-voice/voice";

// export default function SpeechToText() {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");

//   // Stop recording
//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//     } catch (error) {
//       console.error("Error stopping voice recognition:", error);
//     }
//   };

//   // Inside your component
//   useEffect(() => {
//     // Set up listeners for speech events
//     Voice.onSpeechStart = onSpeechStartHandler;
//     Voice.onSpeechResults = onSpeechResultsHandler;
//     Voice.onSpeechError = onSpeechErrorHandler;

//     return () => {
//       // Clean up listeners when component unmounts
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStartHandler = (e) => {
//     console.log("Speech has started:", e);
//   };

//   const onSpeechResultsHandler = (e) => {
//     console.log("Speech results:", e);
//   };

//   const onSpeechErrorHandler = (e) => {
//     console.log("Speech error:", e);
//   };

//   // Start listening when needed
//   const startListening = async () => {
//     try {
//       await Voice.start("en-US");
//     } catch (error) {
//       console.error("Error starting voice recognition:", error);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18 }}>Speech-to-Text Demo</Text>
//       <Text style={{ marginTop: 20, fontSize: 16 }}>
//         {isListening ? "Listening..." : "Press Start to Speak"}
//       </Text>
//       <Text style={{ marginTop: 20, fontSize: 16 }}>Transcript:</Text>
//       <Text style={{ fontSize: 16, color: "blue" }}>{transcript}</Text>
//       <View style={{ flexDirection: "row", marginTop: 20 }}>
//         <Button title="Start" onPress={startListening} disabled={isListening} />
//         <Button title="Stop" onPress={stopListening} disabled={!isListening} />
//       </View>
//     </View>
//   );
// }


// VoiceToText.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Remove listeners on cleanup
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    setIsListening(true);
    console.log('onSpeechStart:', e);
  };

  const onSpeechEnd = (e: any) => {
    setIsListening(false);
    console.log('onSpeechEnd:', e);
  };

  const onSpeechResults = (e: any) => {
    const spokenText = e.value[0];
    setText(spokenText);
    console.log('onSpeechResults:', e);
  };

  const onSpeechError = (e: any) => {
    setError(JSON.stringify(e.error));
    console.log('onSpeechError:', e);
  };

  const startListening = async () => {
    try {
      setError(null);
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      // setError(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
      setError(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice to Text Demo</Text>
      <Text style={styles.text}>Text: {text}</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default VoiceToText;