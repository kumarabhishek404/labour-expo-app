import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
// import { StatusBar } from "expo-status-bar";
import { useNavigation, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Atoms from "@/app/AtomStore";
import { useAtomValue, useSetAtom } from "jotai";
import CustomHeading from "./CustomHeading";
import ProfilePicture from "./ProfilePicture";
import { DrawerActions } from "@react-navigation/native";
import RippleDot from "./RippleDot";
import { useQuery } from "@tanstack/react-query";
import NOTIFICATION from "@/app/api/notification";
import CustomText from "./CustomText";

interface CustomHeaderProps {
  title?: string;
  left?: string;
  onLeftAction?: any;
  right?: string;
}

const CustomHeader = ({
  title,
  left,
  onLeftAction,
  right,
}: CustomHeaderProps) => {
  const notificationCount: number = useAtomValue(
    Atoms?.notificationCount
  ) as number;
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.headerContainer}>
        {/* {left === "menu" && (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 10 }}
          >
            <AntDesign name="menu-unfold" size={36} color={Colors?.white} />
          </TouchableOpacity>
        )} */}
        {left === "profile" && (
          <TouchableOpacity
            // onPress={() => router.push("/(tabs)/fifth")}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            // style={{ marginLeft: 20 }}
          >
            <ProfilePicture
              uri={userDetails?.profilePicture}
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
          </TouchableOpacity>
        )}
        {left === "back" && (
          <TouchableOpacity
            onPress={onLeftAction ? onLeftAction : router.back}
            style={{
              // backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 8,
              padding: 4,
            }}
          >
            <View
              style={{
                // backgroundColor: Colors.black,
                padding: 6,
                borderRadius: 8,
              }}
            >
              <Feather name="arrow-left" size={26} color={Colors?.primary} />
            </View>
          </TouchableOpacity>
        )}

        <CustomHeading baseFont={20} color={Colors?.primary}>
          {title}
        </CustomHeading>

        {right === "notification" ? (
          <TouchableOpacity
            onPress={() =>
              router?.push({
                pathname: "/screens/notifications",
                params: { title: "Booked", type: "booked" },
              })
            }
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 8,
              padding: 4,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 8,
              }}
            >
              <Ionicons name="notifications" size={20} color={Colors.primary} />
              {notificationCount > 0 && <RippleDot />}
            </View>
          </TouchableOpacity>
        ) : right === "like" ? (
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 8,
              padding: 4,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 8,
              }}
            >
              <Ionicons name="heart" size={20} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ minWidth: 40, width: 40 }}></View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: Colors?.background,
    zIndex: -1,
  },
  headerTitleWrapper: {},
  backButton: {
    paddingHorizontal: 10,
  },
  backText: {
    color: "#ffffff",
    fontSize: 18,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  actionButton: {
    paddingHorizontal: 10,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 18,
  },
});

export default CustomHeader;
