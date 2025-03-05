import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Clipboard,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { APPLINK } from "@/constants";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";

// Set preferred language (change to "hi" for Hindi)
const LANGUAGE = "en"; // Change to "hi" for Hindi

const ShareAppScreen = () => {
  // Share using Social Media Platforms
  const shareToSocialMedia = (platform: any) => {
    let url;
    const message = encodeURIComponent(t("shareMessage", { appLink: APPLINK }));

    switch (platform) {
      case "whatsapp":
        url = `whatsapp://send?text=${message}`;
        break;
      // case "instagram":
      //   url = `https://www.instagram.com/direct/new/`; // Open Instagram direct messages
      //   break;
      case "linkedin":
        url = `https://www.linkedin.com/messaging/compose/?body=${message}`;
        break;
      default:
        url = "";
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          TOAST.error(t("appNotInstalled"));
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  // Share via Facebook
  const shareOnFacebookAndInstagramMessenger = async (platform: any) => {
    const message = encodeURIComponent(
      `Check out this amazing app: ${APPLINK}`
    );

    Clipboard.setString(APPLINK);
    TOAST.success(t("facebookCopiedText"));

    const fbShareUrl =
      platform === "instagram"
        ? `https://www.instagram.com/direct/new/`
        : `https://m.me/?message=${encodeURIComponent(message)}`;

    setTimeout(() => {
      Linking.canOpenURL(fbShareUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(fbShareUrl);
          } else {
            TOAST.error("App not installed or not supported.");
          }
        })
        .catch((err) => console.error("An error occurred", err));
    }, 2000);
  };

  // Share via SMS
  const shareViaSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync([], t("shareMessage"));
    } else {
      TOAST.error(t("smsError"));
    }
  };

  // Share via Email
  const shareViaEmail = async () => {
    const subject = encodeURIComponent(t("emailSubject"));
    const body = encodeURIComponent(t("shareMessage"));
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      console.error("Error opening mail app:", err);
      TOAST.error(t("emailError"));
    });
  };

  // Copy link to clipboard
  const copyLink = () => {
    Clipboard.setString(APPLINK);
    TOAST.success(t("copySuccess"));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title="headerTitle"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={styles.container}>
        <CustomHeading baseFont={24}>{t("shareHeading")}</CustomHeading>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => shareToSocialMedia("whatsapp")}>
            <FontAwesome name="whatsapp" size={50} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => shareOnFacebookAndInstagramMessenger("instagram")}
          >
            <FontAwesome name="instagram" size={50} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareToSocialMedia("linkedin")}>
            <FontAwesome name="linkedin" size={50} color="#0088cc" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => shareOnFacebookAndInstagramMessenger("facebook")}
          >
            <FontAwesome name="facebook" size={50} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <Button
            isPrimary={true}
            title={t("buttonShareSMS")}
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
            title={t("buttonShareEmail")}
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
            title={t("buttonCopyLink")}
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
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 50,
  },
  actionContainer: {
    width: "100%",
    gap: 20,
  },
});

export default ShareAppScreen;
