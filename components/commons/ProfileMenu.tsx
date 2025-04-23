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
import Loader from "./Loaders/Loader";
import TOAST from "@/app/hooks/toast";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import { Badge, Divider } from "react-native-paper";
import BadgeComponent from "./Badge";
import { removeToken } from "@/utils/authStorage";

const ProfileMenu = ({ disabled }: any) => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const notificationCount = useAtomValue(Atoms?.notificationCount);
  const setIsAccountInactive = useSetAtom(Atoms?.AccountStatusAtom);
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
      TOAST?.success(t("successDeactivatedMessage"));
      refreshUser();
      setModalVisible(false);
      setIsAccountInactive(true);
    },
    onError: (err) => {
      console.error("error while deactivatibg the profile ", err);
    },
  });

  useEffect(() => {
    setIsAdmin(userDetails?.isAdmin);
  }, [userDetails?.role]);

  const handleLogout = async () => {
    setUserDetails({
      isAuth: false,
      _id: "",
    });
    await removeToken();
    router.navigate("/screens/auth/login");
  };

  const registerNotification = async () => {
    try {
      await PUSH_NOTIFICATION?.registerForPushNotificationsAsync(true);
      setNotificationConsent(true);
      TOAST?.success(t("notificationsEnabled"));
      console.log("Notifications enabled");
    } catch (err) {
      console.error("Failed to enable notifications", err);
    }
  };

  const unregisterNotification = async () => {
    try {
      await PUSH_NOTIFICATION?.unregisterPushNotifications();
      TOAST?.success("Notifications disabled");
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
      TOAST?.error("Failed to change notification preference");
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
          {isEnabling ? t("enableTitle") : t("disableTitle")}
        </CustomHeading>
        <CustomText style={styles.modalMessage}>
          {isEnabling ? t("enableMessage") : t("disableMessage")}
        </CustomText>
      </View>
    </View>
  );

  const menus = [
    {
      title: t("notifications"),
      icon: notificationConsent ? (
        <View style={styles?.notificationWrapper}>
          <Ionicons
            name="notifications-outline"
            size={26}
            color={Colors.primary}
          />
          <BadgeComponent
            style={{ marginTop: -12 }}
            count={notificationCount ?? 0}
          />
        </View>
      ) : (
        <Ionicons
          name="notifications-off-outline"
          size={26}
          color={Colors.primary}
        />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/notifications",
          params: { title: "notifications", type: "all" },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("yourTeam"),
      icon: <AntDesign name="team" size={28} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/team/[id]",
          params: {
            id: userDetails?._id,
            title: "yourTeam",
          },
        }),
      roleCondition: userDetails?.team === null,
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("requests"),
      icon: (
        <Ionicons name="hand-right-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/teamRequests",
          params: {
            id: userDetails?._id,
            title: "teamJoiningRequest",
            type: "teamJoiningRequest",
          },
        }),
      roleCondition: isAdmin,
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("savedServices"),
      icon: (
        <MaterialIcons name="work-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/service",
          params: { title: "savedServices", type: "saved" },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("savedWorkers"),
      icon: (
        <MaterialIcons name="people-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/users",
          params: {
            role: "users",
            title: "savedWorkers",
            type: "saved",
            searchCategory: JSON.stringify({
              skill: "",
            }),
          },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("reviews"),
      icon: <AntDesign name="staro" size={28} color={Colors?.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/reviews",
          params: {
            role: "mediators",
            title: "favouriteMediators",
            type: "reviews",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("experience"),
      icon: <Entypo name="text-document" size={28} color={Colors?.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/experience",
          params: {
            role: "mediators",
            title: "favouriteMediators",
            type: "experience",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
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
      isSuspended: false,
    },
    {
      title: t("changeLanguage"),
      icon: <Entypo name="language" size={28} color={Colors?.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/settings/changeLanguage",
          params: {
            title: "changeLanguage",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("support"),
      icon: (
        <MaterialIcons name="support-agent" size={28} color={Colors?.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/support",
          params: {
            title: "support",
            type: "support",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("tellFriends"),
      icon: <MaterialIcons name="share" size={28} color={Colors?.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/shareApp",
          params: {
            title: "tellFriends",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("appFeedback"),
      icon: (
        <Ionicons name="chatbox-outline" size={28} color={Colors?.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/appFeedback",
          params: {
            title: "appFeedback",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("privacyPolicy"),
      icon: <Feather name="lock" size={28} color={Colors?.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/privacyPolicy",
          params: {
            title: "privacyPolicy",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("termsAndConditions"),
      icon: (
        <SimpleLineIcons name="book-open" size={28} color={Colors?.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/termsAndConditions",
          params: {
            title: "termsAndConditions",
          },
        }),
      style: [styles?.menuItem],
      isSuspended: false,
    },
    {
      title: t("deactivateAccount"),
      icon: (
        <Ionicons name="close-circle-outline" size={30} color={Colors.danger} />
      ),
      onPress: () => setModalVisible(true),
      roleCondition: isAdmin,
      style: [styles?.menuItem],
      textStyle: { color: Colors.danger },
      isSuspended: disabled,
    },
    {
      title: t("deleteAccount"),
      icon: (
        <MaterialCommunityIcons
          name="delete-outline"
          size={30}
          color={Colors.danger}
        />
      ),
      onPress: () => router?.push("/screens/profile/deleteProfile"),
      roleCondition: isAdmin,
      style: [styles?.menuItem],
      textStyle: { color: Colors.danger },
      isSuspended: false,
    },
    {
      title: t("logOut"),
      icon: (
        <AntDesign
          name="logout"
          size={28}
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
            !menu.roleCondition && (
              <View key={index}>
                <TouchableOpacity
                  onPress={menu?.switch ? menu?.onSwitchToggle : menu?.onPress}
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
                    <CustomHeading
                      baseFont={18}
                      style={[styles.menuItemText, menu?.textStyle]}
                    >
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
                <Divider />
              </View>
            )
        )}
      </View>

      <ModalComponent
        visible={isModalVisible}
        title={t("deactivateAccount")}
        onClose={() => setModalVisible(false)}
        content={modalContent}
        primaryButton={{
          title: t("deactivate"),
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
        title={isEnabling ? t("enableTitle") : t("disableTitle")}
        onClose={() => setNotificationModalVisible(false)}
        content={notificationModalContent}
        primaryButton={{
          title: isEnabling ? t("enable") : t("disable"),
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
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
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
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
