import {
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
  useWindowDimensions,
  Platform,
} from "react-native";
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
import { useAtom } from "jotai";
import Atoms from "../AtomStore";
import NOTIFICATION from "../api/notification";
import ExitConfirmationModal from "@/components/commons/ExitPopup";
import UserProfile from "../screens/bottomTabs/(user)/profile";
import API_CLIENT from "../api";
import RippleDot from "@/components/commons/RippleDot";
import { getToken } from "@/utils/authStorage";

const POLLING_INTERVAL = 30000;
type IconLibrary =
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "AntDesign"
  | "Ionicons"
  | "FontAwesome";

export default function Layout() {
  const { height, width } = useWindowDimensions();

  // Base scaling factor (change if needed)
  const scale = width / 375; // 375 is iPhone X width
  const tabHeight = Math.max(60 * scale, 60); // Prevents being too small
  const iconSize = Math.min(28 * scale, 34);
  const textSize = Math.min(24 * scale, 14);

  const [notificationCount, setNotificationCount]: any = useAtom(
    Atoms.notificationCount,
  );
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);
  const [showExitModal, setShowExitModal] = useState(false);
  const history = useRef<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // wait one render cycle
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // If not logged in, redirect to login page
    if (
      !userDetails ||
      !userDetails?.isAuth ||
      !userDetails?._id ||
      !userDetails?.name ||
      !userDetails?.address ||
      !userDetails?.age ||
      !userDetails?.gender ||
      !userDetails?.profilePicture
    ) {
      console.log("Redirecting to login screen -  ", userDetails);
      router.replace("/screens/auth/login");
    }
  }, [userDetails, router]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const token = await getToken();
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
  }, [userDetails?._id, setNotificationCount]); // Added setNotificationCount to dependencies

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
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => subscription.remove();
  }, [pathname]);

  const TabButton = ({
    props,
    path,
    title,
    iconName,
    iconLibrary = "MaterialIcons",
    itemStyles,
  }: {
    props: any;
    path: string;
    title: string;
    iconName: string;
    iconLibrary?: IconLibrary;
    itemStyles?: any;
  }) => {
    const isSelected = `/(tabs)${pathname}` === path;

    const iconMap = {
      MaterialIcons,
      MaterialCommunityIcons,
      AntDesign,
      Ionicons,
      FontAwesome,
    };

    const Icon = iconMap[iconLibrary];
    const iconNameLiteral = iconName as any;

    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          itemStyles,
          isSelected && styles.activeTabButton,
        ]}
        onPress={() => router.push(path as any)}
        activeOpacity={0.8}
      >
        <Icon
          name={iconNameLiteral}
          size={iconSize}
          color={isSelected ? "#fff" : "#888"}
        />
        <CustomText
          color={isSelected ? "#fff" : "#888"}
          fontWeight="600"
          baseFont={textSize}
        >
          {t(title)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  console.log("userDetails---", userDetails);

  const isAdmin = userDetails?.isAdmin;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.container}>
        {userDetails &&
        !userDetails?.token &&
        userDetails?.status !== "ACTIVE" ? (
          <UserProfile />
        ) : (
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: [
                styles.tabBar,
                {
                  // height: tabHeight,
                  // paddingBottom: Platform.OS === "ios" ? 20 * scale : 8 * scale,
                  // paddingTop: 6 * scale,
                },
              ],
            }}
          >
            <Tabs.Screen
              name="fourth"
              options={{
                tabBarButton: (props: any) => (
                  <TabButton
                    props={props}
                    path="/(tabs)/fourth"
                    title={isAdmin ? "users" : "allRequests"}
                    iconName={
                      isAdmin ? "people-sharp" : "hand-front-right-outline"
                    }
                    iconLibrary={
                      isAdmin ? "Ionicons" : "MaterialCommunityIcons"
                    }
                    // itemStyles={{
                    //   borderTopRightRadius: 12,
                    // }}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="second"
              options={{
                tabBarButton: (props: any) => (
                  <TabButton
                    props={props}
                    path="/(tabs)/second"
                    title={isAdmin ? "services" : "search"}
                    iconName={isAdmin ? "sickle" : "search"}
                    iconLibrary={isAdmin ? "MaterialCommunityIcons" : undefined}
                    // itemStyles={{
                    //   borderTopLeftRadius: 12,
                    //   borderTopRightRadius: 12,
                    // }}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="index"
              options={{
                tabBarButton: (props: any) => (
                  <TabButton
                    props={props}
                    path="/(tabs)/"
                    title={isAdmin ? "teams" : "home"}
                    iconName={isAdmin ? "group" : "home"}
                    iconLibrary={isAdmin ? "FontAwesome" : "AntDesign"}
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
                tabBarButton: (props: any) => (
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
          content={
            <>
              <MaterialIcons name="notifications" size={28} color="#fff" />
              {notificationCount > 0 && <RippleDot />}
            </>
          }
          onPress={() =>
            router.push({
              pathname: "/screens/notifications",
              params: { title: "notifications", type: "all" },
            })
          }
          // notificationCount={notificationCount}
        />

        <ExitConfirmationModal
          visible={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onConfirm={() => {
            BackHandler.exitApp();
            setShowExitModal(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  tabButton: {
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
});
