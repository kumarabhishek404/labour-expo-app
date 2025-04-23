// components/modals/ExitConfirmationModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

const ExitConfirmationModal = ({ visible, onCancel, onConfirm }: any) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Exit App</Text>
          <Text style={styles.message}>
            Are you sure you want to exit the app?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitBtn} onPress={onConfirm}>
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExitConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: Colors.primary,
  },
  message: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  exitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  exitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
