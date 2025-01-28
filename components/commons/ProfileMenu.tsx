import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import ModalComponent from "./Modal";
import Loader from "./Loader";
import TOAST from "@/app/hooks/toast";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import REFRESH_USER from "@/app/hooks/useRefreshUser";

const ProfileMenu = ({ disabled }: any) => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const setIsAccountInactive = useSetAtom(Atoms?.AccountStatusAtom);
  // const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationConsent, setNotificationConsent] = useAtom(
    Atoms?.NotificationConsentAtom
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const mutationDeactivateAccount = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: () => USER?.disableAccount(),
    onSuccess: (response) => {
      TOAST?.showToast?.success(t("successDeactivatedMessage"));
      refreshUser();
      setModalVisible(false);
      setIsAccountInactive(true);
    },
    onError: (err) => {
      console.error("error while deactivatibg the profile ", err);
    },
  });

  useEffect(() => {
    setIsAdmin(userDetails?.role === "ADMIN");
  }, [userDetails?.role]);

  const handleLogout = () => {
    setUserDetails({
      isAuth: false,
      _id: "",
      token: "",
    });
    router.navigate("/screens/auth/login");
  };

  const registerNotification = async () => {
    try {
      await PUSH_NOTIFICATION?.registerForPushNotificationsAsync(
        notificationConsent
      );
      setNotificationConsent(true);
      TOAST?.showToast?.success("Notifications enabled");
      console.log("Notifications enabled");
    } catch (err) {
      console.error("Failed to enable notifications", err);
    }
  };

  const unregisterNotification = async () => {
    try {
      await PUSH_NOTIFICATION?.unregisterPushNotifications();
      TOAST?.showToast?.success("Notifications disabled");
      console.log("Notifications disabled");
      setNotificationConsent(false);
    } catch (err) {
      console.error("Failed to disable notifications", err);
    }
  };

  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [isEnabling, setIsEnabling] = useState(false); // Track enable/disable action

  const handleNotificationToggle = (isEnable: boolean) => {
    console.log("isEnable--", isEnable);
    setIsEnabling(!isEnable);
    setNotificationModalVisible(true);
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
      TOAST?.showToast?.error("Failed to change notification preference");
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
      title: t("yourTeam"),
      icon: (
        <MaterialIcons name="people-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/team/[id]",
          params: { id: userDetails?._id },
        }),
      roleCondition: userDetails?.role === "MEDIATOR" && !isAdmin,
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("requests"),
      icon: (
        <Ionicons name="hand-right-outline" size={28} color={Colors.primary} />
      ),
      onPress: () => router?.push({ pathname: "/screens/requests" }),
      roleCondition: userDetails?.role !== "EMPLOYER" && !isAdmin,
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("savedServices"),
      icon: (
        <MaterialIcons name="people-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/service",
          params: { title: t("savedServices"), type: "favourite" },
        }),
      roleCondition: userDetails?.role !== "EMPLOYER",
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: `${t("yourFavorites")} ${
        userDetails?.role === "EMPLOYER" ? t("workers") : t("employers")
      }`,
      icon: <FontAwesome6 name="heart" size={24} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/users",
          params: {
            role: userDetails?.role === "EMPLOYER" ? "workers" : "employers",
            title:
              userDetails?.role === "EMPLOYER"
                ? t("favouriteWorkers")
                : t("favouriteEmployers"),
            type: "favourite",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("favouriteMediators"),
      icon: <FontAwesome6 name="heart" size={24} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/users",
          params: {
            role: "mediators",
            title: t("favouriteMediators"),
            type: "favourite",
          },
        }),
      roleCondition: userDetails?.role !== "MEDIATOR",
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("favouriteWorkers"),
      icon: <FontAwesome6 name="heart" size={24} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/users",
          params: {
            role: "workers",
            title: t("favouriteWorkers"),
            type: "favourite",
          },
        }),
      roleCondition: userDetails?.role === "MEDIATOR",
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    // {
    //   title: t("payment"),
    //   icon: <MaterialIcons name="payment" size={28} color={Colors.primary} />,
    //   onPress: () =>
    //     router?.push({
    //       pathname: "/screens/payments",
    //     }),
    //   style: [styles?.menuItem],
    //   isSuspended: disabled,
    // },
    {
      title: notificationConsent ? t("notificationOn") : t("notificationOff"),
      icon: (
        <MaterialIcons
          name="notifications-none"
          size={28}
          color={Colors.primary}
        />
      ),
      switch: true,
      switchValue: notificationConsent,
      onSwitchToggle: () => handleNotificationToggle(notificationConsent),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    // {
    //   title: t("darkMode"),
    //   icon: isDarkModeEnabled ? (
    //     <MaterialIcons name="dark-mode" size={28} color={Colors.primary} />
    //   ) : (
    //     <Feather
    //       name="sun"
    //       size={28}
    //       color={Colors.primary}
    //       style={{ marginBottom: 2 }}
    //     />
    //   ),
    //   switch: true,
    //   switchValue: isDarkModeEnabled,
    //   onSwitchToggle: () => toggleDarkModeSwitch(),
    //   style: [styles?.menuItem],
    //   isSuspended: disabled,
    // },
    {
      title: t("deactivateAccount"),
      icon: (
        <Ionicons name="close-circle-outline" size={28} color={Colors.danger} />
      ),
      onPress: () => setModalVisible(true),
      roleCondition: !isAdmin,
      style: [styles?.menuItem],
      textStyle: { color: Colors.danger },
      isSuspended: disabled,
    },
    {
      title: t("deleteAccount"),
      icon: (
        <MaterialCommunityIcons
          name="delete-outline"
          size={28}
          color={Colors.danger}
        />
      ),
      onPress: () => router?.push("/screens/profile/deleteProfile"),
      roleCondition: !isAdmin,
      style: [styles?.menuItem],
      textStyle: { color: Colors.danger },
      isSuspended: false,
    },
    {
      title: t("logOut"),
      icon: (
        <AntDesign
          name="logout"
          size={22}
          color={Colors.danger}
          style={{ marginLeft: 5 }}
        />
      ),
      onPress: handleLogout,
      textStyle: { color: Colors.danger },
      style: [styles?.menuItem],
      isSuspended: false,
    },
  ];

  const modalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading baseFont={34}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading baseFont={20}>{t("areYouSure")}</CustomHeading>
        <CustomText baseFont={14}>{t("deactivateMessage")}</CustomText>
        <CustomText>{t("deactivateMessageText")}</CustomText>
      </View>
    );
  };

  return (
    <>
      <Loader loading={isLoading || mutationDeactivateAccount?.isPending} />
      <View style={styles.menuWrapper}>
        {menus.map(
          (menu, index) =>
            menu.roleCondition !== false && (
              <TouchableOpacity
                key={index}
                onPress={menu?.onPress}
                style={[
                  menu?.style,
                  styles.settingsItem,
                  menu?.isSuspended && {
                    pointerEvents: "none",
                    opacity: 0.5,
                  },
                ]}
              >
                <View style={styles.settingLabel}>
                  {menu?.icon}
                  <CustomHeading style={[styles.menuItemText, menu?.textStyle]}>
                    {menu?.title}
                  </CustomHeading>
                </View>
                {menu?.switch && (
                  <Switch
                    value={menu?.switchValue}
                    onValueChange={menu?.onSwitchToggle}
                    thumbColor={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            )
        )}
        <CustomText style={styles.copyright}>
          © 2024 KAAM DEKHO. All rights reserved.
        </CustomText>
      </View>

      <ModalComponent
        visible={isModalVisible}
        title="Deactivate Account"
        onClose={() => setModalVisible(false)}
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
          action: () => setModalVisible(false),
          styles: {
            paddingHorizontal: 10,
          },
        }}
      />

      <ModalComponent
        visible={isNotificationModalVisible}
        title={isEnabling ? "Enable Notifications" : "Disable Notifications"}
        onClose={() => setNotificationModalVisible(false)}
        content={notificationModalContent}
        primaryButton={{
          title: isEnabling ? "Enable" : "Disable",
          action: confirmNotificationChange,
          styles: {
            backgroundColor: isEnabling ? Colors.primary : Colors.danger,
            borderColor: isEnabling ? Colors.primary : Colors.danger,
          },
        }}
        secondaryButton={{
          action: () => setNotificationModalVisible(false),
        }}
      />
    </>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  switch: {
    marginLeft: "auto",
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  menuWrapper: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 70,
  },
  menuItemText: {
    marginLeft: 15,
    margin: "auto",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabel: {
    flexDirection: "row",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
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
  copyright: {
    marginTop: 20,
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
