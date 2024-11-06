// import { transcribeAudio } from "@/app/api/audio";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [audioURI, setAudioURI] = useState(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio?.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("URI - ", uri);
    
    setAudioURI(uri);
    // const transcription = await transcribeAudio(uri);
    // console.log("Transcription:", transcription);
  };

  return (
    <View>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {audioURI && <Text>Audio file stored at: {audioURI}</Text>}
    </View>
  );
};

export default AudioRecorder;
