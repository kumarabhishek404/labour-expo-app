import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";

import Icon from "../../assets/adaptive-icon.png";
import { Link } from "expo-router";




const Role = () => {
  return (
    <SafeAreaView className="py-4 flex-1 justify-center bg-blue-500 items-center px-6">
      <View className="py-4">
        <Text
          style={{
            fontFamily: "Montserrat_500Medium",
          }}
          className="text-2xl text-white text-center "
        >
          Choose Role
        </Text>
      </View>
      <View
        className="flex-1 justify-center space-y-4 bg-blue-500  w-full p-4  "
        behavior="padding"
      >
        <Pressable className="bg-white  flex justify-center rounded items-center h-12">
          <Text
            style={{
              fontFamily: "Montserrat_600SemiBold",
            }}
            className="text-[18px] font-semibold text-blue-500"
          >
            Employer
          </Text>
        </Pressable>
        <Pressable className="bg-white  flex justify-center rounded items-center h-12">
          <Link href="/(authenticate)/labour_type_selection">
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
              }}
              className="text-[18px] font-semibold text-blue-500"
            >
              Labour
            </Text>
          </Link>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Role;

const styles = StyleSheet.create({});
