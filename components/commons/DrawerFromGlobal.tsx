import React, { useEffect, useRef } from "react";
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
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "@/components/inputs/Button";
import Atoms from "@/app/AtomStore";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import { useNavigation } from "expo-router";

const { height, width } = Dimensions.get("window");

const GlobalBottomDrawer = () => {
  const currentScreen = useNavigationState(
    (state) => state?.routes.at(-1)?.name
  );
  const [drawerState, setDrawerState]: any = useAtom(Atoms?.BottomDrawerAtom);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const prevDrawerState = useRef<any>(null);
  const lastScreenRef: any = useRef<string | null>(null);

  const triggeredRouteRef: any = useRef<string | null>(null); // Store route where drawer was triggered

  useEffect(() => {
    console.log("📌 Current Screen:", currentScreen);

    if (drawerState.visible) {
      prevDrawerState.current = { ...drawerState };
      triggeredRouteRef.current = currentScreen; // Store where the drawer was triggered
      console.log("🔹 Saving Drawer State on:", triggeredRouteRef.current);
      closeDrawer();
    }
  }, [currentScreen]);

  useEffect(() => {
    console.log("🔄 Checking Screen Focus:", currentScreen);
    console.log("📌 Last Triggered Route:", triggeredRouteRef.current);
    console.log("🗂 Previous Drawer State:", prevDrawerState.current);

    if (
      prevDrawerState.current?.visible &&
      triggeredRouteRef.current === currentScreen // Restore only if back to the same route
    ) {
      console.log("✅ Restoring drawer on", currentScreen);
      setTimeout(() => {
        setDrawerState({ ...prevDrawerState.current, visible: true });
      }, 300);
    } else {
      console.log("❌ Drawer not restored - different screen.");
    }
  }, [currentScreen]);

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

  useEffect(() => {
    if (drawerState.visible) {
      slideAnim.setValue(height);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerState.visible]);

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDrawerState((prev: any) => ({ ...prev, visible: false }));
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
                onPress={closeDrawer}
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
