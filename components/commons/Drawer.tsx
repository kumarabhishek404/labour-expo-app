import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "../inputs/Button";
import { SlideInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const Drawer = ({
  title,
  visible,
  content,
  onClose,
  primaryButton,
  secondaryButton,
}: any) => {
  const slideAnim = useRef(new Animated.Value(width)).current; // Start off-screen

  useEffect(() => {
    if (visible) {
      // Open animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Close animation
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <>
      {/* Backdrop to close on click */}
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Sliding Drawer */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomHeading baseFont={20} fontWeight="bold">
            {title}
          </CustomHeading>
          <Ionicons
            name="close"
            size={28}
            color={Colors.primary}
            onPress={onClose}
          />
        </View>

        {/* Scrollable Drawer Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content()}
        </ScrollView>

        {/* Footer Buttons */}
        <Animated.View style={styles.footer}>
          <ButtonComp
            isPrimary={false}
            title={secondaryButton?.title}
            onPress={secondaryButton?.action}
            bgColor={Colors?.danger}
            borderColor={Colors?.danger}
            textColor={Colors?.white}
            style={{ width: "35%" }}
          />
          <ButtonComp
            isPrimary={true}
            title={primaryButton?.title}
            onPress={primaryButton?.action}
            disabled={primaryButton?.disabled}
            bgColor={Colors?.success}
            borderColor={Colors?.success}
            textColor={Colors?.white}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%", // Adjust width of drawer
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 20,
  },
  scrollContainer: {
    flex: 1,
    // maxHeight: height * 0.75, // Prevents overflow beyond 75% of screen height
  },
  contentContainer: {
    // paddingBottom: 20, // Adds spacing at the bottom
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 15,
    width: width,
  },
});
