import { View, Platform, StatusBar } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import {
  AccountStatusAtom,
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
import useFirstTimeLaunch from "../hooks/useFirstTimeLaunch";
import { useLocale } from "../context/locale";
import { t } from "@/utils/translationHelper";
import LanguageSelectionScreen from "../languageSelection";
import ProfileScreen from "./(user)/profile";

export default function Layout() {
  const userDetails = useAtomValue(UserAtom);
  const isAccountInactive = useAtomValue(AccountStatusAtom);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const isAddService = useAtomValue(AddServiceInProcess);
  useLocale();

  const isFirstLaunch = useFirstTimeLaunch();

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch) {
    return <LanguageSelectionScreen />;
  }

  if (!userDetails?.isAuth) {
    return <Login />;
  }

  if (isAccountInactive) {
    return <ProfileScreen />;
  }

  return (
    <>
      {/* <StatusBar backgroundColor={Colors?.primary} barStyle="light-content" /> */}
      {userDetails?.role === "ADMIN" ? (
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: Colors.bgColor,
              borderTopWidth: 0,
              padding: 0,
              height: 66,
              paddingTop: 6,
              paddingBottom: Platform.OS === "ios" ? 18 : 6,
            },
            tabBarLabelStyle: {
              fontSize: 10,
            },
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors?.secondaryText,
            tabBarInactiveTintColor: "#999",
            headerTintColor: Colors?.heading,
          }}
        >
          <Tabs.Screen
            name="(admin)/index"
            listeners={{
              tabPress: () => {
                setAddService({});
              },
            }}
            options={{
              title: t("services"),
              tabBarIcon: ({ color }: any) => (
                <MaterialIcons
                  name="miscellaneous-services"
                  size={30}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="(admin)/users"
            listeners={{
              tabPress: () => {
                setAddService({});
              },
            }}
            options={{
              title: t("users"),
              tabBarIcon: ({ color }: any) => (
                <MaterialIcons name="work" size={30} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(admin)/settings"
            listeners={{
              tabPress: () => {
                setAddService({});
              },
            }}
            options={{
              title: t("settings"),
              tabBarIcon: ({ color }: any) => (
                <FontAwesome name="users" size={30} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(admin)/requests"
            listeners={{
              tabPress: () => {
                setAddService({});
              },
            }}
            options={{
              title: t("requests"),
              tabBarIcon: ({ color }: any) => (
                <MaterialIcons name="business" size={30} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(admin)/profile"
            listeners={{
              tabPress: () => {
                setAddService({});
              },
            }}
            options={{
              title: t("myProfile"),
              headerTitle: t("myProfile"),
              tabBarIcon: ({ color }: any) => (
                <FontAwesome name="user" size={30} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(user)/index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(user)/bookings"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(user)/help"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(user)/workers"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(user)/profile"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="addService"
            options={{
              href: null,
            }}
          />
        </Tabs>
      ) : (
        <Tabs
          screenOptions={{
            tabBarStyle: {
              display: isAddService ? "none" : "flex",
              backgroundColor: Colors.bgColor,
              borderTopWidth: 0,
              padding: 0,
              height: 66,
              paddingTop: 6,
              paddingBottom: Platform.OS === "ios" ? 18 : 6,
            },
            tabBarLabelStyle: {
              fontSize: 10,
            },
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors?.secondaryText,
            tabBarInactiveTintColor: "#999",
            headerTintColor: Colors?.heading,
          }}
        >
          <Tabs.Screen
            name="(admin)/index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(admin)/users"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(admin)/settings"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(admin)/requests"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(admin)/profile"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name={userDetails?.role === "WORKER" ? "addService" : "(user)/help"}
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(user)/index"
            listeners={{
              tabPress: () => setAddService({}),
            }}
            options={{
              title: t("home"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={30} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="(user)/bookings"
            listeners={{
              tabPress: () => setAddService({}),
            }}
            options={{
              title:
                userDetails?.role === "EMPLOYER"
                  ? t("myServices")
                  : t("myBookings"),
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="calendar-month" size={30} color={color} />
              ),
            }}
          />

          {userDetails?.role === "WORKER" ? (
            <Tabs.Screen
              name="(user)/help"
              options={{
                title: t("help"),
                tabBarIcon: ({ color }) => (
                  <Entypo name="help" size={30} color={color} />
                ),
              }}
            />
          ) : (
            <Tabs.Screen
              name="addService"
              listeners={{
                tabPress: () => setAddService({}),
              }}
              options={{
                headerTitle:
                  userDetails?.role === "EMPLOYER"
                    ? addService?._id
                      ? t("editService")
                      : t("addService")
                    : t("addNeed"),
                tabBarIcon: ({ color }) => (
                  <Entypo name="squared-plus" size={30} color={color} />
                ),
              }}
            />
          )}

          <Tabs.Screen
            name="(user)/workers"
            listeners={{
              tabPress: () => setAddService({}),
            }}
            options={{
              title:
                userDetails?.role === "EMPLOYER" ? t("workers") : t("services"),
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="work" size={30} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="(user)/profile"
            listeners={{
              tabPress: () => setAddService({}),
            }}
            options={{
              title: t("myProfile"),
              headerTitle: t("myProfile"),
              tabBarIcon: ({ color }) => (
                <FontAwesome name="user" size={30} color={color} />
              ),
            }}
          />
        </Tabs>
      )}
    </>
  );
}
