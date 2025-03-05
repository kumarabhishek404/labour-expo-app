import React from "react";
import { View, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function YouTubePlayer({ videoId }: any) {
  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={200}
        play={true}
        forceAndroidAutoplay={true}
        videoId={videoId}
        webViewProps={{
          allowsInlineMediaPlayback: true,
        }}
        initialPlayerParams={{
          loop: true,
          controls: true,
          modestbranding: false,
          rel: false,
          iv_load_policy: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
