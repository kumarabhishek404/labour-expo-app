import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Clipboard,
} from "react-native";
import * as Sharing from "expo-sharing";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import * as MailComposer from "expo-mail-composer";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { APPLINK } from "@/constants";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";

const ShareAppScreen = () => {
  // Share using Social Media Platforms (e.g., WhatsApp, Facebook, Telegram)
  const shareToSocialMedia = (platform: any) => {
    let url;
    switch (platform) {
      case "whatsapp":
        url = `whatsapp://send?text=Check out this amazing app: ${APPLINK}`;
        break;
      case "instagram":
        url = `instagram://story-camera`; // Instagram doesn't support text sharing directly, so it opens the camera
        break;
      case "linkedin":
        url = `linkedin://sharing/share-offsite/?url=https://example.com`;
        break;
      case "facebook":
        url = `fb://faceweb/f?href=${APPLINK}`;
        break;
      default:
        url = "";
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("App not installed");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  // Share via SMS
  const shareViaSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        [], // Leave empty to allow users to choose recipients
        `Check out this amazing app: ${APPLINK}`
      );
    } else {
      Alert.alert("SMS service is not available");
    }
  };

  // Share via Email
  const shareViaEmail = async () => {
    const options = {
      recipients: [],
      subject: "Check out this amazing app!",
      body: `I wanted to share this awesome app with you: ${APPLINK}`,
    };

    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync(options);
    } else {
      Alert.alert("Email service is not available");
    }
  };

  // Share App Link using React Native Share
  const shareAppLink = async () => {
    try {
      await Sharing.shareAsync(null, {
        message: `Check out this amazing app: ${APPLINK}`,
        // url: appLink,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Copy link to clipboard
  const copyLink = () => {
    Clipboard.setString(APPLINK);
    Alert.alert("Link copied to clipboard");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Share App" left="menu" right="notification" />
          ),
        }}
      />
      <View style={styles.container}>
        <CustomHeading baseFont={24}>Share Our App With Your Family</CustomHeading>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => shareToSocialMedia("whatsapp")}>
            <FontAwesome name="whatsapp" size={50} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareToSocialMedia("instagram")}>
            <FontAwesome name="instagram" size={50} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareToSocialMedia("linkedin")}>
            <FontAwesome name="linkedin" size={50} color="#0088cc" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareToSocialMedia("facebook")}>
            <FontAwesome name="facebook" size={50} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <Button
            isPrimary={true}
            title="Share via SMS"
            onPress={shareViaSMS}
            icon={
              <MaterialIcons
                name="textsms"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
          />
          <Button
            isPrimary={true}
            title="Share via Email"
            onPress={shareViaEmail}
            icon={
              <MaterialIcons
                name="email"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
          />
          <Button
            isPrimary={true}
            title="Copy Link"
            onPress={copyLink}
            icon={
              <MaterialIcons
                name="link"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
          />
          <Button
            isPrimary={true}
            title="Share Link"
            onPress={shareAppLink}
            icon={
              <MaterialIcons
                name="share"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 50,
  },
  actionContainer: {
    width: "100%",
    gap: 20
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "white",
  },
});

export default ShareAppScreen;
