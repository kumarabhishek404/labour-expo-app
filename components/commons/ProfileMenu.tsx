import React, { useState } from "react";
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
import { useAtom, useSetAtom } from "jotai";
import { AccountStatusAtom, UserAtom } from "@/app/AtomStore/user";
import ModalComponent from "./Modal";
import Loader from "./Loader";
import { toast } from "@/app/hooks/toast";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const ProfileMenu = ({ disabled }: any) => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const setIsAccountInactive = useSetAtom(AccountStatusAtom);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setUserDetails({
      isAuth: false,
      _id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      likedJobs: "",
      likedEmployees: "",
      email: "",
      address: "",
      profilePicture: "",
      role: "",
      token: "",
      serviceAddress: [],
    });
    router.navigate("/screens/auth/login");
  };

  const toggleNotificationSwitch = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);
  const toggleDarkModeSwitch = () => setIsDarkModeEnabled(!isDarkModeEnabled);

  const handleDeactivateAccount = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Your account is deactivated successfully");
      setModalVisible(false);
      setIsAccountInactive(true);
      setUserDetails({
        ...userDetails,
        status: "inactive",
      });
    }, 3000);
  };

  const menus = [
    {
      title: t("yourTeam"),
      icon: (
        <MaterialIcons name="people-outline" size={28} color={Colors.primary} />
      ),
      onPress: () => router?.push({ pathname: "/screens/team" }),
      roleCondition: userDetails?.role === "MEDIATOR",
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("requests"),
      icon: (
        <Ionicons name="hand-right-outline" size={28} color={Colors.primary} />
      ),
      onPress: () => router?.push({ pathname: "/screens/requests" }),
      roleCondition: userDetails?.role !== "EMPLOYER",
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
      title: t("booked"),
      icon: (
        <MaterialIcons name="people-outline" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/users",
          params: { role: "workers", title: t("booked"), type: "booked" },
        }),
      roleCondition: userDetails?.role === "EMPLOYER",
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: `${t("yourFavorites")} ${
        userDetails?.role === "EMPLOYER"
          ? t("workers")
          : t("employers")
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
    {
      title: t("payment"),
      icon: <MaterialIcons name="payment" size={28} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/payments",
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("tellFriends"),
      icon: <MaterialIcons name="share" size={28} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/shareApp",
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("support"),
      icon: (
        <MaterialIcons name="support-agent" size={28} color={Colors.primary} />
      ),
      onPress: () =>
        router?.push({
          pathname: "/screens/support",
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("changeLanguage"),
      icon: <Entypo name="language" size={28} color={Colors.primary} />,
      onPress: () =>
        router?.push({
          pathname: "/screens/settings/changeLanguage",
        }),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: isNotificationsEnabled
        ? t("notificationOn")
        : t("notificationOff"),
      icon: (
        <MaterialIcons
          name="notifications-none"
          size={28}
          color={Colors.primary}
        />
      ),
      switch: true,
      switchValue: isNotificationsEnabled,
      onSwitchToggle: toggleNotificationSwitch,
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("darkMode"),
      icon: isDarkModeEnabled ? (
        <MaterialIcons name="dark-mode" size={28} color={Colors.primary} />
      ) : (
        <Feather
          name="sun"
          size={28}
          color={Colors.primary}
          style={{ marginBottom: 2 }}
        />
      ),
      switch: true,
      switchValue: isDarkModeEnabled,
      onSwitchToggle: () => toggleDarkModeSwitch(),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("appFeedback"),
      icon: (
        <Ionicons name="chatbox-outline" size={28} color={Colors.primary} />
      ),
      onPress: () => router?.push("/screens/feedback"),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("reviews"),
      icon: <AntDesign name="staro" size={28} color={Colors.primary} />,
      onPress: () => router?.push("/screens/reviews"),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("privacyPolicy"),
      icon: <Feather name="lock" size={28} color={Colors.primary} />,
      onPress: () => router?.push("/screens/privacyPolicy"),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("termsAndConditions"),
      icon: (
        <SimpleLineIcons name="book-open" size={28} color={Colors.primary} />
      ),
      onPress: () => router?.push("/screens/terms&Conditions"),
      style: [styles?.menuItem],
      isSuspended: disabled,
    },
    {
      title: t("deactivateAccount"),
      icon: (
        <Ionicons name="close-circle-outline" size={28} color={Colors.danger} />
      ),
      onPress: () => setModalVisible(true),
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
            <CustomHeading fontSize={34}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading fontSize={20}>Are you sure?</CustomHeading>
        <CustomText fontSize={14}>
          You want to deactivate your account?
        </CustomText>
        <CustomText>
          Deactivating your account will disable your Profile and remove your
          name and photo from most things that you've shared. Some information
          may still be visible to others, such as your name in their friend list
          and messages that you've sent.
        </CustomText>
      </View>
    );
  };

  return (
    <>
      <Loader loading={isLoading} />
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
                  <CustomHeading style={styles.menuItemText}>
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
          action: handleDeactivateAccount,
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
  copyright: {
    marginTop: 20,
  },
});
