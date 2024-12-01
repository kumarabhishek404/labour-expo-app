// import { transcribeAudio } from "@/app/api/audio";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";

const AudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioURI, setAudioURI] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("URI - ", uri);
    
    setAudioURI(uri);
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
