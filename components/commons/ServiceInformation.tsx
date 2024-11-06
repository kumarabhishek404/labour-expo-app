import Colors from "@/constants/Colors";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

interface ServiceInformationProps {
  information: any;
  style?: any;
}

const ServiceInformation = ({
  information,
  style,
}: ServiceInformationProps) => {
  return (
    <View style={styles?.container}>
      <CustomHeading textAlign="left" style={[style]}>
        Service Information
      </CustomHeading>
      <View style={[styles.workInfoWrapper, { marginTop: 10 }]}>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <View style={styles?.iconWrapper}>
            <CustomHeading fontSize={26}>
              {information?.serviceDetails?.total || 0}
            </CustomHeading>
            <MaterialCommunityIcons
              style={{ transform: "rotate(90deg)" }}
              name="pause-circle-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <CustomText fontSize={14}>Total Services</CustomText>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <CustomHeading fontSize={26}>
              {information?.serviceDetails?.completed || 0}
            </CustomHeading>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <CustomText fontSize={14}>Completed</CustomText>
        </View>
      </View>
      <View style={[styles.workInfoWrapper, { borderTopWidth: 0 }]}>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <View style={styles?.iconWrapper}>
            <CustomHeading fontSize={26}>
              {information?.serviceDetails?.pending || 0}
            </CustomHeading>
            <MaterialCommunityIcons
              name="clock-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <CustomText fontSize={14}>Pending</CustomText>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <CustomHeading fontSize={26}>
              {information?.serviceDetails?.cancelled?.byWorker || 0}
            </CustomHeading>
            <Fontisto name="close" size={24} color={Colors.primary} />
          </View>
          <CustomText fontSize={14}>Cancelled</CustomText>
        </View>
      </View>
    </View>
  );
};

export default ServiceInformation;

const styles = StyleSheet.create({
  container: {},
  workInfoHeading: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  workInfoWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    height: 100,
    display: "flex",
    flexDirection: "row",
  },
  workInfoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemValue: {
    fontSize: 22,
    fontWeight: "600",
  },
});
