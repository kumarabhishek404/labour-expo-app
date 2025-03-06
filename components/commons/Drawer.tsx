import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  BackHandler,
} from "react-native";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "../inputs/Button";
import Atoms from "@/app/AtomStore";
import { t } from "@/utils/translationHelper";

const { width, height } = Dimensions.get("window");

const GlobalSideDrawer = () => {
  const [drawerState, setDrawerState]: any = useAtom(Atoms?.SideDrawerAtom);
  const slideAnim = useRef(new Animated.Value(width)).current;

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
    }, [drawerState, setDrawerState])
  );

  useEffect(() => {
    if (drawerState.visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerState.visible]);

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerState({ ...drawerState, visible: false }));
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
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles?.wrapper}>
          <View style={styles.header}>
            <CustomHeading baseFont={20} fontWeight="bold">
              {t(drawerState.title)}
            </CustomHeading>
            <Ionicons
              name="close"
              size={28}
              color={Colors.primary}
              onPress={closeDrawer}
            />
          </View>
          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {drawerState.content && drawerState.content()}
          </ScrollView>
        </View>

        {/* Fixed Footer Buttons */}
        {(drawerState.primaryButton || drawerState.secondaryButton) && (
          <View style={styles.footer}>
            {drawerState.secondaryButton && (
              <ButtonComp
                isPrimary={false}
                title={t(drawerState.secondaryButton?.title)}
                onPress={closeDrawer}
                bgColor={Colors?.danger}
                borderColor={Colors?.danger}
                textColor={Colors?.white}
                style={{ width: "35%" }}
              />
            )}
            {drawerState.primaryButton && (
              <ButtonComp
                isPrimary={true}
                title={t(drawerState.primaryButton?.title)}
                onPress={drawerState.primaryButton?.action}
                disabled={drawerState.primaryButton?.disabled}
                bgColor={Colors?.success}
                borderColor={Colors?.success}
                textColor={Colors?.white}
                style={{ flex: 1 }}
              />
            )}
          </View>
        )}
      </Animated.View>
    </>
  );
};

export default GlobalSideDrawer;

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
    width: "100%",
    height: "100%",
    backgroundColor: Colors.background,
    paddingHorizontal: 15,
    zIndex: 99,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 10,
  },
  scrollContainer: {},
  contentContainer: {
    paddingBottom: 100, // Avoid content being cut off behind buttons
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
