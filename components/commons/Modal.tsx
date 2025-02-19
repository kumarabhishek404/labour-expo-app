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
          {/* Header */}
          <View style={styles.header}>
            <CustomHeading
              baseFont={18}
              color={Colors?.background}
              textAlign="left"
            >
              {title ? title : t("title")}
            </CustomHeading>
            <TouchableOpacity onPress={onClose}>
              <Entypo name="cross" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Modal Content with ScrollView */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {content()}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <Button
              isPrimary={false}
              title={secondaryButton?.title || t("cancel")}
              onPress={secondaryButton?.action}
              borderColor={Colors?.error}
              bgColor={Colors?.error}
              textColor={Colors?.white}
              style={{ width: "30%", paddingVertical: 8, minHeight: 30 }}
            />
            <Button
              isPrimary={true}
              disabled={primaryButton?.disabled}
              title={primaryButton?.title || t("save")}
              onPress={primaryButton?.action}
              style={{ flex: 1, paddingVertical: 8, minHeight: 30 }}
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
  },
  container: {
    backgroundColor: Colors?.background,
    width: "100%",
    maxHeight: "70%", // Ensures scrollability
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContainer: {
    maxHeight: "100%",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors?.primary,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors?.secondary,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ModalComponent;
