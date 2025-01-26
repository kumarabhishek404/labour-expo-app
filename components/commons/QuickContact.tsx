import React from "react";
import { View, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { handleCall, handleEmail, handleMessage } from "@/constants/functions";

const QuickContact = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <View style={styles.contactInfo}>
          <CustomHeading fontSize={18}>ABHISHEK KUMAR</CustomHeading>
          <CustomText style={styles.contactJob}>CEO of KAAM DEKHO</CustomText>
          <CustomText fontSize={14} fontWeight="500">
            +91 6394743923
          </CustomText>
          <CustomText fontSize={14} fontWeight="500">
            ceo@kaamdekho.com
          </CustomText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={24} color="#FFF" />
            <CustomText color={Colors?.white} fontWeight="bold">
              Call
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={24} color="#FFF" />
            <CustomText color={Colors?.white} fontWeight="bold">
              Message
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.emailButton]}
            onPress={handleEmail}
          >
            <Ionicons name="mail" size={24} color="#FFF" />
            <CustomText color={Colors?.white} fontWeight="bold">
              Email
            </CustomText>
          </TouchableOpacity>
        </View>
        <CustomText>© 2024 KAAM DEKHO. All rights reserved.</CustomText>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: Colors?.primary,
  },
  contactContainer: {
    marginVertical: 40,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  contactInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  contactJob: {
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  actionButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: "30%",
  },
  callButton: {
    backgroundColor: "#4CAF50", // Green for call
  },
  messageButton: {
    backgroundColor: "#2196F3", // Blue for message
  },
  emailButton: {
    backgroundColor: "#FF5722", // Red for email
  },
  actionText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    fontWeight: "600",
  },
});

export default QuickContact;
