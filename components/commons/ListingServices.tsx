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

const ListingsServices = ({ item }: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  return (
    <>
      <View style={styles.container}>
        <Link href={`/screens/service/${item._id}`} asChild>
          <TouchableOpacity>
            <View style={[styles?.tag, { backgroundColor: Colors?.primary }]}>
              <CustomText color={Colors?.white} fontWeight="bold">
                Service Post
              </CustomText>
            </View>
            <View style={styles.item}>
              <Image
                source={
                  item?.images?.length > 0
                    ? { uri: item?.images[0] }
                    : coverImage
                }
                style={styles.image}
              />
              {item?.selectedUsers &&
                item?.selectedUsers?.includes(userDetails?._id) && (
                  <View
                    style={[
                      styles.applicants,
                      { backgroundColor: Colors?.tertiery },
                    ]}
                  >
                    <Ionicons name="happy" size={20} color={Colors.white} />
                    <CustomHeading color={Colors?.white}>
                      {t("selected")}
                    </CustomHeading>
                  </View>
                )}

              {item?.appliedUsers && item?.appliedUsers?.length > 0 && (
                <View style={styles.applicants}>
                  <Fontisto name="persons" size={18} color={Colors.white} />
                  <CustomHeading color={Colors?.white}>
                    {item?.appliedUsers?.length}
                  </CustomHeading>
                  <CustomHeading color={Colors?.white}>
                    {t("proposals")}
                  </CustomHeading>
                </View>
              )}

              <Requirements
                type="highlights"
                requirements={item?.requirements}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "75%", flexDirection: "column" }}>
                  <CustomHeading
                    textAlign="left"
                    style={{ textTransform: "capitalize", marginRight: 10 }}
                    baseFont={20}
                  >
                    {t(item?.type)} - {t(item?.subType)}
                  </CustomHeading>
                </View>
                <CustomText textAlign="right" style={{ width: "25%" }}>
                  {getTimeAgo(item?.createdAt)}
                </CustomText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "75%",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    <FontAwesome5
                      name="map-marker-alt"
                      size={16}
                      color={Colors.primary}
                    />
                    <CustomText
                      baseFont={16}
                      textAlign="left"
                      style={{ marginLeft: 5, marginRight: 10 }}
                    >
                      {item?.address}
                    </CustomText>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Entypo name="calendar" size={16} color={Colors.primary} />
                    <CustomText
                      baseFont={16}
                      textAlign="left"
                      style={{ marginLeft: 5 }}
                    >
                      {moment(item?.startDate, "YYYY-MM-DD")?.format(
                        "Do MMMM YYYY"
                      )}
                    </CustomText>
                  </View>
                </View>

                <View style={styles?.actionContainer}>
                  <CustomText textAlign="right">
                    {t("duration")}{" "}
                    {item?.duration ||
                      dateDifference(item?.startDate, item?.endDate)}{" "}
                    days
                  </CustomText>

                  {item?.location &&
                    item?.location?.latitude &&
                    userDetails?.location &&
                    !isNaN(
                      calculateDistance(item?.location, userDetails?.location)
                    ) && (
                      <CustomHeading>
                        {calculateDistance(
                          item?.location,
                          userDetails?.location
                        )}{" "}
                        Kms
                      </CustomHeading>
                    )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

export default ListingsServices;

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
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  applicants: {
    position: "absolute",
    top: 173,
    right: 0,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  applicantsValue: {
    color: Colors?.white,
    fontSize: 20,
    fontWeight: "600",
  },
  itemTxt: {
    width: "100%",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    // marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 100,
    padding: 2,
    // marginVertical: 10,
    borderRadius: 30,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#d6ecdd",
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  itemDistanceAway: {
    // flex: 1,
    // width: 80,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  actionContainer: {
    width: "25%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteText: {
    color: Colors?.white,
    textAlign: "center",
    fontWeight: "600",
  },
});
