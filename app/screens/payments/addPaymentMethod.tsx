import CustomHeader from "@/components/commons/Header";
import Button from "@/components/inputs/Button";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

const PaymentScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Card");

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="Add New Payment Method" left="back" />
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Button
            isPrimary={selectedTab === "Card" ? true : false}
            title="Card"
            onPress={() => setSelectedTab("Card")}
            style={{ width: "48%" }}
          />
          <Button
            isPrimary={selectedTab === "UPI" ? true : false}
            title="UPI"
            onPress={() => setSelectedTab("UPI")}
            style={{ width: "48%" }}
          />
        </View>

        {selectedTab === "Card" && (
          <View style={styles.formContainer}>
            <Button isPrimary={true} title="SCAN CARD" onPress={() => {}} />

            <TextInputComponent
              value=""
              placeholder="Name"
              onChangeText={() => {}}
              label=""
              name="village"
            />
            <TextInputComponent
              value=""
              placeholder="Credit Card Number"
              onChangeText={() => {}}
              label=""
              name="creditCardNumber"
              type="numeric"
            />
            <View style={styles.expiryCvvContainer}>
              <TextInputComponent
                value=""
                style={styles.smallInput}
                placeholder="Expires"
                onChangeText={() => {}}
                label=""
                name="expires"
                type="date"
              />
              <TextInputComponent
                value=""
                style={styles.smallInput}
                placeholder="CVV"
                type="numeric"
                onChangeText={() => {}}
                label=""
                name="expires"
              />
            </View>
            <Button isPrimary={true} title="SAVE" onPress={() => {}} />
          </View>
        )}

        {selectedTab === "UPI" && (
          <View style={styles.formContainer}>
            <TextInputComponent
              value=""
              placeholder="UPI ID"
              onChangeText={() => {}}
              label=""
              name="village"
            />
            <Button isPrimary={true} title="SAVE" onPress={() => {}} />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  tab: {
    width: "48%",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: Colors?.primary,
    borderWidth: 2,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors?.primary,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    gap: 10,
  },
  expiryCvvContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInput: {
    width: "48%",
  },
});

export default PaymentScreen;
