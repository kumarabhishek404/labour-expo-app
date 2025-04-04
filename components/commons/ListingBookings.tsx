import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { getTimeAgo } from "@/constants/functions";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import DateDisplay from "./ShowDate";
import ShowAddress from "./ShowAddress";
import ShowDuration from "./ShowDuration";

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
            {t("direct")}
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
            <ShowAddress address={item?.address} numberOfLines={1} />
            <DateDisplay date={item?.startDate} type="startDate" />
            <ShowDuration duration={item?.duration} />
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
  infoContainer: { gap: 5 },
});
