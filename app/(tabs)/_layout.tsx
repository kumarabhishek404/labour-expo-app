import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
  Image,
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
import BadgeComponent from "@/components/commons/Badge";
import NOTIFICATIONS from "../../assets/notifications.gif";
import PROFILE from "../../assets/profile.gif";

export default function Layout() {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const isAccountInactive = useAtomValue(Atoms?.AccountStatusAtom);
  const [isAccountInactiveLocal, setIsAccountInactiveLocal] =
    useState(isAccountInactive);
  const [addService, setAddService] = useAtom(Atoms?.AddServiceAtom);
  LOCAL_CONTEXT?.useLocale();
  const isFirstLaunch = useFirstTimeLaunch();
  const { locale } = LOCAL_CONTEXT.useLocale();

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

  if (isAccountInactiveLocal) {
    return <ProfileScreen />;
  }

  const TabButton = ({ props, path, title, iconName }: any) => {
    const { onPress, accessibilityState } = props;
    const isSelected = accessibilityState?.selected;

    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.2 : 1)).current;
    const translateYAnim = useRef(
      new Animated.Value(isSelected ? -5 : 0)
    ).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1.2 : 0.9,
          useNativeDriver: true,
          friction: 4,
        }),
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
          }}
        >
          <View
            style={[
              styles?.icon,
              isSelected && {
                backgroundColor: Colors?.tertieryButton,
                borderColor: Colors?.white,
              },
            ]}
          >
            <MaterialIcons
              name={iconName}
              size={32}
              color={isSelected ? Colors?.tertieryButtonText : Colors.primary}
            />
          </View>
        </Animated.View>
        <Animated.Text
          style={[
            styles.customButtonText,
            {
              fontSize: getFontSize(locale, 13),
              color: isSelected ? Colors?.tertiery : Colors.primary,
              marginBottom: isSelected ? 10 : 0,
            },
          ]}
        >
          {title}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const TabButtonProfile = ({ props }: any) => {
    const { onPress, accessibilityState, iconName } = props;
    const isSelected = accessibilityState?.selected;

    const [showProfile, setShowProfile] = useState(true);

    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.2 : 1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(
      new Animated.Value(isSelected ? -5 : 0)
    ).current;

    useEffect(() => {
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowProfile((prev) => !prev);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }, 4000);

      return () => clearInterval(interval);
    }, []);
    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1.2 : 0.9,
          useNativeDriver: true,
          friction: 4,
        }),
        Animated.spring(translateYAnim, {
          toValue: isSelected ? -5 : 0,
          useNativeDriver: true,
          friction: 5,
        }),
      ]).start();
    }, [isSelected]);

    return (
      <>
        <TouchableOpacity
          style={[styles.customButton]}
          onPress={() => router?.push("/(tabs)/fifth")}
        >
          <Animated.View
            style={{
              transform: [{ scale: fadeAnim }, { translateY: translateYAnim }],
            }}
          >
            <View style={styles?.notificationWrapper}>
              <View
                style={[
                  styles?.icon,
                  styles?.doubleIcon,
                  isSelected && {
                    backgroundColor: Colors?.tertieryButton,
                    borderColor: Colors?.white,
                  },
                ]}
              >
                <MaterialIcons
                  name={showProfile ? "person" : "notifications"}
                  size={32}
                  color={
                    isSelected ? Colors?.tertieryButtonText : Colors.primary
                  }
                />
              </View>
              {
                <BadgeComponent
                  style={{
                    backgroundColor: isSelected
                      ? Colors?.tertieryButton
                      : Colors?.primary,
                    marginLeft: -10,
                  }}
                  count={4}
                />
              }
            </View>
          </Animated.View>
          <Animated.Text
            style={[
              styles.customButtonText,
              {
                fontSize: getFontSize(locale, 13),
                color: isSelected ? Colors?.tertiery : Colors.primary,
                marginBottom: isSelected ? 10 : 0,
              },
            ]}
          >
            {showProfile ? t("myProfile") : t("notifications")}
          </Animated.Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 70,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: Colors.white,
            elevation: 10, // Shadow for Android
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
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
            tabBarButton: (props) => (
              <TabButtonProfile
                props={props}
                iconName={userDetails?.isAdmin ? "profile" : "calendar-month"}
              />
            ),
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
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  customButtonText: {
    color: Colors?.primary,
    fontWeight: "500",
    textAlign: "center",
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    borderWidth: 3,
    borderColor: Colors?.white,
    backgroundColor: Colors?.white,
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  doubleIcon: {
    borderRadius: 8,
    width: 48,
    height: 48,
  },
});
