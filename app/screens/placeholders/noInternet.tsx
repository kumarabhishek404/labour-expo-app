import Colors from "@/constants/Colors";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import NOINTERNET from "../../../assets/no-internet.gif";
import { t } from "@/utils/translationHelper";

const NoInternetScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.container}>
        <Image source={NOINTERNET} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{t("noInternetTitle")}</Text>
        <Text style={styles.subtitle}>{t("noInternetSubtitle")}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>{t("noInternetRetry")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.tertieryButton }]}
            onPress={onRetry}
          >
            <Text style={styles.buttonText}>{t("noInternetConnectAdmin")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fourth,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#3949AB",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: 'center'
  },
});
