import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";

const FloatingButton = memo(function FloatingButton() {
  const navigation = useNavigation();
  const route = useRoute();

  // Define screens where the FAB should not appear
  const excludedScreens = ["AddServiceScreen", "AnotherScreenToExclude"];

  // Check if the current screen is excluded
  if (excludedScreens.includes(route.name)) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router?.push("/screens/addService")}
    >
      <View style={styles.iconContainer}>
        <Entypo name="plus" size={22} color="#fff" />
        <CustomText fontSize={14} fontWeight="bold" color={Colors?.white}>
          {t("newService")}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 80,
    right: 8,
    backgroundColor: Colors?.tertiery,
    // width: 60,
    // height: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 6,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

FloatingButton.displayName = "FloatingButton";

export default FloatingButton;
