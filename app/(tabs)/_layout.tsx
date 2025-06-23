import { StyleSheet, TouchableOpacity, View, BackHandler } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import React, { useRef, useEffect, useState } from "react";
import { Tabs, router, usePathname } from "expo-router";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import StickButtonWithWall from "@/components/commons/StickButtonWithWall";
import { useAtom, useAtomValue } from "jotai";
import Atoms from "../AtomStore";
import NOTIFICATION from "../api/notification";
import ExitConfirmationModal from "@/components/commons/ExitPopup";
import UserProfile from "../screens/bottomTabs/(user)/profile";
import API_CLIENT from "../api";
import RippleDot from "@/components/commons/RippleDot";

const POLLING_INTERVAL = 30000;
type IconLibrary =
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "AntDesign"
  | "Ionicons"
  | "FontAwesome"
  | "FontAwesome5"
  | "Fontisto";

export default function Layout() {
  const [notificationCount, setNotificationCount]: any = useAtom(
    Atoms.notificationCount
  );
  const [token, setToken] = useAtom(Atoms?.tokenAtom);
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);
  const [showExitModal, setShowExitModal] = useState(false);
  const history = useRef<string[]>([]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        if (!token || !userDetails?._id) return;
        const data = await NOTIFICATION.fetchUnreadNotificationsCount();
        setNotificationCount(data?.unreadCount || 0);
      } catch (error: any) {
        console.error("Error fetching notifications:", error?.response);
      }
    };

    let intervalId: ReturnType<typeof setInterval>;
    if (userDetails?._id) {
      fetchUnreadNotifications();
      intervalId = setInterval(fetchUnreadNotifications, POLLING_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [userDetails?._id, token, setNotificationCount]); // Added setNotificationCount to dependencies

  useEffect(() => {
    if (!history.current.includes(pathname)) {
      history.current.push(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const exitPaths = ["/", "/(tabs)", "/(tabs)/third", "/(tabs)/fourth"]; // Adjusted for tab routes
    const backAction = () => {
      if (exitPaths.includes(pathname)) {
        setShowExitModal(true);
      } else if (router?.canGoBack()) {
        router.back();
      } else {
        setShowExitModal(true); // Consider showing exit modal if router can't go back
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [pathname]);

  const TabButton = ({
    props,
    path,
    title,
    iconName,
    iconLibrary = "MaterialIcons",
    iconSize = 28,
  }: {
    props: any;
    path: string;
    title: string;
    iconName: string;
    iconLibrary?: IconLibrary;
    iconSize?: number;
  }) => {
    const isSelected = pathname === path;

    const scale = useSharedValue(isSelected ? 1.1 : 1);
    const translateY = useSharedValue(isSelected ? -5 : 0);

    useEffect(() => {
      scale.value = withSpring(isSelected ? 1.2 : 1, { damping: 12 });
      translateY.value = withSpring(isSelected ? -5 : 0, { damping: 12 });
    }, [isSelected]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }));

    const iconMap = {
      MaterialIcons,
      MaterialCommunityIcons,
      AntDesign,
      Ionicons,
      FontAwesome,
      FontAwesome5,
      Fontisto,
    };

    const Icon = iconMap[iconLibrary as IconLibrary] || MaterialIcons;
    const color = isSelected ? Colors.primary : "#888";

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push(path)}
      >
        <Animated.View style={animatedStyle}>
          <Icon
            name={iconName as any}
            size={iconSize}
            color={isSelected ? Colors?.primary : color}
          />
        </Animated.View>
        <CustomText
          color={color}
          fontWeight="600"
          style={{ marginTop: 4, fontSize: 14 }}
        >
          {t(title)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const isAdmin = userDetails?.isAdmin;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary, // Added for consistency
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: (props: any) => (
              <TabButton
                props={props}
                path="/"
                title={isAdmin ? "teams" : "services"}
                iconName={isAdmin ? "error" : "plussquare"}
                iconLibrary={isAdmin ? "MaterialIcons" : "AntDesign"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="third"
          options={{
            tabBarButton: (props: any) => (
              <TabButton
                props={props}
                path="/third"
                title={isAdmin ? "errors" : "myBookings"}
                iconName={isAdmin ? "error" : "calendar-alt"}
                iconLibrary={isAdmin ? "MaterialIcons" : "FontAwesome5"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fifth"
          options={{
            tabBarButton: (props: any) => (
              <TabButton
                props={props}
                path="/fifth"
                title={isAdmin ? "myProfile" : "myProfile"}
                iconName={isAdmin ? "person" : "person"}
                iconLibrary={isAdmin ? "MaterialIcons" : "Fontisto"}
              />
            ),
          }}
        />
      </Tabs>

      <ExitConfirmationModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          BackHandler.exitApp();
          setShowExitModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
  tabButton: { alignItems: "center", justifyContent: "center" },
  postButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: Colors.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
