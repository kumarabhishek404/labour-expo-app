import { StyleSheet, View } from "react-native";
import React from "react";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

interface UserInfoComponentProps {
  user: any;
  style?: any;
}

const UserInfoComponent = ({ user, style }: UserInfoComponentProps) => {
  return (
    <View style={[styles.userInfoTextWrapper, style]}>
      <View>
        <View
          style={[styles.row, user?.role === "EMPLOYER" && styles.firstBox]}
        >
          <CustomHeading fontSize={14} padding={12}>
            <CustomText>Address</CustomText>
            {"  "}
            {user?.address || "Address not found"}
          </CustomHeading>
        </View>
        <View style={styles.row}>
          <CustomHeading fontSize={14} padding={12}>
            <CustomText>Mobile Number</CustomText>
            {"  "}
            {user?.mobileNumber ||
              user?.alternateMobileNumber ||
              "Mobile not found"}
          </CustomHeading>
        </View>
        <View style={[styles.row, styles.lastBox]}>
          <CustomHeading fontSize={14} padding={12}>
            <CustomText>Email Address</CustomText>
            {"  "}
            {user?.email}, {user?.alternateEmail}
          </CustomHeading>
        </View>
      </View>
    </View>
  );
};

export default UserInfoComponent;

const styles = StyleSheet.create({
  row: {
    paddingTop: 0,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#ddd",
  },
  userInfoTextWrapper: {
    marginBottom: 25,
    marginHorizontal: 20,
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
