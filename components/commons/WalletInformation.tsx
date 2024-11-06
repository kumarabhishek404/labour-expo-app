import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

interface WallletInformationProps {
  type: string;
  wallet: any;
  style?: any;
}

const WallletInformation = ({
  type,
  wallet,
  style,
}: WallletInformationProps) => {
  return (
    <View style={styles?.container}>
      {type === "spents" ? (
        <>
          <CustomHeading textAlign="left" style={[style]}>
            Wallet
          </CustomHeading>
          <View style={styles.infoBoxWrapper}>
            <View
              style={[
                styles.infoBox,
                {
                  borderRightColor: "#dddddd",
                  borderRightWidth: 1,
                },
              ]}
            >
              <CustomHeading fontSize={20}>
                ₹ {wallet?.spents?.work}
              </CustomHeading>
              <CustomText fontSize={14}>Spents</CustomText>
            </View>
            <View style={styles.infoBox}>
              <CustomHeading fontSize={20}>
                ₹ {wallet?.spents?.tip}
              </CustomHeading>
              <CustomText fontSize={14}>Tip</CustomText>
            </View>
          </View>
        </>
      ) : (
        <>
          <CustomHeading textAlign="left" style={[style]}>
            Wallet
          </CustomHeading>
          <View style={styles.infoBoxWrapper}>
            <View
              style={[
                styles.infoBox,
                {
                  borderRightColor: "#dddddd",
                  borderRightWidth: 1,
                },
              ]}
            >
              <CustomHeading fontSize={20}>
                ₹ {wallet?.earnings?.work}
              </CustomHeading>
              <CustomText fontSize={14}>Earnings</CustomText>
            </View>
            <View style={styles.infoBox}>
              <CustomHeading fontSize={20}>
                ₹ {wallet?.earnings?.rewards}
              </CustomHeading>
              <CustomText fontSize={14}>Rewards</CustomText>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default WallletInformation;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  workInfoHeading: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  infoBoxWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});
