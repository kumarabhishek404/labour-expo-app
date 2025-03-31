import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import * as SplashScreen from "expo-splash-screen";
import SPLASH_VIDEO from "../../assets/add.gif";

export default function SplashVideo({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<Video>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const hideSplash = async () => {
      if (isVideoLoaded) {
        await SplashScreen.hideAsync(); // ✅ Hide splash when video loads
      }
    };
    hideSplash();
  }, [isVideoLoaded]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={SPLASH_VIDEO} // ✅ Place your video in assets/videos/
        style={styles.video}
        // resizeMode="cover"
        shouldPlay
        isLooping={false}
        onReadyForDisplay={() => setIsVideoLoaded(true)} // ✅ Hide splash once video is loaded
        onPlaybackStatusUpdate={(status) => {
          if (status && status.isLoaded && status.didJustFinish) {
            onFinish(); // ✅ Navigate to app once video finishes
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
