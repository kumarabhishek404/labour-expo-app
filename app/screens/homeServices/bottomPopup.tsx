import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetWrapper}>
        {/* Floating Cancel Icon */}
        <TouchableOpacity style={styles.floatingCloseButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>

        {/* Sheet Content */}
        <View style={styles.sheet}>{children}</View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.5;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#000",
    opacity: 0.5,
  },
  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    width: "100%",
  },
  floatingCloseButton: {
    position: "absolute",
    top: -55,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});