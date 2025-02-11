import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { router, Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
import useFirstTimeLaunch from "../hooks/useFirstTimeLaunch";
import LOCAL_CONTEXT from "@/app/context/locale";
import { t } from "@/utils/translationHelper";
import LanguageSelectionScreen from "../languageSelection";
import ProfileScreen from "../screens/bottomTabs/(user)/profile";
import { getFontSize } from "@/constants/functions";
import { Badge } from "react-native-paper";
import BadgeComponent from "@/components/commons/Badge";
import BottomNavTutorial from "../screens/tutorials/bootomNavigation";

export default function Layout() {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const isAccountInactive = useAtomValue(Atoms?.AccountStatusAtom);
  const [isAccountInactiveLocal, setIsAccountInactiveLocal] =
    useState(isAccountInactive);
  const [addService, setAddService] = useAtom(Atoms?.AddServiceAtom);
  LOCAL_CONTEXT?.useLocale();
  const isFirstLaunch = useFirstTimeLaunch();
  const { locale } = LOCAL_CONTEXT.useLocale();
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    setIsAccountInactiveLocal(isAccountInactive);
  }, [isAccountInactive]);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch) {
    return <LanguageSelectionScreen />;
  }

  if (!userDetails?.isAuth) {
    return <Login />;
  }

  console.log(
    "isAccountInactiveLocal---",
    isAccountInactiveLocal,
    isAccountInactive
  );

  if (isAccountInactiveLocal) {
    return <ProfileScreen />;
  }

  const TabButton = ({ props, path, title, iconName }: any) => {
    const { onPress, accessibilityState } = props;
    const isSelected = accessibilityState?.selected;

    // Animations
    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.2 : 1)).current;
    // const opacityAnim = useRef(
    //   new Animated.Value(isSelected ? 1 : 0.7)
    // ).current;
    const translateYAnim = useRef(
      new Animated.Value(isSelected ? -5 : 0)
    ).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1.1 : 0.9,
          useNativeDriver: true,
          friction: 4,
        }),
        // Animated.timing(opacityAnim, {
        //   toValue: isSelected ? 1 : 0.6,
        //   duration: 200,
        //   useNativeDriver: true,
        // }),
        Animated.spring(translateYAnim, {
          toValue: isSelected ? -5 : 0,
          useNativeDriver: true,
          friction: 5,
        }),
      ]).start();
    }, [isSelected]);

    return (
      <TouchableOpacity
        style={[styles.customButton]}
        onPress={path ? () => router?.push(path) : onPress()}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            // opacity: opacityAnim, // Opacity effect on icon
          }}
        >
          <MaterialIcons
            name={iconName}
            size={32}
            color={isSelected ? Colors?.tertiery : Colors.primary}
          />
        </Animated.View>
        <Animated.Text
          style={[
            styles.customButtonText,
            {
              fontSize: getFontSize(locale),
              // opacity: opacityAnim,
              color: isSelected ? Colors?.tertiery : Colors.primary,
            }, // Opacity effect on text
          ]}
        >
          {title}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const TabButtonProfile = ({ props }: any) => {
    const { onPress, accessibilityState } = props;
    const isSelected = accessibilityState?.selected;

    // Local state for toggling between Profile and Notifications
    const [showProfile, setShowProfile] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Change the icon only after fade-out completes
          setShowProfile((prev) => !prev);

          // Start fade-in animation after state change
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }, 4000);

      return () => clearInterval(interval);
    }, []);

    return (
      <TouchableOpacity
        style={[styles.customButton]}
        onPress={() => router?.push("/(tabs)/fifth")}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}
        >
          <View style={styles?.notificationWrapper}>
            <MaterialIcons
              name={showProfile ? "person" : "notifications"}
              size={32}
              color={isSelected ? Colors?.tertiery : Colors.primary}
            />
            <BadgeComponent
              style={{
                backgroundColor: isSelected
                  ? Colors?.tertiery
                  : Colors?.primary,
              }}
              count={34}
            />
          </View>
        </Animated.View>
        <Animated.Text
          style={[
            styles.customButtonText,
            {
              fontSize: getFontSize(locale),
              opacity: fadeAnim,
              color: isSelected ? Colors?.tertiery : Colors.primary,
            },
          ]}
        >
          {showProfile ? t("myProfile") : t("notifications")}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 75,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: Colors.white,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/"
                title="Post Service"
                iconName="add"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fourth"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/fourth"
                title={userDetails?.isAdmin ? t("users") : "Search"}
                iconName={userDetails?.isAdmin ? "person" : "search"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="second"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/second"
                title={userDetails?.isAdmin ? t("users") : t("myBookings")}
                iconName={userDetails?.isAdmin ? "person" : "calendar-month"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fifth"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => <TabButtonProfile props={props} />,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  customButtonText: {
    color: Colors?.primary,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
