import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Login from "../auth/login";
import Register from "../auth/register";
import { useStateContext } from "../context/context";
import { getAllKeys, getItem } from "@/utils/AsyncStorage";
import * as SecureStore from 'expo-secure-store';

export default function Layout() {
  const { state, dispatch }: any = useStateContext();

  // if (state?.isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  if (!state?.isAuth) {
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
          fontSize: 12
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
          title: "My Bookings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: state?.userDetails?.role === "Employer" ? "Add Service" : "Add Availability",
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
          title: state?.userDetails?.role === "Employer" ? "Workers" : "Services",
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
