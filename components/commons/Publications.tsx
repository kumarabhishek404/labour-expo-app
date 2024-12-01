import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const PublicationsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <CustomHeading>{t('publications')}</CustomHeading>

      <View style={styles.divider}></View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Image
            source={{
              uri: "https://miller.bslthemes.com/ashley-demo/img/blog/1.jpg",
            }} // Replace with the first image URL
            style={styles.image}
          />
          <View style={{ paddingHorizontal: 6, paddingBottom: 6 }}>
            <CustomText
              color={Colors?.secondaryText}
              fontWeight="bold"
              textAlign="left"
            >
              TECHNOLOGY MAY 24 2023
            </CustomText>
            <CustomHeading textAlign="left" lineHeight={0}>
              How to Become a Graphic Designer in 10 Simple Steps
            </CustomHeading>
            <CustomText textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eius...
            </CustomText>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri: "https://miller.bslthemes.com/ashley-demo/img/blog/1.jpg",
            }} // Replace with the first image URL
            style={styles.image}
          />
          <View style={{ paddingHorizontal: 6, paddingBottom: 6 }}>
            <CustomText
              color={Colors?.secondaryText}
              fontWeight="bold"
              textAlign="left"
            >
              TECHNOLOGY JULY 24 2024
            </CustomText>
            <CustomHeading textAlign="left" lineHeight={0}>
              16 Best Graphic Design Online and Offline Courses
            </CustomHeading>
            <CustomText textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eius
              sequi...
            </CustomText>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.viewAll}>
        <CustomText fontWeight="bold">VIEW ALL</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  divider: {
    alignSelf: "center",
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: 120,
  },
  viewAll: {
    alignSelf: "flex-end",
  },
});

export default PublicationsScreen;
