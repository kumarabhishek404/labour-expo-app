import React, { useState } from "react";
import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useStateContext } from "../context/context";
import { router, Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";

const Favourite = (props: any) => {
  const { state, dispatch }: any = useStateContext();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "Favourite",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
                marginRight: 20
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 10,
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
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 100,
          }}
        >
          <Text>Favourites</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Favourite;
