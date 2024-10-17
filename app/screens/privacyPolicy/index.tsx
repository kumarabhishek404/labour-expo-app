import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const PrivacyPolicyScreen = () => {
  const [selectedTab, setSelectedTab] = useState("human");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Privacy Policy",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View> */}

        {/* Tab Navigation */}
        {/* <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "human" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("human")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "human" && styles.activeTabText,
            ]}
          >
            HUMAN-FRIENDLY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "legal" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("legal")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "legal" && styles.activeTabText,
            ]}
          >
            LEGAL MUMBO-JUMBO
          </Text>
        </TouchableOpacity>
      </View> */}

        {/* Content */}
        <ScrollView style={styles.contentContainer}>
          {selectedTab === "human" ? (
            <View style={styles.contentBox}>
              <Text style={styles.paragraph}>
                Our human-friendly Terms of Service for the Tribevibe platform
                prevails over the detailed one, which specifies all rights and
                obligations for both you and Tribevibe in more complex legalese.
              </Text>
              <Text style={styles.paragraph}>
                In the event of a contradiction between the two documents, the
                “human-friendly” Terms of Service shall prevail. That means no
                nasty surprises if you read only the human-friendly version.
              </Text>
              <Text style={styles.lastUpdated}>
                Last updated: June 24, 2020
              </Text>
            </View>
          ) : (
            <View style={styles.contentBox}>
              <Text style={styles.paragraph}>
                [Insert Legal Mumbo-Jumbo content here]
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f9", // Light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#004d47", // Active tab color (dark green)
  },
  tabText: {
    fontSize: 14,
    color: "#7a7a7a", // Gray text color for inactive
  },
  activeTabText: {
    color: "#fff", // White text color for active
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
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    lineHeight: 24,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#7a7a7a",
    marginTop: 20,
  },
});
