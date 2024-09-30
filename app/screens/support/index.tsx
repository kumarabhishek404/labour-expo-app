import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import Collapsible from "react-native-collapsible";
import {
  Feather,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";

const SupportScreen = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const toggleSection = (section: number) => {
    setActiveSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((sec) => sec !== section)
        : [...prevSections, section]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Contact Support",
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
      <ScrollView style={styles.container}>
        {/* Support Contact Info */}
        <View style={styles.contactBox}>
          <Foundation name="telephone" size={52} color={Colors?.primary} />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactText}>Our 24x7 Customer Service</Text>
            <Text
              style={styles.contactLink}
              onPress={() => Linking.openURL("tel:6397308499")}
            >
              6397308499
            </Text>
          </View>
        </View>

        <View style={styles.contactBox}>
          <MaterialCommunityIcons
            name="email"
            size={40}
            color={Colors?.primary}
          />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactText}>Write us at</Text>
            <Text
              style={styles.contactLink}
              onPress={() =>
                Linking.openURL("mailto:fastag.recharge@support.com")
              }
            >
              ak7192837@gmail.com
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.faqHeader}>Frequently Asked Questions</Text>

        {faqData.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => toggleSection(index)}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Feather
                name={
                  activeSections.includes(index) ? "chevron-up" : "chevron-down"
                }
                size={22}
                color="#000"
              />
            </TouchableOpacity>

            <Collapsible collapsed={!activeSections.includes(index)}>
              <View style={styles.faqAnswer}>
                {item.answer.map((step, idx) => (
                  <Text key={idx} style={styles.answerText}>
                    {step}
                  </Text>
                ))}
              </View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const faqData = [
  {
    question: "How to recharge a fastag?",
    answer: [
      "1. Add new fastag.",
      "2. Go to Fastags.",
      "3. Click on Recharge button, and enter amount.",
      "4. Select payment method and pay.",
    ],
  },
  {
    question: "Can I recharge fastags from different provider?",
    answer: [
      "Yes, you can recharge fastags from different providers using the app.",
    ],
  },
  {
    question: "Recharge failed but amount deducted from account?",
    answer: [
      "Please contact our support team, and we will assist you in resolving the issue.",
    ],
  },
  {
    question: "How to add credit or debit card for easy recharge?",
    answer: [
      "You can add your card details under the Payments section for easy recharges.",
    ],
  },
  {
    question: "Can I see tolls paid before I started using the app?",
    answer: [
      "Unfortunately, tolls paid before using the app cannot be viewed.",
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 10,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  contactBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  contactTextContainer: {
    marginLeft: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#000",
  },
  contactLink: {
    fontSize: 16,
    color: "#0056D2",
    marginTop: 5,
  },
  faqHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqQuestion: {
    fontSize: 16,
    color: "#000",
  },
  faqAnswer: {
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  answerText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
});

export default SupportScreen;
