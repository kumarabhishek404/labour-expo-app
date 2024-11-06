import React, { useState } from "react";
import {
  View,
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
import { Stack } from "expo-router";
import { FAQS } from "@/constants";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";

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
          header: () => <CustomHeader title="Contact Support" left="back" />,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Support Contact Info */}
        <View style={styles.contactBox}>
          <Foundation name="telephone" size={52} color={Colors?.primary} />
          <View style={styles.contactTextContainer}>
            <CustomHeading textAlign="left">
              Our 24x7 Customer Service
            </CustomHeading>
            <TouchableOpacity onPress={() => Linking.openURL("tel:6397308499")}>
              <CustomText textAlign="left" fontSize={16} color={Colors?.link}>
                6397308499
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactBox}>
          <MaterialCommunityIcons
            name="email"
            size={40}
            color={Colors?.primary}
          />
          <View style={styles.contactTextContainer}>
            <CustomHeading textAlign="left">Write us at</CustomHeading>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("mailto:fastag.recharge@support.com")
              }
            >
              <CustomText textAlign="left" fontSize={16} color={Colors?.link}>
                ak7192837@gmail.com
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ padding: 20, gap: 10 }}>
          <CustomHeading textAlign="left" fontSize={18}>
            Frequently Asked Questions
          </CustomHeading>

          {FAQS.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleSection(index)}
              >
                <CustomHeading textAlign="left">{item.question}</CustomHeading>
                <Feather
                  name={
                    activeSections.includes(index)
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={22}
                  color="#000"
                />
              </TouchableOpacity>

              <Collapsible collapsed={!activeSections.includes(index)}>
                <View style={styles.faqAnswer}>
                  {item.answer.map((step, idx) => (
                    <CustomText key={idx} textAlign="left">
                      {step}
                    </CustomText>
                  ))}
                </View>
              </Collapsible>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 10,
  },
  headerContainer: {},
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  contactBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    borderRadius: 8,
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
