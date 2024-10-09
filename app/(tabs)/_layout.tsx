import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import {
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { AddServiceInProcess, UserAtom } from "../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
import { usePushNotifications } from "../hooks/usePushNotification";
import { useLocale } from "../context/locale";

export default function Layout() {
  const { locale } = useLocale();
  const userDetails = useAtomValue(UserAtom);
  const isAddService = useAtomValue(AddServiceInProcess);
  const { expoPushToken, sendPushNotification } = usePushNotifications(
    userDetails?._id
  );

  useEffect(() => {}, [locale]);

  if (!userDetails?.isAuth) {
    expoPushToken && sendPushNotification(expoPushToken);
    return <Login />;
  }

  return (
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
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: any) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title:
            userDetails?.role === "Employer" ? "My Services" : "My Bookings",
          tabBarIcon: ({ color }: any) => (
            <MaterialIcons name="calendar-month" size={30} color={color} />
          ),
        }}
      />
      {(userDetails?.role === "WORKER" || userDetails?.role === "Labour") &&
      userDetails?.roleType === "ONE" ? (
        <Tabs.Screen
          name="help"
          options={{
            title: userDetails?.roleType === "ONE" ? "Help" : "Workers",
            tabBarIcon: ({ color }: any) =>
              userDetails?.roleType === "ONE" ? (
                <Entypo name="help" size={30} color={color} />
              ) : (
                <FontAwesome6 name="people-group" size={30} color={color} />
              ),
          }}
        />
      ) : (
        <Tabs.Screen
          name={userDetails?.role === "Employer" ? "addService" : "addService"}
          options={{
            headerShown: false,
            title:
              userDetails?.role === "Employer"
                ? "Add Service"
                : "Add Requirments",
            tabBarIcon: ({ color }: any) => (
              <View>
                <Entypo
                  name="squared-plus"
                  size={30}
                  color={color}
                  // style={styles.addIcon}
                />
              </View>
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="workers"
        options={{
          title: userDetails?.role === "Employer" ? "Workers" : "Services",
          tabBarIcon: ({ color }: any) => (
            <MaterialIcons name="work" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }: any) => (
            <FontAwesome name="user" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={userDetails?.roleType === "ONE" ? "addService" : "help"}
        options={{
          title: "Add Service",
          headerShown: false,
          href: null,
          tabBarIcon: ({ color }: any) => (
            <FontAwesome name="user" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    backgroundColor: Colors.primary,
    borderRadius: Platform.select({
      ios: 30,
      android: 50,
    }),
    overflow: "hidden",
    color: Colors.white,
    position: "absolute",
    right: -32,
    top: -50,
  },
});
