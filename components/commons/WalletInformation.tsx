import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
          <Text style={[styles.workInfoHeading, style]}>Wallet</Text>
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
              <Text>₹ {wallet?.spents?.work}</Text>
              <Text>Spents</Text>
            </View>
            <View style={styles.infoBox}>
              <Text>₹ {wallet?.spents?.tip}</Text>
              <Text>Tip</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.workInfoHeading, style]}>Wallet</Text>
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
              <Text>₹ {wallet?.earnings?.work}</Text>
              <Text>Earnings</Text>
            </View>
            <View style={styles.infoBox}>
              <Text>₹ {wallet?.earnings?.rewards}</Text>
              <Text>Rewards</Text>
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
