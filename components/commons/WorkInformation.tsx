import Colors from "@/constants/Colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WorkInformationProps {
  information: any;
}

const WorkInformation = ({ information }: WorkInformationProps) => {
  return (
    <View style={styles?.container}>
      <Text style={styles.workInfoHeading}>Work Information</Text>
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
            <Text style={styles?.itemValue}>
              {information?.workDetails?.total}
            </Text>
            <MaterialCommunityIcons
              style={{ transform: "rotate(90deg)" }}
              name="pause-circle"
              size={28}
              color={Colors.black}
            />
          </View>
          <Text>Total Tasks</Text>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <Text style={styles?.itemValue}>
              {information?.workDetails?.completed}
            </Text>
            <Ionicons
              name="checkmark-done-circle-sharp"
              size={28}
              color={Colors.black}
            />
          </View>
          <Text>Completed</Text>
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
            <Text style={styles?.itemValue}>
              {information?.workDetails?.pending || 0}
            </Text>
            <MaterialCommunityIcons
              name="clock"
              size={28}
              color={Colors.black}
            />
          </View>
          <Text>Pending</Text>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <Text style={styles?.itemValue}>
              {information?.workDetails?.cancelled?.byWorker || 0}
            </Text>
            <MaterialIcons name="cancel" size={28} color={Colors.black} />
          </View>
          <Text>Cancelled</Text>
        </View>
      </View>
    </View>
  );
};

export default WorkInformation;

const styles = StyleSheet.create({
    container: {
        // padding: 20,
      },
  workInfoHeading: {
    color: Colors.primary,
    // marginLeft: 30,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  workInfoWrapper: {
    // marginTop: 10,
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
  menuWrapper: {
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  itemValue: {
    fontSize: 22,
    fontWeight: "600",
  },
});
