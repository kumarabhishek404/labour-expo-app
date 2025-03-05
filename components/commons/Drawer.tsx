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
          drawerState.secondaryButton?.action();
          setDrawerState({ ...drawerState, visible: false });
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
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerState.visible]);

  if (!drawerState.visible) return null;

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          drawerState.secondaryButton?.action();
          setDrawerState({ ...drawerState, visible: false });
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <CustomHeading baseFont={20} fontWeight="bold">
            {t(drawerState.title)}
          </CustomHeading>
          <Ionicons
            name="close"
            size={28}
            color={Colors.primary}
            onPress={() => {
              drawerState.secondaryButton?.action();
              setDrawerState({ ...drawerState, visible: false });
            }}
          />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {drawerState.content && drawerState.content()}
        </ScrollView>

        {(drawerState.primaryButton || drawerState.secondaryButton) && (
          <View style={styles.footer}>
            {drawerState.secondaryButton && (
              <ButtonComp
                isPrimary={false}
                title={t(drawerState.secondaryButton?.title)}
                onPress={drawerState.secondaryButton?.action}
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
    flex: 1,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: height,
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
  },
  contentContainer: {},
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
