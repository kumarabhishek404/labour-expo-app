import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
import { usePushNotifications } from "../hooks/usePushNotification";
import { useLocale } from "../context/locale";

export default function Layout() {
  const {locale} = useLocale();
  const userDetails = useAtomValue(UserAtom)
  const { expoPushToken, sendPushNotification } = usePushNotifications(userDetails?._id);

  useEffect(() => {}, [locale])
  // if (state?.isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  if (!userDetails?.isAuth) {
    expoPushToken && sendPushNotification(expoPushToken)
    return <Login />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.bgColor,
          borderTopWidth: 0,
          padding: 0,
          height: 66,
          paddingTop: 6,
          paddingBottom: 6
        },
        tabBarLabelStyle: {
          fontSize: 10
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: userDetails?.role === "Employer" ? "My Services" : "My Bookings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: userDetails?.role === "Employer" ? "Add Service" : "Add Availability",
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons
                name="add-outline"
                size={60}
                color={color}
                style={styles.addIcon}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: userDetails?.role === "Employer" ? "Workers" : "Services",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }) => (
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
    borderRadius: 50,
    color: Colors.white,
    position: "absolute",
    right: -32,
    top: -50,
  },
});
