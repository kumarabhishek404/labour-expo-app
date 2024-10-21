import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
const ModalComponent = ({
  title,
  visible,
  onClose,
  content,
  primaryButton,
  secondaryButton,
}: any) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles?.container}>
          <View style={styles?.header}>
            <Text style={styles?.headerText}>{title ? title : "Edit Profile"}</Text>
            <TouchableOpacity onPress={onClose} style={styles?.headerButton}>
              <Entypo name="cross" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {content()}
          <View style={styles?.buttomWrapper}>
            <TouchableOpacity
              onPress={secondaryButton?.action}
              style={[styles?.button, secondaryButton?.styles]}
            >
              <Text style={styles?.buttonText}>
                {secondaryButton?.title ? secondaryButton?.title : "Cancel"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={primaryButton?.action}
              style={[styles?.button, primaryButton?.styles]}
            >
              <Text style={styles?.buttonText}>
                {primaryButton?.title ? primaryButton?.title : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
    height: 500
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 8,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 18,
  },
  headerButton: {},
  buttomWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
    marginTop: 10
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default ModalComponent;
