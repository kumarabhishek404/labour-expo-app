import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";

const FloatingButton = memo(function FloatingButton({ style }: any) {
  // Define screens where the FAB should not appear

  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={() => router?.push("/screens/addService")}
    >
      <View style={styles.iconContainer}>
        <Entypo name="plus" size={22} color="#fff" />
        <CustomText baseFont={14} fontWeight="bold" color={Colors?.white}>
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
