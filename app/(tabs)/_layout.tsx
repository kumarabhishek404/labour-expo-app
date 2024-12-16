// import { View, Platform, StatusBar } from "react-native";
// import React from "react";
// import { Tabs } from "expo-router";
// import {
//   Entypo,
//   FontAwesome,
//   Ionicons,
//   MaterialIcons,
// } from "@expo/vector-icons";
// import { useAtom, useAtomValue } from "jotai";
// import {
//   AccountStatusAtom,
//   AddServiceAtom,
//   AddServiceInProcess,
//   UserAtom,
// } from "../AtomStore/user";
// import Colors from "@/constants/Colors";
// import Login from "../screens/auth/login";
// import ProfileScreen from "./profile";
// import { useLocale } from "../context/locale";
// import { t } from "@/utils/translationHelper";

// export default function Layout() {
//   const userDetails = useAtomValue(UserAtom);
//   const isAccountInactive = useAtomValue(AccountStatusAtom);
//   const [addService, setAddService] = useAtom(AddServiceAtom);
//   const isAddService = useAtomValue(AddServiceInProcess);
//   useLocale();

//   if (!userDetails?.isAuth) {
//     return <Login />;
//   }

//   if (isAccountInactive) {
//     return <ProfileScreen />;
//   }

//   return (
//     <>
//       {/* <StatusBar backgroundColor={Colors?.primary} barStyle="light-content" /> */}

//       <Tabs
//         screenOptions={{
//           tabBarStyle: {
//             display: isAddService ? "none" : "flex",
//             backgroundColor: Colors.bgColor,
//             borderTopWidth: 0,
//             padding: 0,
//             height: 66,
//             paddingTop: 6,
//             paddingBottom: Platform.OS === "ios" ? 18 : 6,
//           },
//           tabBarLabelStyle: {
//             fontSize: 10,
//           },
//           tabBarShowLabel: true,
//           tabBarActiveTintColor: Colors?.secondaryText,
//           tabBarInactiveTintColor: "#999",
//           headerTintColor: Colors?.heading,
//         }}
//       >
//         <Tabs.Screen
//           name="index"
//           listeners={{
//             tabPress: () => {
//               setAddService({});
//             },
//           }}
//           options={{
//             title: t("home"), // Use translation function for text
//             tabBarIcon: ({ color }: any) => (
//               <Ionicons name="home" size={30} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="bookings"
//           listeners={{
//             tabPress: () => {
//               setAddService({});
//             },
//           }}
//           options={{
//             title:
//               userDetails?.role === "EMPLOYER"
//                 ? t("myServices") // Translated text
//                 : t("myBookings"), // Translated text
//             tabBarIcon: ({ color }: any) => (
//               <MaterialIcons name="calendar-month" size={30} color={color} />
//             ),
//           }}
//         />
//         {userDetails?.role === "WORKER" ? (
//           <Tabs.Screen
//             name="help"
//             options={{
//               title: t("help"), // Translated text
//               tabBarIcon: ({ color }: any) => (
//                 <Entypo name="help" size={30} color={color} />
//               ),
//             }}
//           />
//         ) : (
//           <Tabs.Screen
//             name="addService"
//             options={{
//               headerShown: false,
//               title:
//                 userDetails?.role === "EMPLOYER"
//                   ? addService?._id
//                     ? t("editService") // Translated text
//                     : t("addService") // Translated text
//                   : t("addNeed"), // Translated text
//               tabBarIcon: ({ color }: any) => (
//                 <View>
//                   <Entypo name="squared-plus" size={30} color={color} />
//                 </View>
//               ),
//             }}
//           />
//         )}
//         <Tabs.Screen
//           name="workers"
//           listeners={{
//             tabPress: () => {
//               setAddService({});
//             },
//           }}
//           options={{
//             title:
//               userDetails?.role === "EMPLOYER"
//                 ? t("workers") // Translated text
//                 : t("services"), // Translated text
//             tabBarIcon: ({ color }: any) => (
//               <MaterialIcons name="work" size={30} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           listeners={{
//             tabPress: () => {
//               setAddService({});
//             },
//           }}
//           options={{
//             title: t("myProfile"), // Translated text
//             tabBarIcon: ({ color }: any) => (
//               <FontAwesome name="user" size={30} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name={userDetails?.role === "WORKER" ? "addService" : "help"}
//           options={{
//             title: t("addService"), // Translated text
//             headerShown: false,
//             href: null,
//             tabBarIcon: ({ color }: any) => (
//               <FontAwesome name="user" size={30} color={color} />
//             ),
//           }}
//         />
//       </Tabs>
//     </>
//   );
// }

// app/_layout.tsx

import { View, Platform, StatusBar } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import {
  AccountStatusAtom,
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../screens/auth/login";
import ProfileScreen from "./profile";
import useFirstTimeLaunch from "../hooks/useFirstTimeLaunch";
import { useLocale } from "../context/locale";
import { t } from "@/utils/translationHelper";
import LanguageSelectionScreen from "../languageSelection";

export default function Layout() {
  const userDetails = useAtomValue(UserAtom);
  const isAccountInactive = useAtomValue(AccountStatusAtom);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const isAddService = useAtomValue(AddServiceInProcess);
  useLocale();

  const isFirstLaunch = useFirstTimeLaunch();

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch) {
    return <LanguageSelectionScreen />;
  }

  if (!userDetails?.isAuth) {
    return <Login />;
  }

  if (isAccountInactive) {
    return <ProfileScreen />;
  }

  return (
    <>
      {/* <StatusBar backgroundColor={Colors?.primary} barStyle="light-content" /> */}

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
          tabBarActiveTintColor: Colors?.secondaryText,
          tabBarInactiveTintColor: "#999",
          headerTintColor: Colors?.heading,
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
            title: t("home"), // Use translation function for text
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
              userDetails?.role === "EMPLOYER"
                ? t("myServices") // Translated text
                : t("myBookings"), // Translated text
            tabBarIcon: ({ color }: any) => (
              <MaterialIcons name="calendar-month" size={30} color={color} />
            ),
          }}
        />
        {userDetails?.role === "WORKER" ? (
          <Tabs.Screen
            name="help"
            options={{
              title: t("help"), // Translated text
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
                    ? t("editService") // Translated text
                    : t("addService") // Translated text
                  : t("addNeed"), // Translated text
              tabBarIcon: ({ color }: any) => (
                <View>
                  <Entypo name="squared-plus" size={30} color={color} />
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
            title:
              userDetails?.role === "EMPLOYER"
                ? t("workers") // Translated text
                : t("services"), // Translated text
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
            title: t("myProfile"), // Translated text
            tabBarIcon: ({ color }: any) => (
              <FontAwesome name="user" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={userDetails?.role === "WORKER" ? "addService" : "help"}
          options={{
            title: t("addService"), // Translated text
            headerShown: false,
            href: null,
            tabBarIcon: ({ color }: any) => (
              <FontAwesome name="user" size={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
