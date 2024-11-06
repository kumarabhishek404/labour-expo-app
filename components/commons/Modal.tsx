import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeading from "./CustomHeading";
import Button from "../inputs/Button";

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
        <View style={styles.container}>
          {/* Header with gradient and improved styling */}
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.header}
          >
            <CustomHeading fontSize={18} color={Colors?.white} textAlign="left">
              {title ? title : "Edit Profile"}
            </CustomHeading>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Entypo name="cross" size={28} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Modal Content */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            {content()}
          </View>

          <View style={styles.footer}>
            <Button
              isPrimary={false}
              title={secondaryButton?.title ? secondaryButton?.title : "Cancel"}
              onPress={secondaryButton?.action}
            />
            <LinearGradient
              colors={["#ff7e5f", "#feb47b"]}
              style={[
                styles.primaryButton,
                primaryButton?.styles,
                primaryButton?.disabled && styles.disabled,
              ]}
            >
              <Button
                isPrimary={true}
                title={primaryButton?.title ? primaryButton?.title : "Save"}
                onPress={primaryButton?.action}
                style={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
              />
            </LinearGradient>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#FFF",
    // textAlign: "center",
    flex: 1,
  },
  headerButton: {
    // position: "absolute",
    // right: 15,
    // top: 15,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors?.secondary,
    justifyContent: "space-between",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default ModalComponent;
