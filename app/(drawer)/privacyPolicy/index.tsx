import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { Stack } from "expo-router";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Privacy Policy" left="menu" right="notification" />,
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.contentBox}>
            <CustomText fontSize={14}>
              Our human-friendly Terms of Service for the Tribevibe platform
              prevails over the detailed one, which specifies all rights and
              obligations for both you and Tribevibe in more complex legalese.
            </CustomText>
            <CustomText fontSize={14}>
              In the event of a contradiction between the two documents, the
              “human-friendly” Terms of Service shall prevail. That means no
              nasty surprises if you read only the human-friendly version.
            </CustomText>
            <CustomText textAlign="left" style={{ marginTop: 20 }}>
              Last updated: June 24, 2020
            </CustomText>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  contentBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    gap: 5,
  },
});
