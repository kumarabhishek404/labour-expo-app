import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeading from "./CustomHeading";
import Button from "../inputs/Button";
import { t } from "@/utils/translationHelper";

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
          <View style={styles.header}>
            <CustomHeading baseFont={18} color={Colors?.white} textAlign="left">
              {title ? title : t("title")}
            </CustomHeading>
            <TouchableOpacity onPress={onClose}>
              <Entypo name="cross" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView style={styles?.contentContaincer}>{content()}</ScrollView>

          <View style={styles.footer}>
            <Button
              isPrimary={false}
              title={
                secondaryButton?.title ? secondaryButton?.title : t("cancel")
              }
              onPress={secondaryButton?.action}
            />
            <Button
              isPrimary={true}
              disabled={primaryButton?.disabled}
              title={primaryButton?.title ? primaryButton?.title : t("save")}
              onPress={primaryButton?.action}
              style={{
                flex: 1,
              }}
            />
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
    zIndex: 0
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    maxHeight: "70%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContaincer: {
    paddingHorizontal: 20,
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors?.primary,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#FFF",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
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
