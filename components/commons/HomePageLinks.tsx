import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import Farmer3 from "../../assets/farmer3.png";
import Farmer6 from "../../assets/farmer6.png";
import Farmer8 from "../../assets/farmer8.png";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const HomePageLinks = () => {
  const userDetails: any = useAtomValue(Atoms?.UserAtom);

  const links = [
    {
      title: t("workers"),
      subtitle: t("aboutWorkers"),
      path: {
        pathname: "/(tabs)/fourth",
        params: {
          role: "workers",
          title: t("workers"),
          type: "all",
        },
      },
      image: Farmer3,
      style: [styles.largeBox, styles.serviceBox],
      big: true,
    },
    {
      title: t("mediators"),
      subtitle: t("aboutMediators"),
      path: {
        pathname: "/screens/users",
        params: {
          role: "mediators",
          title: "mediators",
          type: "all",
        },
      },
      image: Farmer8,
      style: [styles.largeBox, styles.employerBox],
      big: true,
    },
    {
      title: t("myBookings"),
      subtitle: t("aboutMyBookings"),
      path: "/(tabs)/second",
      image: Farmer8,
      style: [styles.smallBox, styles.bookingBox],
    },
    {
      title: t("guidesHelps"),
      subtitle: t("aboutGuidesHelps"),
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
              <CustomHeading textAlign="left" baseFont={16}>
                {link.title}
              </CustomHeading>
              <CustomText textAlign="left" baseFont={12}>
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
    width: "48%",
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
    marginBottom: 8,
  },
  smallBox: {
    width: "48%",
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
