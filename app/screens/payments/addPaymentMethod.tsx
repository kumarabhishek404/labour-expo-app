import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PaymentScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Card");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Add New Payment Method",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Card" && styles.activeTab]}
            onPress={() => setSelectedTab("Card")}
          >
            <Text
              style={
                selectedTab === "Card" ? styles.activeTabText : styles.tabText
              }
            >
              Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "UPI" && styles.activeTab]}
            onPress={() => setSelectedTab("UPI")}
          >
            <Text
              style={
                selectedTab === "UPI" ? styles.activeTabText : styles.tabText
              }
            >
              UPI
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === "Card" && (
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.buttonText}>SCAN CARD</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Name" />
            <TextInput
              style={styles.input}
              placeholder="Credit Card Number"
              keyboardType="numeric"
            />
            <View style={styles.expiryCvvContainer}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Expires"
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="CVV"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === "UPI" && (
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="UPI ID" />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    // justifyContent: 'center',
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
    borderRadius: 10,
    borderColor: Colors?.primary,
    borderWidth: 2,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors?.primary,
  },
  tabText: {
    color: Colors?.primary,
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  expiryCvvContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInput: {
    width: "48%",
  },
  scanButton: {
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors?.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
