import { StyleSheet, Text, View } from "react-native";
import React from "react";

const UserInfoComponent = ({ user }: any) => {
  return (
    <>
      <View style={styles.userInfoTextWrapper}>
        <View style={styles.userInfoBox}>
          <View style={[styles.row, styles.firstBox]}>
            <Text style={styles.userInfoText}>
              <Text style={styles?.infoLabel}>Address</Text>
              {"  "}
              {user?.address || "Address not found"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.userInfoText}>
              <Text style={styles?.infoLabel}>Mobile Number</Text>
              {"  "}
              {user?.mobileNumber ||
                user?.alternateMobileNumber ||
                "Mobile not found"}
            </Text>
          </View>
          <View style={[styles.row, styles.lastBox]}>
            <Text style={styles.userInfoText}>
              <Text style={styles?.infoLabel}>Email Address</Text>
              {"  "}
              {user?.email}, {user?.alternateEmail}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default UserInfoComponent;

const styles = StyleSheet.create({
  row: {
    paddingTop: 0,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  userInfoTextWrapper: {
    marginBottom: 25,
    marginHorizontal: 20
  },
  userInfoBox: {},
  userInfoText: {
    fontSize: 13,
    fontWeight: "500",
    padding: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },
  firstBox: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  lastBox: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
