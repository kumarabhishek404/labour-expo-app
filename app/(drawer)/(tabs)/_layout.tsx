import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router, Tabs } from "expo-router";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Colors from "@/constants/Colors";
import Login from "../../screens/auth/login";
import useFirstTimeLaunch from "../../hooks/useFirstTimeLaunch";
import LOCAL_CONTEXT from "@/app/context/locale";
import { t } from "@/utils/translationHelper";
import LanguageSelectionScreen from "../../languageSelection";
import ProfileScreen from "../../screens/bottomTabs/(user)/profile";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Layout() {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const isAccountInactive = useAtomValue(Atoms?.AccountStatusAtom);
  const [addService, setAddService] = useAtom(Atoms?.AddServiceAtom);
  LOCAL_CONTEXT?.useLocale();
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

  const TabButton = ({ props, path, title, iconName }: any) => {
    const { onPress, accessibilityState } = props;
    const isSelected = accessibilityState?.selected;

    return (
      <TouchableOpacity
        style={[
          styles.customButton,
          isSelected && styles?.selectedCustomButton,
        ]}
        onPress={onPress}
      >
        <MaterialIcons
          name={iconName}
          size={32}
          color={isSelected ? Colors.white : Colors.primary}
        />
        <Text
          style={[
            styles.customButtonText,
            isSelected && styles.selectedButtonText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 75,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(drawer)/(tabs)"
                title={
                  userDetails?.role === "ADMIN" ? t("services") : t("home")
                }
                iconName={userDetails?.role === "ADMIN" ? "work" : "home"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="second"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(drawer)/(tabs)/second"
                title={
                  userDetails?.role === "ADMIN"
                    ? t("users")
                    : userDetails?.role === "EMPLOYER"
                    ? t("myServices")
                    : t("myBookings")
                }
                iconName={
                  userDetails?.role === "ADMIN" ? "person" : "calendar-month"
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="fourth"
          listeners={{
            tabPress: () => setAddService({}),
          }}
          options={{
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(drawer)/(tabs)/fourth"
                title={
                  userDetails?.role === "ADMIN"
                    ? t("requests")
                    : userDetails?.role === "EMPLOYER"
                    ? t("workers")
                    : t("services")
                }
                iconName={userDetails?.role === "EMPLOYER" ? "people" : "work"}
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
            tabBarButton: (props) => (
              <TabButton
                props={props}
                path="/(drawer)/(tabs)/fifth"
                title={t("myProfile")}
                iconName="person"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 6,
    borderColor: Colors?.primary,
    padding: 10,
  },
  selectedCustomButton: {
    backgroundColor: Colors?.primary,
  },
  customButtonText: {
    color: Colors?.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "white",
    fontSize: 14,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
