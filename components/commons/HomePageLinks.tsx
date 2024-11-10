import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import Farmer1 from "../../assets/farmer1.png";
import Farmer2 from "../../assets/farmer2.png";
import Farmer3 from "../../assets/farmer3.png";
import Farmer4 from "../../assets/farmer4.png";
import Farmer5 from "../../assets/farmer5.png";
import Farmer6 from "../../assets/farmer6.png";
import Farmer7 from "../../assets/farmer7.png";
import Farmer8 from "../../assets/farmer8.png";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const HomePageLinks = () => {
  const userDetails = useAtomValue(UserAtom);

  const links = [
    {
      title: userDetails?.role === "EMPLOYER" ? t("workers") : t("services"),
      subtitle: t("mobileFiberAirFiber"),
      path: {
        pathname: "/(tabs)/workers",
        params: { role: "workers", title: t("workers"), type: "all" },
      },
      image: Farmer3,
      style: [styles.largeBox, styles.serviceBox],
      big: true,
    },
    {
      title: userDetails?.role === "MEDIATOR" ? t("workers") : t("mediators"),
      subtitle: t("mobileFiberAirFiber"),
      path: {
        pathname: "/screens/users",
        params: {
          role: userDetails?.role === "MEDIATOR" ? "workers" : "mediators",
          title: userDetails?.role === "MEDIATOR" ? t("workers") : t("mediators"),
          type: "all",
        },
      },
      image: Farmer8,
      style: [styles.largeBox, styles.employerBox],
      big: true,
    },
    {
      title: userDetails?.role === "EMPLOYER" ? t("myServices") : t("myBookings"),
      subtitle: t("groceryFashion"),
      path: "/(tabs)/bookings",
      image: Farmer8,
      style: [styles.smallBox, styles.bookingBox],
    },
    {
      title: t("guidesHelps"),
      subtitle: t("musicTvGames"),
      path: "/screens/helps",
      image: Farmer6,
      style: [styles.smallBox, styles.helpBox],
    },
  ];

  return (
    <View style={styles.linksContainer}>
      <View style={styles.gridContainer}>
        {links.map((link: any, index) => (
          <TouchableOpacity
            key={index}
            style={link.style}
            onPress={() => router.push(link?.path)}
          >
            <View style={styles.textContainer}>
              <CustomHeading textAlign="left" fontSize={12}>
                {link.title}
              </CustomHeading>
              <CustomText textAlign="left" fontSize={10}>
                {link.subtitle}
              </CustomText>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={link.image}
                style={link.big ? styles.largeImage : styles.smallImage}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomePageLinks;

const styles = StyleSheet.create({
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
  },
  largeBox: {
    width: "48%", // Large box takes up 48% of the width
    height: 176,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 0,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 8, // Space between large and below box
  },
  smallBox: {
    width: "48%", // Small boxes take up 48% of the width
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 0,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 8,
  },
  serviceBox: {
    backgroundColor: "#E0F7FA",
  },
  employerBox: {
    backgroundColor: "#FCE4EC",
  },
  mediatorBox: {
    backgroundColor: "#FFF3E0",
  },
  bookingBox: {
    backgroundColor: "#E8F5E9",
  },
  helpBox: {
    backgroundColor: "#FFFDE7",
  },
  textContainer: {
    width: "70%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "flex-start",
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.9,
    zIndex: -1,
  },
  largeImage: {
    width: 115,
    height: 125,
    borderBottomRightRadius: 8,
  },
  smallImage: {
    width: 80,
    height: 90,
    borderBottomRightRadius: 8,
  },
});