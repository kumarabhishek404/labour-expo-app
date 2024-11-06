import { UserAtom } from "@/app/AtomStore/user";
import { useAtomValue } from "jotai";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

const StatsCard = () => {
  const userDetails = useAtomValue(UserAtom);
  return (
    <View style={styles.container}>
      <View>
        <CustomHeading fontSize={20}>
          {userDetails?.role === "EMPLOYER"
            ? userDetails?.serviceDetails?.total || 0
            : userDetails?.appliedServices?.length || 0}
        </CustomHeading>
        <CustomText>
          MY {userDetails?.role === "EMPLOYER" ? "SERVICES" : "BOOKINGS"}
        </CustomText>
      </View>
      <View>
        <CustomHeading fontSize={20}>
          {userDetails?.likedBy?.length || 0}
        </CustomHeading>
        <CustomText>MY LIKES</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 1, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    marginBottom: 20,
  },
});

export default StatsCard;
