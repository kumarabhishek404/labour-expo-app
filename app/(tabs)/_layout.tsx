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
import { useAtom, useAtomValue } from "jotai";
import {
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
// import { usePushNotifications } from "../hooks/usePushNotification";
import { useLocale } from "../context/locale";
import usePushNotifications from "../hooks/usePushNotification";

export default function Layout() {
  const { locale } = useLocale();
  const userDetails = useAtomValue(UserAtom);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const isAddService = useAtomValue(AddServiceInProcess);
  // const { expoPushToken, sendPushNotification } = usePushNotifications(
  //   userDetails?._id
  // );

  useEffect(() => {}, [locale]);

  if (!userDetails?.isAuth) {
    // expoPushToken && sendPushNotification(expoPushToken);
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
        listeners={{
          tabPress: () => {
            setAddService({});
          },
        }}
        options={{
          title: "Home",
          tabBarIcon: ({ color }: any) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        listeners={{
          tabPress: () => {
            setAddService({});
          },
        }}
        options={{
          title:
            userDetails?.role === "EMPLOYER" ? "My Services" : "My Bookings",
          tabBarIcon: ({ color }: any) => (
            <MaterialIcons name="calendar-month" size={30} color={color} />
          ),
        }}
      />
      {userDetails?.role === "WORKER" ? (
        <Tabs.Screen
          name="help"
          options={{
            title: "Help",
            tabBarIcon: ({ color }: any) => (
              <Entypo name="help" size={30} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="addService"
          options={{
            headerShown: false,
            title:
              userDetails?.role === "EMPLOYER"
                ? addService?._id
                  ? "Edit Service"
                  : "Add Service"
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
        listeners={{
          tabPress: () => {
            setAddService({});
          },
        }}
        options={{
          title: userDetails?.role === "EMPLOYER" ? "Workers" : "Services",
          tabBarIcon: ({ color }: any) => (
            <MaterialIcons name="work" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={{
          tabPress: () => {
            setAddService({});
          },
        }}
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }: any) => (
            <FontAwesome name="user" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={userDetails?.role === "WORKER" ? "addService" : "help"}
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
