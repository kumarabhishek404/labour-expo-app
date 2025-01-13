// import { Platform } from "react-native";
// import React from "react";
// import { Tabs } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import {
//   Entypo,
//   FontAwesome,
//   FontAwesome5,
//   FontAwesome6,
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
// import useFirstTimeLaunch from "../hooks/useFirstTimeLaunch";
// import { t } from "@/utils/translationHelper";
// import LanguageSelectionScreen from "../languageSelection";
// import ProfileScreen from "../screens/bottomTabs/(user)/profile";

// // Separate Tabs Navigator Component
// function TabsNavigator() {
//   const userDetails = useAtomValue(UserAtom);
//   const isAddService = useAtomValue(AddServiceInProcess);
//   const [addService, setAddService] = useAtom(AddServiceAtom);

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarStyle: {
//           display: isAddService ? "none" : "flex",
//           backgroundColor: Colors.bgColor,
//           borderTopWidth: 0,
//           padding: 0,
//           height: 66,
//           paddingTop: 6,
//           paddingBottom: Platform.OS === "ios" ? 18 : 6,
//         },
//         tabBarLabelStyle: {
//           fontSize: 10,
//         },
//         tabBarShowLabel: true,
//         tabBarActiveTintColor: Colors?.secondaryText,
//         tabBarInactiveTintColor: "#999",
//         headerTintColor: Colors?.heading,
//       }}
//     >
//       {/* Tab Screens */}
//       <Tabs.Screen
//         name="index"
//         listeners={{
//           tabPress: () => setAddService({}),
//         }}
//         options={{
//           title: userDetails?.role === "ADMIN" ? t("services") : t("home"),
//           tabBarIcon: ({ color }) =>
//             userDetails?.role === "ADMIN" ? (
//               <MaterialIcons name="work" size={32} color={color} />
//             ) : (
//               <Ionicons name="home" size={30} color={color} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="second"
//         listeners={{
//           tabPress: () => setAddService({}),
//         }}
//         options={{
//           title:
//             userDetails?.role === "ADMIN"
//               ? t("users")
//               : userDetails?.role === "EMPLOYER"
//               ? t("myServices")
//               : t("myBookings"),
//           tabBarIcon: ({ color }) =>
//             userDetails?.role === "ADMIN" ? (
//               <FontAwesome6 name="people-group" size={32} color={color} />
//             ) : (
//               <MaterialIcons
//                 name={
//                   userDetails?.role === "ADMIN" ? "people" : "calendar-month"
//                 }
//                 size={34}
//                 color={color}
//               />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name={
//           userDetails?.role === "ADMIN" || userDetails?.role === "WORKER"
//             ? "third"
//             : "addService"
//         }
//         options={{
//           headerShown:
//             userDetails?.role === "ADMIN" || userDetails?.role === "WORKER"
//               ? true
//               : false,
//           title:
//             userDetails?.role === "ADMIN"
//               ? t("settings")
//               : userDetails?.role === "WORKER"
//               ? t("help")
//               : addService?._id
//               ? t("editService")
//               : t("addService"),
//           tabBarIcon: ({ color }) =>
//             userDetails?.role === "ADMIN" ? (
//               <Ionicons name="settings" size={30} color={color} />
//             ) : userDetails?.role === "WORKER" ? (
//               <MaterialIcons name="help" size={34} color={color} />
//             ) : (
//               <Entypo name="squared-plus" size={30} color={color} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="fourth"
//         listeners={{
//           tabPress: () => setAddService({}),
//         }}
//         options={{
//           title:
//             userDetails?.role === "ADMIN"
//               ? t("requests")
//               : userDetails?.role === "EMPLOYER"
//               ? t("workers")
//               : t("services"),
//           tabBarIcon: ({ color }) =>
//             userDetails?.role === "ADMIN" ? (
//               <FontAwesome5 name="praying-hands" size={28} color={color} />
//             ) : (
//               <MaterialIcons
//                 name={userDetails?.role === "EMPLOYER" ? "people" : "work"}
//                 size={30}
//                 color={color}
//               />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="fifth"
//         listeners={{
//           tabPress: () => setAddService({}),
//         }}
//         options={{
//           title: t("myProfile"),
//           headerTitle: t("myProfile"),
//           tabBarIcon: ({ color }) => (
//             <FontAwesome name="user" size={30} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// export default function Layout() {
//   const userDetails = useAtomValue(UserAtom);
//   const isAccountInactive = useAtomValue(AccountStatusAtom);
//   const isFirstLaunch = useFirstTimeLaunch();

//   if (isFirstLaunch === null) {
//     return null;
//   } else if (isFirstLaunch) {
//     return <LanguageSelectionScreen />;
//   }

//   if (!userDetails?.isAuth) {
//     return <Login />;
//   }

//   if (isAccountInactive) {
//     return <ProfileScreen />;
//   }

//   return (
//     <Drawer
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: Colors.bgColor,
//           width: 240,
//         },
//         headerTintColor: Colors.heading,
//         drawerActiveTintColor: Colors.secondaryText,
//         drawerInactiveTintColor: "#999",
//       }}
//     >
//       <Drawer.Screen
//         // name="HomeTabs"
//         name="fifth" // This is the name of the page and must match the url from root
//         options={{
//           drawerLabel: "User",
//           title: "overview",
//         }}
//         // options={{
//         //   drawerLabel: t("homeTabs"),
//         //   title: t("home"),
//         //   drawerIcon: ({ color }: any) => (
//         //     <Ionicons name="home-outline" size={24} color={color} />
//         //   ),
//         // }}
//       />
//       {/* <Drawer.Screen
//         name="Help"
//         component={ProfileScreen} // Replace with your actual help screen component
//         options={{
//           drawerLabel: t("help"),
//           drawerIcon: ({ color }: any) => (
//             <Ionicons name="help-circle-outline" size={24} color={color} />
//           ),
//         }}
//       /> */}
//     </Drawer>
//   );
// }

import { Platform } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import {
  AccountStatusAtom,
  AddServiceAtom,
  AddServiceInProcess,
  UserAtom,
} from "../../AtomStore/user";
import Colors from "@/constants/Colors";
import Login from "../../screens/auth/login";
import useFirstTimeLaunch from "../../hooks/useFirstTimeLaunch";
import { useLocale } from "../../context/locale";
import { t } from "@/utils/translationHelper";
import LanguageSelectionScreen from "../../languageSelection";
import ProfileScreen from "../../screens/bottomTabs/(user)/profile";

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
            tabPress: () => setAddService({}),
          }}
          options={{
            // headerShown: false,
            title: userDetails?.role === "ADMIN" ? t("services") : t("home"),
            tabBarIcon: ({ color }) =>
              userDetails?.role === "ADMIN" ? (
                <MaterialIcons name="work" size={32} color={color} />
              ) : (
                <Ionicons name="home" size={30} color={color} />
              ),
          }}
        />

        <Tabs.Screen
          name="second"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            title:
              userDetails?.role === "ADMIN"
                ? t("users")
                : userDetails?.role === "EMPLOYER"
                ? t("myServices")
                : t("myBookings"),
            tabBarIcon: ({ color }) =>
              userDetails?.role === "ADMIN" ? (
                <FontAwesome6 name="people-group" size={32} color={color} />
              ) : (
                <MaterialIcons
                  name={
                    userDetails?.role === "ADMIN" ? "people" : "calendar-month"
                  }
                  size={34}
                  color={color}
                />
              ),
          }}
        />

        <Tabs.Screen
          name={
            userDetails?.role === "ADMIN" || userDetails?.role === "WORKER"
              ? "third"
              : "addService"
          }
          options={{
            headerShown:
              userDetails?.role === "ADMIN" || userDetails?.role === "WORKER"
                ? true
                : false,
            title:
              userDetails?.role === "ADMIN"
                ? t("settings")
                : userDetails?.role === "WORKER"
                ? t("help")
                : addService?._id
                ? t("editService")
                : t("addService"),
            tabBarIcon: ({ color }) =>
              userDetails?.role === "ADMIN" ? (
                <Ionicons name="settings" size={30} color={color} />
              ) : userDetails?.role === "WORKER" ? (
                <MaterialIcons name="help" size={34} color={color} />
              ) : (
                <Entypo name="squared-plus" size={30} color={color} />
              ),
          }}
        />

        <Tabs.Screen
          name="fourth"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            title:
              userDetails?.role === "ADMIN"
                ? t("requests")
                : userDetails?.role === "EMPLOYER"
                ? t("workers")
                : t("services"),
            tabBarIcon: ({ color }) =>
              userDetails?.role === "ADMIN" ? (
                <FontAwesome5 name="praying-hands" size={28} color={color} />
              ) : (
                <MaterialIcons
                  name={userDetails?.role === "EMPLOYER" ? "people" : "work"}
                  size={30}
                  color={color}
                />
              ),
          }}
        />

        <Tabs.Screen
          name="fifth"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            title: t("myProfile"),
            headerTitle: t("myProfile"),
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={30} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name={
            userDetails?.role === "ADMIN" || userDetails?.role === "WORKER"
              ? "addService"
              : "third"
          }
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
