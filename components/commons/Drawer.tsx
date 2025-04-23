import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  BackHandler,
  Pressable,
} from "react-native";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "../inputs/Button";
import Atoms from "@/app/AtomStore";
import { t } from "@/utils/translationHelper";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const { width } = Dimensions.get("window");

const GlobalSideDrawer = () => {
  const [drawerState, setDrawerState]: any = useAtom(Atoms?.SideDrawerAtom);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

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
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerState.visible]);

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerState({ ...drawerState, visible: false }));
  };

  if (!drawerState.visible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <CustomHeading
              baseFont={20}
              fontWeight="bold"
              style={styles.headerText}
              color={Colors?.white}
            >
              {t(drawerState.title)}
            </CustomHeading>
            <Pressable
              onPress={closeDrawer}
              hitSlop={10}
              style={{
                position: "absolute",
                right: 5,
                top: 17,
                marginRight: 10,
              }}
            >
              <Ionicons name="close" size={28} color={Colors.white} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {drawerState.content && drawerState.content()}
          </ScrollView>
        </View>

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
                style={{ width: "30%" }}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 98,
  },
  drawerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.fourth,
    zIndex: 99,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors?.primary,
  },
  headerText: {
    flex: 1,
  },
  scrollContainer: {},
  contentContainer: {
    paddingBottom: 100,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  footer: {
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
