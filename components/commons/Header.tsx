// import React, { useEffect } from "react";
// import { hasNewNotificationAtom, UserAtom } from "@/app/AtomStore/user";
// import Colors from "@/constants/Colors";
// import { Feather, Ionicons } from "@expo/vector-icons";
// import { router, Stack } from "expo-router";
// import { useAtomValue } from "jotai";
// import { useRef } from "react";
// import {
//   Animated,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import profileImage from "../../assets/images/placeholder-person.jpg";

// interface HeaderProps {
//   isTransparent?: boolean;
//   title?: string;
//   left?: string;
//   right?: string;
// }

// const Header = ({ isTransparent, title, left, right }: HeaderProps) => {
//   const userDetails = useAtomValue(UserAtom);
//   const scaleAnim = useRef(new Animated.Value(1)).current;

// useEffect(() => {
//   if (hasNewNotification) {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1.5,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   } else {
//     scaleAnim.setValue(1); // Reset the scale if there is no new notification
//   }
// }, [hasNewNotification]);

//   return (
//     <Stack.Screen
//       options={{
//         headerShown: left === "" && right === "" ? false : true,
//         headerTransparent: isTransparent ? false : false,
//         headerTitle: title ? title : "",
//         headerTintColor: Colors?.primary,
//         headerLeft: () => (
//           <View>
// {left === "profile" && (
//   <TouchableOpacity
//     onPress={() => router.push("/(tabs)/profile")}
//     // style={{ marginLeft: 20 }}
//   >
//     <Image
//       source={
//         userDetails?.profilePicture
//           ? {
//               uri: userDetails?.profilePicture,
//             }
//           : profileImage
//       }
//       style={{ width: 40, height: 40, borderRadius: 4 }}
//     />
//   </TouchableOpacity>
// )}
//             {left === "back" && (
//               <>
//   <TouchableOpacity
//     onPress={() => {
//       // if (step === 1) setIsAddService(false);
//       router.back();
//     }}
//     style={{ marginRight: 10 }}
//   >
//     <Feather
//       name="arrow-left"
//       size={24}
//       color={Colors?.primary}
//     />
//   </TouchableOpacity>
// </>
//             )}
//           </View>
//         ),
//         headerRight: () => (
//           <View>
//             {right === "notification" && (
// <TouchableOpacity
//   onPress={() =>
//     router?.push({
//       pathname: "/screens/notifications",
//       params: { title: "Booked", type: "booked" },
//     })
//   }
//   style={{
//     marginRight: 0,
//     backgroundColor: Colors.primary,
//     padding: 8,
//     borderRadius: 8,
//     shadowColor: "red",
//     shadowOffset: { width: 2, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   }}
// >
//   <Ionicons name="notifications" size={24} color={Colors.white} />
//   {hasNewNotification ? (
//     <Animated.View
//       style={[
//         styles.alertDot,
//         { transform: [{ scale: scaleAnim }] },
//       ]}
//     />
//   ) : (
//     <></>
//   )}
// </TouchableOpacity>
//             )}
//           </View>
//         ),
//       }}
//     />
//   );
// };

// const styles = StyleSheet.create({
// alertDot: {
//   position: "absolute",
//   top: -5,
//   left: -5,
//   width: 12,
//   height: 12,
//   backgroundColor: "red",
//   borderRadius: 30,
// },
// });

// export default Header;

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { hasNewNotificationAtom, UserAtom } from "@/app/AtomStore/user";
import { useAtomValue } from "jotai";
import profileImage from "../../assets/images/placeholder-person.jpg";
import CustomHeading from "./CustomHeading";

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
  const userDetails = useAtomValue(UserAtom);
  const hasNewNotification = useAtomValue(hasNewNotificationAtom);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    if (hasNewNotification) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1); // Reset the scale if there is no new notification
    }
  }, [hasNewNotification]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        {left === "profile" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            // style={{ marginLeft: 20 }}
          >
            <Image
              source={
                userDetails?.profilePicture
                  ? {
                      uri: userDetails?.profilePicture,
                    }
                  : profileImage
              }
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
          </TouchableOpacity>
        )}
        {left === "back" && (
          <TouchableOpacity
            onPress={onLeftAction ? onLeftAction : router.back}
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
              <Feather name="arrow-left" size={20} color={Colors?.primary} />
            </View>
          </TouchableOpacity>
        )}

        <CustomHeading fontSize={20} color={Colors?.white}>
          {title}
        </CustomHeading>

        {right === "notification" && (
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
              {hasNewNotification ? (
                <Animated.View
                  style={[
                    styles.alertDot,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                />
              ) : (
                <></>
              )}
            </View>
          </TouchableOpacity>
        )}
        {right === "like" && (
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
        )}
        {!right && <View></View>}
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
    paddingTop: 30,
    backgroundColor: Colors?.primary,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  backText: {
    color: "#ffffff",
    fontSize: 18,
  },
  alertDot: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 12,
    height: 12,
    backgroundColor: "red",
    borderRadius: 30,
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
