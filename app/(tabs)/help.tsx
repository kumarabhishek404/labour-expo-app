import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import Helps from "../screens/helps";
import Workers from "../screens/worker";

const MiddleOption = () => {
  const userDetails = useAtomValue(UserAtom);

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerShown: true,
          headerTitle: userDetails?.roleType === "ONE" ? "Helps" : "Workers",
          headerTintColor: Colors.white,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 8,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="notifications" size={20} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      {userDetails?.roleType === "ONE" && <Helps />}
      {userDetails?.roleType === "ORG" && <Workers />}
    </>
  );
};

export default MiddleOption;
