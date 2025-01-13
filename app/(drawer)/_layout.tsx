import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  MaterialIcons,
  Ionicons,
  AntDesign,
  Entypo,
  Feather,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  AccountStatusAtom,
  NotificationConsentAtom,
  UserAtom,
} from "@/app/AtomStore/user";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import { t } from "@/utils/translationHelper";
import { DrawerActions } from "@react-navigation/native";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import ModalComponent from "@/components/commons/Modal";
import { useMutation } from "@tanstack/react-query";
import { disableAccount } from "../api/user";
import { toast } from "../hooks/toast";
import { useRefreshUser } from "../hooks/useRefreshUser";
import {
  registerForPushNotificationsAsync,
  unregisterPushNotifications,
} from "../hooks/usePushNotification";
import ProfilePicture from "@/components/commons/ProfilePicture";

export default function Layout() {
  const Router = useRouter();
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [isAdmin, setIsAdmin] = useState(false);
  const setIsAccountInactive = useSetAtom(AccountStatusAtom);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("(tabs)"); // Track active menu item
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [notificationConsent, setNotificationConsent] = useAtom(
    NotificationConsentAtom
  );
  const pathname = usePathname();

  useEffect(() => {
    setIsAdmin(userDetails?.role === "ADMIN");
  }, [userDetails?.role]);

  useFocusEffect(
    React.useCallback(() => {
      let homePaths = ["/second", "/third", "/addService", "/fourth", "fifth"];
      if (homePaths?.includes(pathname)) setActiveMenu("/");
      else setActiveMenu(pathname);
    }, [pathname])
  );
  const handleLogout = () => {
    setUserDetails({
      isAuth: false,
      _id: "",
      token: "",
    });
    Router.push("/screens/auth/login");
  };

  const handleCloseProfileSection = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    // Handle profile section close logic here if needed.
  };

  const mutationDeactivateAccount = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: () => disableAccount(),
    onSuccess: (response) => {
      toast.success(t("successDeactivatedMessage"));
      useRefreshUser();
      setModalVisible(false);
      setIsAccountInactive(true);
    },
    onError: (err) => {
      console.error("error while deactivatibg the profile ", err);
    },
  });

  const handleNotificationToggle = (isEnable: boolean) => {
    console.log("isEnable--", isEnable);
    setIsEnabling(!isEnable);
    setNotificationModalVisible(true);
  };

  const registerNotification = async () => {
    try {
      await registerForPushNotificationsAsync();
      setNotificationConsent(true);
      toast.success("Notifications enabled");
      console.log("Notifications enabled");
    } catch (err) {
      setActiveMenu("(tabs)");
      console.error("Failed to enable notifications", err);
    }
  };

  const unregisterNotification = async () => {
    try {
      await unregisterPushNotifications();
      toast.success("Notifications disabled");
      console.log("Notifications disabled");
      setNotificationConsent(false);
    } catch (err) {
      setActiveMenu("(tabs)");
      console.error("Failed to disable notifications", err);
    }
  };

  const confirmNotificationChange = async () => {
    setNotificationModalVisible(false);
    try {
      if (isEnabling) {
        await registerNotification();
      } else {
        await unregisterNotification();
      }
    } catch (err) {
      toast.error("Failed to change notification preference");
      console.error(err);
    }
  };

  const notificationModalContent = () => (
    <View style={styles.modalView}>
      <MaterialIcons
        name="notifications-none"
        size={50}
        color={Colors.primary}
      />
      <View style={styles.modalTextContainer}>
        <CustomHeading style={styles.modalTitle}>
          {isEnabling ? "Enable Notifications" : "Disable Notifications"}
        </CustomHeading>
        <CustomText style={styles.modalMessage}>
          {isEnabling
            ? "Do you want to turn on notifications for this app?"
            : "Are you sure you want to turn off notifications?"}
        </CustomText>
      </View>
    </View>
  );

  const menus = [
    {
      label: `${t("welcome")} ${userDetails?.firstName}`,
      name: "/",
      onPress: () => Router?.push("/(drawer)/(tabs)"),
      icon: (color: string) => <Feather name="home" size={26} color={color} />,
      condition: true,
      hideHeader: true,
    },
    {
      label: t("requests"),
      name: "/requests",
      onPress: () => Router?.push("/(drawer)/requests"),
      icon: (color: string) => (
        <Ionicons name="hand-right-outline" size={26} color={color} />
      ),
      condition: userDetails?.role !== "EMPLOYER" && !isAdmin,
      hideHeader: true,
    },
    {
      label: t("bookings"),
      name: "/bookings",
      onPress: () => Router?.push("/(drawer)/bookings"),
      icon: (color: string) => (
        <Ionicons name="calendar-outline" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("reviews"),
      name: "/reviews",
      onPress: () => Router?.push("/(drawer)/reviews"),
      icon: (color: string) => (
        <AntDesign name="staro" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("experience"),
      name: "/experience",
      onPress: () => Router?.push("/(drawer)/experience"),
      icon: (color: string) => (
        <Entypo name="text-document" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("support"),
      name: "/support",
      onPress: () => Router?.push("/(drawer)/support"),
      icon: (color: string) => (
        <MaterialIcons name="support-agent" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("appFeedback"),
      name: "/appFeedback",
      onPress: () => Router?.push("/(drawer)/appFeedback"),
      icon: (color: string) => (
        <Ionicons name="chatbox-outline" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("tellFriends"),
      name: "/shareApp",
      onPress: () => Router?.push("/(drawer)/shareApp"),
      icon: (color: string) => (
        <MaterialIcons name="share" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    // {
    //   label: "Notifications",
    //   name: "notifications/index",
    //   onPress: () => Router?.push("/(drawer)/notifications"),
    //   icon: (color: string) => (
    //     <MaterialIcons name="notifications-none" size={28} color={color} />
    //   ),
    //   condition: true,
    //   hideHeader: true,
    // },
    {
      label: notificationConsent ? t("notificationOn") : t("notificationOff"),
      name: "/notification",
      icon: (color: string) => (
        <MaterialIcons name="notifications-none" size={26} color={color} />
      ),
      switch: true,
      switchValue: notificationConsent,
      onSwitchToggle: (menuName: string) => {
        setActiveMenu(menuName);
        handleNotificationToggle(notificationConsent);
      },
      style: [styles?.menuItem],
      condition: true,
      //   isSuspended: disabled,
    },
    {
      label: t("changeLanguage"),
      name: "/settings/changeLanguage",
      onPress: () => Router?.push("/(drawer)/settings/changeLanguage"),
      icon: (color: string) => (
        <Entypo name="language" size={26} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("privacyPolicy"),
      name: "/privacyPolicy",
      onPress: () => Router?.push("/(drawer)/privacyPolicy"),
      icon: (color: string) => <Feather name="lock" size={26} color={color} />,
      condition: true,
      hideHeader: true,
    },
    {
      label: t("termsAndConditions"),
      name: "/termsAndConditions",
      onPress: () => Router?.push("/(drawer)/termsAndConditions"),
      icon: (color: string) => (
        <SimpleLineIcons name="book-open" size={24} color={color} />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("deactivateAccount"),
      name: "/deactivateAccount",
      onPress: () => setModalVisible(true),
      icon: (color: string) => (
        <Ionicons
          name="close-circle-outline"
          size={26}
          color={
            activeMenu === "/deactivateAccount" ? Colors?.white : Colors.danger
          }
        />
      ),
      condition: true,
      hideHeader: true,
    },
    {
      label: t("deleteAccount"),
      name: "/deleteAccount",
      onPress: () => Router?.push("/(drawer)/deleteProfile"),
      icon: (color: string) => (
        <MaterialCommunityIcons
          name="delete-outline"
          size={26}
          color={
            activeMenu === "/deleteAccount" ? Colors?.white : Colors.danger
          }
        />
      ),
      condition: true,
      hideHeader: true,
    },
  ];

  const handleMenuItemClick = (menuName: any, onPress: any) => {
    setActiveMenu(menuName);
    onPress();
  };

  const modalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={34}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading fontSize={20}>{t("areYouSure")}</CustomHeading>
        <CustomText fontSize={14}>{t("deactivateMessage")}</CustomText>
        <CustomText>{t("deactivateMessageText")}</CustomText>
      </View>
    );
  };

  const ShowMenuBar = ({ activeOption }: any) => {
    return (
      <ScrollView style={styles.drawerContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileDetails}>
            <ProfilePicture uri={userDetails?.profilePicture} />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>
                {userDetails?.firstName} {userDetails?.lastName}
              </Text>
              <Text style={styles.profileRole}>{userDetails?.role}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseProfileSection}
          >
            <MaterialIcons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {menus.map(
          (menu, index) =>
            menu.condition && (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  activeOption === menu.name && styles.activeMenuItem, // Highlight active menu item
                ]}
                onPress={() =>
                  menu?.switch
                    ? menu?.onSwitchToggle(menu?.name)
                    : handleMenuItemClick(menu?.name, menu?.onPress)
                }
              >
                <View style={styles.menuItemContent}>
                  {menu?.icon(
                    activeOption === menu.name ? Colors?.white : Colors?.primary
                  )}
                  <Text
                    style={[
                      styles.menuItemText,
                      activeOption === menu.name && styles.activeMenuItemText,
                    ]}
                  >
                    {menu.label}
                  </Text>
                </View>
                {menu?.switch && (
                  <Switch
                    value={menu?.switchValue}
                    onValueChange={() => menu?.onSwitchToggle(menu?.name)}
                    thumbColor={
                      activeOption === menu.name
                        ? Colors?.white
                        : Colors.primary
                    }
                    trackColor={{
                      false: Colors?.pending,
                      true: Colors?.primary,
                    }}
                  />
                )}
              </TouchableOpacity>
            )
        )}
      </ScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={() => {
          return (
            <>
              <ShowMenuBar activeOption={activeMenu} />
              <View>
                <View style={styles.separator} />
                {/* Logout Button */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <View style={styles.menuItemContent}>
                    <MaterialIcons
                      name="logout"
                      size={28}
                      color={Colors.danger}
                    />
                    <Text style={[styles.menuItemText, styles.logoutText]}>
                      {t("logOut")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <ModalComponent
                visible={isModalVisible}
                title="Deactivate Account"
                onClose={() => {
                  setModalVisible(false);
                  setActiveMenu("(tabs)");
                }}
                content={modalContent}
                primaryButton={{
                  title: "Deactivate",
                  action: mutationDeactivateAccount.mutate,
                  styles: {
                    backgroundColor: "red",
                    borderColor: "red",
                  },
                }}
                secondaryButton={{
                  action: () => {
                    setModalVisible(false);
                    setActiveMenu("(tabs)");
                  },
                  styles: {
                    paddingHorizontal: 10,
                  },
                }}
              />

              <ModalComponent
                visible={isNotificationModalVisible}
                title={
                  isEnabling ? "Enable Notifications" : "Disable Notifications"
                }
                onClose={() => {
                  setActiveMenu("(tabs)");
                  setNotificationModalVisible(false);
                }}
                content={notificationModalContent}
                primaryButton={{
                  title: isEnabling ? "Enable" : "Disable",
                  action: confirmNotificationChange,
                  styles: {
                    backgroundColor: isEnabling
                      ? Colors.primary
                      : Colors.danger,
                    borderColor: isEnabling ? Colors.primary : Colors.danger,
                  },
                }}
                secondaryButton={{
                  action: () => {
                    setActiveMenu("(tabs)");
                    setNotificationModalVisible(false);
                  },
                }}
              />
            </>
          );
        }}
      ></Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  profileSection: {
    marginTop: 40,
    padding: 10,
    margin: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileText: {
    flexDirection: "column",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  profileRole: {
    fontSize: 14,
    color: Colors.white,
  },
  profileRating: {
    fontSize: 14,
    color: Colors.white,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  activeMenuItem: {
    backgroundColor: Colors.tertiery, // Highlight active menu item
    borderRadius: 5,
  },
  activeMenuItemContent: {
    backgroundColor: Colors?.white,
  },
  activeMenuItemText: {
    color: Colors?.white,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  logoutButton: {
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: "600",
  },
  copyrightContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.gray,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#FFD700", // Yellow circle
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
  },
});
