import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Tabs, router, usePathname } from "expo-router";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import StickButtonWithWall from "@/components/commons/StickButtonWithWall";
import { useAtomValue } from "jotai";
import Atoms from "../AtomStore";

export default function Layout() {
  const notificationCount = useAtomValue(Atoms?.notificationCount);
  const [history, setHistory] = useState<string[]>([]); // Store visited tab history
  const currentPath = usePathname();
  const pathname = usePathname(); // ✅ Get current route

  useEffect(() => {
    // Update history when path changes, but prevent duplicates
    setHistory((prevHistory) => {
      if (
        prevHistory.length > 0 &&
        prevHistory[prevHistory.length - 1] === currentPath
      ) {
        return prevHistory;
      }
      return [...prevHistory, currentPath];
    });
  }, [currentPath]);

  useEffect(() => {
    const exitPaths = ["/", "/first", "/second", "/third", "/fourth"];

    const backAction = () => {
      if (exitPaths.includes(pathname)) {
        // ✅ If at home or predefined exit paths, ask for confirmation
        Alert.alert("Exit", "Do you want to exit the app?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
      } else {
        // ✅ Use router.back() for proper navigation
        router?.back();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname, history]);

  const TabButton = ({
    props,
    path,
    title,
    iconName,
    iconLibrary = "MaterialIcons",
    iconSize = 28,
  }: any) => {
    const isSelected = props.accessibilityState?.selected;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1.2 : 1,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: isSelected ? -5 : 0,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isSelected]);

    const IconComponent = { MaterialIcons, MaterialCommunityIcons, AntDesign }[
      iconLibrary
    ];

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push(path)}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          }}
        >
          <IconComponent
            name={iconName}
            size={iconSize}
            color={isSelected ? Colors.primary : "#888"}
          />
        </Animated.View>
        <CustomText
          color={isSelected ? Colors.primary : "#888"}
          fontWeight="600"
        >
          {t(title)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}>
        <Tabs.Screen
          name="third"
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/third"
                title="myBookings"
                iconName="calendar"
                iconLibrary="AntDesign"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fourth"
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/fourth"
                title="allRequests"
                iconName="hand-front-right-outline"
                iconLibrary="MaterialCommunityIcons"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                style={styles.postButton}
                onPress={() => router.push("/(tabs)")}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={36}
                  color={Colors.white}
                />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="second"
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/second"
                title="search"
                iconName="search"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fifth"
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(tabs)/fifth"
                title="myProfile"
                iconName="person-outline"
              />
            ),
          }}
        />
      </Tabs>

      <StickButtonWithWall
        onPress={() =>
          router.push({
            pathname: "/screens/notifications",
            params: { title: "notifications", type: "all" },
          })
        }
        notificationCount={notificationCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
  tabButton: { alignItems: "center", justifyContent: "center" },
  postButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: Colors.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
