import {
  StyleSheet,
  Pressable,
  View,
  BackHandler,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Linking } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Tabs, router, usePathname } from "expo-router";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  FontAwesome,
  FontAwesome5,
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
import { uploadPendingProfileImage } from "@/utils/backgroundImageUpload";
import REFRESH_USER from "../hooks/useRefreshUser";
import APP_CONTEXT from "../context/locale";

const POLLING_INTERVAL = 30000;
type IconLibrary =
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "AntDesign"
  | "Ionicons"
  | "FontAwesome"
  | "FontAwesome5";

export default function Layout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  /** Bottom inset only; tiny fallback when inset is 0 (no double “extra” padding). */
  const tabBarBottomPad =
    insets.bottom > 0 ? insets.bottom : Platform.OS === "android" ? 4 : 2;
  /** Inner content height — compact like classic tab bars; still fits 2-line labels. */
  const TAB_BAR_CONTENT = 64;
  const tabBarTopPad = 6;
  const tabBarHeight = tabBarTopPad + TAB_BAR_CONTENT + tabBarBottomPad;

  const scale = Math.min(width / 375, 1.12);
  const iconSize = Math.round(Math.max(22, Math.min(25, 23.5 * scale)));
  const textSize = Math.max(10, Math.min(11, Math.round(10.5 * scale)));

  const [notificationCount, setNotificationCount]: any = useAtom(
    Atoms.notificationCount,
  );
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);

  const [showExitModal, setShowExitModal] = useState(false);
  const history = useRef<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const { setRole } = APP_CONTEXT.useApp();

  useEffect(() => {
    // wait one render cycle
    setIsReady(true);
  }, []);

  useEffect(() => {
    setRole(userDetails?.role || "");
  }, [userDetails]);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) console.log("Opened via URL:", initialUrl);
    };

    getUrlAsync();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Received URL:", url);
      // parse the URL and navigate
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (
      !userDetails ||
      !userDetails?.isAuth ||
      !userDetails?._id ||
      !userDetails?.name ||
      !userDetails?.address ||
      !userDetails?.age ||
      !userDetails?.gender
    ) {
      console.log("Redirecting to login screen -  ", userDetails);
      router.replace("/screens/auth/login");
    }
  }, [userDetails, router, isReady]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const token = await getToken();
        if (!token || !userDetails?._id || !userDetails?.isAuth) return;
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

  useEffect(() => {
    if (userDetails?._id && userDetails?.isAuth) refreshUser();
    uploadPendingProfileImage();
  }, [userDetails?._id]);

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
      FontAwesome5,
    };

    const Icon = iconMap[iconLibrary];
    const iconNameLiteral = iconName as any;

    const {
      style: tabBarItemStyle,
      children: _tabChildren,
      onPress,
      ...pressableRest
    } = props;

    const rowInnerH = TAB_BAR_CONTENT + tabBarBottomPad;

    const labelLineHeight = Math.round(textSize * 1.32);

    return (
      <Pressable
        {...pressableRest}
        accessibilityRole="button"
        onPress={onPress ?? (() => router.push(path as any))}
        android_ripple={{ color: "rgba(34, 64, 154, 0.14)", foreground: true }}
        style={({ pressed }) => [
          tabBarItemStyle,
          styles.tabButton,
          { minHeight: rowInnerH },
          itemStyles,
          pressed && Platform.OS === "ios" && styles.tabPressedIos,
        ]}
      >
        <View style={[styles.tabColumn, { paddingBottom: tabBarBottomPad }]}>
          <View
            style={[
              styles.tabPill,
              isSelected && styles.tabPillActive,
            ]}
          >
            <Icon
              name={iconNameLiteral}
              size={isSelected ? iconSize + 1 : iconSize}
              color={isSelected ? "#FFFFFF" : "#64748B"}
            />
            <CustomText
              color={isSelected ? "#FFFFFF" : "#64748B"}
              fontWeight={isSelected ? "700" : "600"}
              baseFont={textSize}
              textAlign="center"
              numberOfLines={2}
              style={[
                styles.tabLabel,
                {
                  lineHeight: labelLineHeight,
                  maxWidth: "100%",
                },
              ]}
            >
              {t(title)}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };

  const isAdmin = userDetails?.isAdmin;

  if (!isReady) return null;

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
                  height: tabBarHeight,
                  paddingBottom: 0,
                  paddingTop: tabBarTopPad,
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
              ],
            }}
          >

            <Tabs.Screen
              name="index"
              options={{
                tabBarButton: (props: any) => (
                  <TabButton
                    props={props}
                    path="/(tabs)/"
                    title={isAdmin ? "services" : "search"}
                    iconName={isAdmin ? "sickle" : "search"}
                    iconLibrary={isAdmin ? "MaterialCommunityIcons" : undefined}
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
                    title={isAdmin ? "errors" : "myActivityTitle"}
                    iconName={isAdmin ? "error" : "running"}
                    iconLibrary={isAdmin ? "MaterialIcons" : "FontAwesome5"}
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
                    title={isAdmin ? "teams" : "myWorkTitle"}
                    iconName={isAdmin ? "group" : "hammer"}
                    iconLibrary={isAdmin ? "FontAwesome" : "FontAwesome5"}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="fourth"
              options={{
                tabBarButton: (props: any) => (
                  <TabButton
                    props={props}
                    path="/(tabs)/fourth"
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
    alignItems: "stretch",
    backgroundColor: "#F4F6FC",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(34, 64, 154, 0.08)",
    elevation: 16,
    shadowColor: "#1e3a8a",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
  tabButton: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  tabPressedIos: {
    opacity: 0.92,
  },
  tabColumn: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  /** Inactive: light surface; active: filled pill (modern app–style tab). */
  tabPill: {
    width: "100%",
    maxWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 14,
    gap: 2,
    minHeight: 52,
  },
  tabPillActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tabLabel: {
    marginTop: 0,
    paddingHorizontal: 2,
    width: "100%",
    flexShrink: 1,
  },
});
