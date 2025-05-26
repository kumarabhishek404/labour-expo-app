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

const POLLING_INTERVAL = 30000;
type IconLibrary =
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "AntDesign"
  | "Ionicons"
  | "FontAwesome";

export default function Layout() {
  const [notificationCount, setNotificationCount] = useAtom(
    Atoms.notificationCount
  );
  const [token, setToken] = useAtom(Atoms?.tokenAtom);
  const pathname = usePathname();
  const userDetails = useAtomValue(Atoms.UserAtom);
  const [showExitModal, setShowExitModal] = useState(false);
  const history = useRef<string[]>([]);

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!userDetails || !userDetails?._id) {
      console.log("Redirecting to login screen -  ", userDetails);
      router.replace("/screens/auth/login");
    }
  }, [userDetails, router]);

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
    const exitPaths = [
      "/",
      "/(tabs)",
      "/(tabs)/first",
      "/(tabs)/second",
      "/(tabs)/third",
      "/(tabs)/fourth",
    ]; // Adjusted for tab routes
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
    const isSelected = props.accessibilityState?.selected;
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
      scale.value = withSpring(isSelected ? 1.2 : 1, { damping: 10 });
      translateY.value = withSpring(isSelected ? -5 : 0, { damping: 10 });
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
    };

    const Icon = iconMap[iconLibrary as IconLibrary] || MaterialIcons;

    // Ensure iconName is a string literal type using 'as const'
    const iconNameLiteral = iconName as any;

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push(path as any)}
      >
        <Animated.View style={animatedStyle}>
          <Icon
            name={iconNameLiteral}
            size={iconSize}
            color={isSelected ? Colors.primary : "#888"}
          />
        </Animated.View>
        <CustomText
          color={isSelected ? Colors.primary : "#888"}
          fontWeight="600"
        >
          {t(title)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const isAdmin = userDetails?.isAdmin;

  return (
    <View style={styles.container}>
      {userDetails && userDetails?.status !== "ACTIVE" ? (
        <UserProfile />
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: Colors.primary, // Added for consistency
            tabBarInactiveTintColor: "#888",
          }}
        >
          <Tabs.Screen
            name="fourth"
            options={{
              tabBarButton: (props) => (
                <TabButton
                  props={props}
                  path="/(tabs)/fourth"
                  title={isAdmin ? "users" : "allRequests"}
                  iconName={
                    isAdmin ? "people-sharp" : "hand-front-right-outline"
                  }
                  iconLibrary={isAdmin ? "Ionicons" : "MaterialCommunityIcons"}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="second"
            options={{
              tabBarButton: (props) => (
                <TabButton
                  props={props}
                  path="/(tabs)/second"
                  title={isAdmin ? "services" : "search"}
                  iconName={isAdmin ? "sickle" : "search"}
                  iconLibrary={isAdmin ? "MaterialCommunityIcons" : undefined}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="index"
            options={{
              tabBarButton: (props) =>
                isAdmin ? (
                  <TabButton
                    props={props}
                    path="/(tabs)"
                    title="teams"
                    iconName="group"
                    iconLibrary="FontAwesome"
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => router.push("/(tabs)")}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={36}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                ),
            }}
          />

          <Tabs.Screen
            name="third"
            options={{
              tabBarButton: (props) => (
                <TabButton
                  props={props}
                  path="/(tabs)/third"
                  title={isAdmin ? "errors" : "myBookings"}
                  iconName={isAdmin ? "error" : "calendar"}
                  iconLibrary={isAdmin ? "MaterialIcons" : "AntDesign"}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="fifth"
            options={{
              tabBarButton: (props) => (
                <TabButton
                  props={props}
                  path="/(tabs)/fifth"
                  title={isAdmin ? "myProfile" : "myProfile"}
                  iconName={isAdmin ? "person" : "person-outline"}
                />
              ),
            }}
          />
        </Tabs>
      )}

      <StickButtonWithWall
        onPress={() =>
          router.push({
            pathname: "/screens/notifications",
            params: { title: "notifications", type: "all" },
          })
        }
        notificationCount={notificationCount}
      />

      <ExitConfirmationModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => BackHandler.exitApp()}
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
