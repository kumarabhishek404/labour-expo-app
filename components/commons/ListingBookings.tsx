import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome5, Fontisto, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import {
  calculateDistance,
  dateDifference,
  getTimeAgo,
} from "@/constants/functions";
import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";
import moment from "moment";
import Requirements from "./Requirements";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import DateDisplay from "./ShowDate";

const ListingsBookings = ({ title, item, category }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/bookings/[id]",
            params: {
              id: item?._id,
              title: title,
              data: JSON.stringify(item),
              category: category,
            },
          })
        }
      >
        <View
          style={[styles?.tag, { backgroundColor: Colors?.tertieryButton }]}
        >
          <CustomText color={Colors?.white} fontWeight="bold">
            {t('direct')}
          </CustomText>
        </View>
        <View style={styles.card}>
          <CustomText
            textAlign="left"
            fontWeight="600"
            style={{ marginBottom: 5 }}
          >
            {getTimeAgo(item?.createdAt)}
          </CustomText>
          <View style={styles.infoContainer}>
            <View style={{ width: "76%" }}>
              <CustomHeading
                color={Colors?.primary}
                textAlign="left"
                baseFont={20}
              >
                {t(item?.type)} - {t(item?.subType)}
              </CustomHeading>
            </View>
            <CustomText textAlign="left" baseFont={17} fontWeight="bold">
              📍 {item?.address}
            </CustomText>
            <DateDisplay date={item?.startDate} />
            <CustomText textAlign="left">
              ⏳ Duration:{" "}
              <CustomText baseFont={17} fontWeight="bold">
                {item?.duration} days
              </CustomText>
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListingsBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    position: "relative",
  },
  tag: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors?.tertiery,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
  },
  card: { backgroundColor: Colors.white, padding: 10, borderRadius: 8 },
  statusText: { color: Colors.white, fontWeight: "bold" },
  infoContainer: { marginBottom: 10 },
});
