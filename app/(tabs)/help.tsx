import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import Helps from "../screens/helps";
import Workers from "../screens/users";
import CustomHeader from "@/components/commons/Header";

const MiddleOption = () => {
  const userDetails = useAtomValue(UserAtom);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={userDetails?.role === "WORKER" ? "Helps" : "Workers"}
              right="notification"
            />
          ),
        }}
      />
      {userDetails?.role === "WORKER" ? <Helps /> : <Workers />}
    </>
  );
};

export default MiddleOption;
