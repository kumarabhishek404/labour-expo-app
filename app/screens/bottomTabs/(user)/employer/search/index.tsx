import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import IconButtonGroup from "@/components/commons/IconGroupButtons";
import GradientWrapper from "@/components/commons/GradientWrapper";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import AllTopWorkers from "../topWorkers";

import bookedWorkers from "../../../../../../assets/bookedWorkers.png";
import myServices from "../../../../../../assets/myServices.png";

const EmployerSearchScreen = () => {
  const ClickAddService = () =>
    router.push({ pathname: "/screens/addService" });

  const ClickMyAllServices = () =>
    router.push({
      pathname: "/screens/service",
      params: { title: "titleMyAllServicesAndBookings", type: "myServices" },
    });

  const buttons = [
    {
      icon: bookedWorkers,
      label: t("add"),
      onPress: ClickAddService,
    },
    {
      icon: myServices,
      label: t("myServices"),
      onPress: ClickMyAllServices,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      {/* Top Buttons */}
      <View style={styles.header}>
        <IconButtonGroup buttons={buttons} />
      </View>

      {/* ⭐ IMPORTANT: No ScrollView here */}
      <GradientWrapper height={Dimensions.get("window").height - 230}>
        <AllTopWorkers />
      </GradientWrapper>
    </View>
  );
};

export default EmployerSearchScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 20,
  },
});
