import React from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "@/components/inputs/Button";
import Atoms from "@/app/AtomStore";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";

const { height, width } = Dimensions.get("window");

const GlobalBottomDrawer = () => {
  const [drawerState, setDrawerState]: any = useAtom(Atoms?.BottomDrawerAtom);
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  // Handle Android back button behavior
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (drawerState.visible) {
          closeDrawer();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [drawerState.visible])
  );

  // Open and Close Animation
  React.useEffect(() => {
    if (drawerState.visible) {
      slideAnim.setValue(height); // Reset position before opening
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerState.visible]);

  // Close drawer with animation
  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDrawerState((prev: any) => ({ ...prev, visible: false })); // Hide AFTER animation
      drawerState?.secondaryButton?.action();
    });
  };

  if (!drawerState.visible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <CustomHeading baseFont={22} fontWeight="bold" textAlign="left">
            {t(drawerState.title)}
          </CustomHeading>
          <Ionicons
            name="close"
            size={28}
            color={Colors.primary}
            onPress={closeDrawer}
          />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.content}>
            {drawerState.isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              drawerState.content && drawerState.content()
            )}
          </View>
          <View style={styles.footer}>
            {drawerState.secondaryButton && (
              <ButtonComp
                isPrimary={false}
                title={t(drawerState.secondaryButton.title || "cancel")}
                onPress={drawerState.secondaryButton.action}
                bgColor={Colors.danger}
                borderColor={Colors.danger}
                textColor={Colors.white}
                style={{ width: "35%" }}
              />
            )}
            {drawerState.primaryButton && (
              <ButtonComp
                isPrimary={true}
                title={t(drawerState.primaryButton.title)}
                onPress={() => {
                  closeDrawer();
                  drawerState.primaryButton.action();
                }}
                disabled={drawerState.primaryButton.disabled}
                bgColor={Colors.success}
                borderColor={Colors.success}
                textColor={Colors.white}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default GlobalBottomDrawer;

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
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    maxHeight: height * 0.7,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
});
