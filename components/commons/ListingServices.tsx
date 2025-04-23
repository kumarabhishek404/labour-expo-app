import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import { Link, router, useNavigation } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import {
  generateServiceSummary,
  getTimeAgo,
  speakText,
} from "@/constants/functions";
import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";
import moment, { locale } from "moment";
import Requirements from "./Requirements";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import ScrollingText from "./ScrollingText";
import DateDisplay from "./ShowDate";
import ShowAddress from "./ShowAddress";
import ShowDistance from "./ShowDistance";
import ShowDuration from "./ShowDuration";
import ShowFacilities from "./ShowFacilities";

const ListingsServices = ({ item }: any) => {
  const navigation = useNavigation();
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      try {
        Speech.stop();
      } catch (e) {
        console.warn("Speech error:", e);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const proposals =
    item?.appliedUsers?.filter((user: any) => user?.status === "PENDING")
      ?.length || 0;

  const selectedWorkers =
    item?.selectedUsers?.filter((user: any) => user?.status === "SELECTED")
      ?.length || 0;

  const isSelected = item?.selectedUsers?.some(
    (selectedUser: any) =>
      (selectedUser?.status === "SELECTED" &&
        selectedUser?.user === userDetails?._id) ||
      (Array.isArray(selectedUser?.workers) &&
        selectedUser?.workers.some(
          (worker: any) =>
            worker?.worker === userDetails?._id && worker?.status === "SELECTED"
        ))
  );

  const handleSpeakAboutSerivceDetails = () => {
    const textToSpeak = generateServiceSummary(
      item,
      locale?.language,
      userDetails?.location
    );
    speakText(textToSpeak, locale?.language, setIsSpeaking);
  };

  const handleCloseSpeakers = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={
            isSpeaking ? handleCloseSpeakers : handleSpeakAboutSerivceDetails
          }
          style={[
            styles?.leftTag,
            { backgroundColor: isSpeaking ? Colors?.danger : Colors?.success },
          ]}
        >
          <CustomText color={Colors?.white} fontWeight="bold">
            📢 {isSpeaking ? t("speakingAndClose") : t("listenAboutService")}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (item._id)
              router?.push({
                pathname: "/screens/service/[id]",
                params: {
                  id: item._id,
                  title: "titleMyAllServicesAndBookings",
                  type: "myServices",
                  showApplicationDetails: JSON.stringify(true),
                },
              });
          }}
        >
          {item?.bookingType === "direct" && (
            <View
              style={[styles?.tag, { backgroundColor: Colors?.tertieryButton }]}
            >
              <CustomText color={Colors?.white} fontWeight="bold">
                {t("direct")}
              </CustomText>
            </View>
          )}

          <View style={styles.item}>
            <Image
              source={
                item?.images?.length > 0 ? { uri: item?.images[0] } : coverImage
              }
              style={styles.image}
            />

            {userDetails?._id === item?.employer &&
              item?.bookingType === "byService" && (
                <View
                  style={[
                    styles.applicants,
                    { backgroundColor: Colors?.white, gap: 20 },
                  ]}
                >
                  <View style={styles?.proposalsItem}>
                    <Ionicons
                      name="happy"
                      size={20}
                      color={Colors.tertieryButton}
                    />
                    <View style={styles?.proposalsItemText}>
                      <CustomHeading color={Colors?.tertieryButton}>
                        {selectedWorkers}
                      </CustomHeading>
                      <CustomHeading color={Colors?.tertieryButton}>
                        {t("selected")}
                      </CustomHeading>
                    </View>
                  </View>

                  <View style={styles?.proposalsItem}>
                    <Fontisto name="persons" size={18} color={Colors.primary} />
                    <View style={styles?.proposalsItemText}>
                      <CustomHeading color={Colors?.primary}>
                        {proposals}
                      </CustomHeading>
                      <CustomHeading color={Colors?.primary}>
                        {t("proposals")}
                      </CustomHeading>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router?.push({
                        pathname: "/screens/service/[id]",
                        params: {
                          id: item._id,
                          title: "titleMyAllServicesAndBookings",
                          type: "myServices",
                          showApplicationDetails: JSON.stringify(true),
                        },
                      })
                    }
                  >
                    <AntDesign
                      name="select1"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

            {userDetails?._id !== item?.employer && isSelected && (
              <View
                style={[
                  styles.applicants,
                  { backgroundColor: Colors?.tertiery },
                ]}
              >
                <Ionicons name="happy" size={20} color={Colors.white} />
                <CustomHeading color={Colors?.white}>
                  {t("youAreSelected")}
                </CustomHeading>
              </View>
            )}

            {userDetails?._id !== item?.employer &&
              !isSelected &&
              proposals > 0 && (
                <View style={styles.applicants}>
                  <Fontisto name="persons" size={18} color={Colors.white} />
                  <CustomHeading color={Colors?.white}>
                    {proposals}
                  </CustomHeading>
                  <CustomHeading color={Colors?.white}>
                    {t("proposals")}
                  </CustomHeading>
                </View>
              )}

            <Requirements type="highlights" requirements={item?.requirements} />

            {item?.subType && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CustomHeading
                  textAlign="left"
                  style={{ textTransform: "capitalize", marginRight: 10 }}
                >
                  {t(item?.subType || "unknown")}
                </CustomHeading>
              </View>
            )}
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <ShowAddress address={item?.address} numberOfLines={1} />
                  <DateDisplay date={item?.startDate} type="startDate" />
                </View>
                <CustomText textAlign="right" style={{ flex: 1 }}>
                  {getTimeAgo(item?.createdAt)}
                </CustomText>
              </View>

              <View style={styles?.actionContainer}>
                <ShowDuration duration={item?.duration} alignment="left" />
                <ShowDistance
                  loggedInUserLocation={userDetails?.location}
                  targetLocation={item?.location}
                />
              </View>
            </View>
            <ShowFacilities facilities={item?.facilities} />
          </View>
        </TouchableOpacity>
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
  leftTag: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: Colors?.tertiery,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
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
    top: 155,
    right: 5,
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
  proposalsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  proposalsItemText: {
    flexDirection: "row",
    gap: 5,
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
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
