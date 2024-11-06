import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

const AboutCompany = () => {
  return (
    <View style={styles.container}>
      <CustomHeading>ABOUT OUR COMPANY</CustomHeading>

      <View style={styles.divider}></View>

      <CustomText fontSize={14}>
        A tale of a fateful trip that started from this tropic port aboard this
        tiny ship today still wanted by the government they survive as soldiers
        of fortune to a deluxe apartment in the sky moving on up to the east
        side a family.
      </CustomText>

      <CustomText fontSize={14}>
        The government they survive as soldiers of fortune baby if you've ever
        wondered the east side to a deluxe apartment.
      </CustomText>

      <View style={styles.iconsRow}>
        {/* Vision Icon */}
        <View style={styles.iconContainer}>
          <AntDesign name="staro" size={40} color="#1F3E72" />
          <CustomHeading fontSize={14}>Vision</CustomHeading>
        </View>

        {/* Missions Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome6 name="medal" size={40} color="#1F3E72" />
          <CustomHeading fontSize={14}>Missions</CustomHeading>
        </View>

        {/* Goals Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="bullseye-arrow"
            size={40}
            color="#1F3E72"
          />
          <CustomHeading fontSize={14}>Goals</CustomHeading>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 30,
    backgroundColor: "#F0F4FA",
  },
  divider: {
    alignSelf: "center",
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginTop: 8,
    marginBottom: 14,
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  iconContainer: {
    alignItems: "center",
    flex: 1,
  },
});

export default AboutCompany;
