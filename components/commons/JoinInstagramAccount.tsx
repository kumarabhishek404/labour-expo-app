import { t } from "@/utils/translationHelper";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

interface FollowInstagramProps {
  profileLink: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

const FollowInstagram: React.FC<FollowInstagramProps> = ({
  profileLink,
  title = "instaTitle",
  description = "instaDescription",
  buttonText = "instaButtonText",
}) => {
  const handleFollowPress = async () => {
    const username = profileLink.split("instagram.com/")[1]?.replace("/", "");

    const appUrl = `instagram://user?username=${username}`;
    const webUrl = profileLink;

    try {
      const canOpen = await Linking.canOpenURL(appUrl);

      if (canOpen) {
        // Open profile directly in Instagram app
        await Linking.openURL(appUrl);
      } else {
        // Fallback → open in browser
        await Linking.openURL(webUrl);
      }
    } catch (err) {
      console.warn("Error opening Instagram", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(title)}</Text>
      <Text style={styles.description}>{t(description)}</Text>

      <TouchableOpacity style={styles.button} onPress={handleFollowPress}>
        <Text style={styles.buttonText}>{t(buttonText)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // light instagram tint background
    backgroundColor: "#FFF1F4",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C13584", // instagram purple-pink
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#833AB4",
    marginBottom: 12,
  },
  button: {
    // instagram gradient substitute color
    // RN gradient needs library, so using brand pink
    backgroundColor: "#E1306C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default FollowInstagram;
