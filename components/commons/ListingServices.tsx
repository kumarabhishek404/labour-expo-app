import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome5, Fontisto, Ionicons } from "@expo/vector-icons";
import { Link, router, useNavigation } from "expo-router";
import { getServiceListHeroIcon } from "@/utils/serviceListHeroIcon";
import {
  generateServiceSummary,
  getTimeAgo,
  speakText,
} from "@/constants/functions";
import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";
import Requirements from "./Requirements";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import DateDisplay from "./ShowDate";
import ShowAddress from "./ShowAddress";
import ShowDistance from "./ShowDistance";
import ShowDuration from "./ShowDuration";
import ShowFacilities from "./ShowFacilities";
import { getServiceJobId } from "@/utils/serviceJobId";

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
    item?.selectedUsers?.filter(
      (user: any) =>
        user?.status === "SELECTED" || user?.status === "SERVICE_COMPLETED",
    )?.length || 0;

  const isSelected = item?.selectedUsers?.some(
    (selectedUser: any) =>
      (selectedUser?.status === "SELECTED" &&
        selectedUser?.user === userDetails?._id) ||
      (Array.isArray(selectedUser?.workers) &&
        selectedUser?.workers.some(
          (worker: any) =>
            worker?.worker === userDetails?._id &&
            worker?.status === "SELECTED",
        )),
  );

  const handleSpeakAboutSerivceDetails = () => {
    const textToSpeak = generateServiceSummary(
      item,
      locale?.language,
      userDetails?.location,
    );
    speakText(textToSpeak, locale?.language, setIsSpeaking);
  };

  const handleCloseSpeakers = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const hasHeroPhoto =
    Array.isArray(item?.images) &&
    item.images.length > 0 &&
    Boolean(item.images[0]);
  const heroIcon = getServiceListHeroIcon(item?.type, item?.subType);

  const goToServiceDetails = () => {
    if (!item?._id) return;
    router?.push({
      pathname: "/screens/service/[id]",
      params: {
        id: item._id,
        title: "titleMyAllServicesAndBookings",
        type: "myServices",
        showApplicationDetails: JSON.stringify(true),
      },
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.accentBar} />
          <TouchableOpacity
            activeOpacity={0.92}
            accessibilityRole="button"
            accessibilityLabel={t("viewDetails")}
            onPress={goToServiceDetails}
            style={styles.cardPressable}
          >
            <View style={styles.heroWrap}>
              {hasHeroPhoto ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.heroImage}
                />
              ) : (
                <View
                  style={styles.heroIconFallback}
                  accessibilityLabel={t("service")}
                >
                  {heroIcon.family === "fa5" ? (
                    <FontAwesome5
                      name={heroIcon.name}
                      size={heroIcon.size ?? 64}
                      color={Colors.primary}
                    />
                  ) : (
                    <Ionicons
                      name={heroIcon.name}
                      size={heroIcon.size ?? 72}
                      color={Colors.primary}
                    />
                  )}
                </View>
              )}
              {getServiceJobId(item) ? (
                <View style={styles.jobIdBadgeOnHero} pointerEvents="none">
                  <CustomText
                    color={Colors.white}
                    fontWeight="800"
                    baseFont={11}
                    textAlign="left"
                    numberOfLines={1}
                  >
                    {getServiceJobId(item)}
                  </CustomText>
                </View>
              ) : null}
              {item?.bookingType === "direct" && (
                <View style={styles.directTagOnHero}>
                  <CustomText
                    color={Colors?.white}
                    fontWeight="800"
                    baseFont={12}
                  >
                    {t("direct")}
                  </CustomText>
                </View>
              )}

              {userDetails?._id === item?.employer &&
                item?.bookingType === "byService" && (
                  <View
                    style={[
                      styles.applicants,
                      styles.applicantsOnHero,
                      { backgroundColor: Colors?.white, gap: 20 },
                    ]}
                  >
                    <View style={styles?.proposalsItem}>
                      <Fontisto
                        name="persons"
                        size={18}
                        color={Colors.primary}
                      />
                      <View style={styles?.proposalsItemText}>
                        <CustomHeading color={Colors?.primary}>
                          {proposals}
                        </CustomHeading>
                        <CustomHeading color={Colors?.primary}>
                          {t("proposals")}
                        </CustomHeading>
                      </View>
                    </View>

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
                        name="select"
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
                    styles.applicantsOnHero,
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
                  <View style={[styles.applicants, styles.applicantsOnHero]}>
                    <Fontisto name="persons" size={18} color={Colors.white} />
                    <CustomHeading color={Colors?.white}>
                      {proposals}
                    </CustomHeading>
                    <CustomHeading color={Colors?.white}>
                      {t("proposals")}
                    </CustomHeading>
                  </View>
                )}
            </View>

            <View style={styles.titleBlock}>
              {item?.subType ? (
                <CustomHeading textAlign="left" style={styles.title}>
                  {t(item?.subType || "unknown")}
                </CustomHeading>
              ) : (
                <CustomHeading textAlign="left" style={styles.title}>
                  {t("service")}
                </CustomHeading>
              )}
            </View>

            <Requirements type="highlights" requirements={item?.requirements} />
            <View style={styles.infoBlock}>
              <View style={styles.addressTimeRow}>
                <View style={styles.addressCol}>
                  <ShowAddress address={item?.address} numberOfLines={2} />
                </View>
                <CustomText
                  textAlign="right"
                  baseFont={13}
                  fontWeight="700"
                  color={Colors.primary}
                  style={styles.timeAgo}
                >
                  {getTimeAgo(item?.createdAt)}
                </CustomText>
              </View>
              <DateDisplay date={item?.startDate} type="startDate" />
              <View style={styles.actionContainer}>
                <ShowDuration duration={item?.duration} alignment="left" />
                <ShowDistance
                  address={item?.address}
                  loggedInUserLocation={
                    userDetails?.geoLocation ?? userDetails?.location
                  }
                  targetLocation={item?.geoLocation}
                />
              </View>
            </View>
            <ShowFacilities facilities={item?.facilities} />
          </TouchableOpacity>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={
                isSpeaking
                  ? handleCloseSpeakers
                  : handleSpeakAboutSerivceDetails
              }
              style={[
                styles.ctaButton,
                {
                  backgroundColor: isSpeaking ? Colors?.danger : Colors.primary,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                isSpeaking ? t("speakingAndClose") : t("listenAboutService")
              }
            >
              <CustomText color={Colors?.white} fontWeight="800" baseFont={14}>
                {isSpeaking
                  ? `⏹ ${t("speakingAndClose")}`
                  : `🔊 ${t("listenAboutService")}`}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={goToServiceDetails}
              style={styles.ctaHint}
              accessibilityRole="button"
              accessibilityLabel={t("viewDetails")}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={Colors.primary}
              />
              <CustomText color={Colors.primary} fontWeight="800" baseFont={14}>
                {t("viewDetails")}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ListingsServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    position: "relative",
  },
  cardPressable: {
    width: "100%",
  },
  item: {
    backgroundColor: Colors.white,
    padding: 12,
    paddingBottom: 10,
    borderRadius: 12,
    width: "100%",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    // backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heroWrap: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.secondaryBackground,
    position: "relative",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.12)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroIconFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondaryBackground,
  },
  jobIdBadgeOnHero: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 3,
    maxWidth: "78%",
    backgroundColor: "rgba(34, 64, 154, 0.92)",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  directTagOnHero: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  titleBlock: {
    marginTop: 12,
    gap: 8,
  },
  title: {
    textTransform: "capitalize",
    marginRight: 10,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pillSoft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.16)",
  },
  applicants: {
    position: "absolute",
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
  applicantsOnHero: {
    top: 138,
    right: 5,
    zIndex: 2,
    maxWidth: "92%",
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
  infoBlock: {
    marginTop: 10,
    gap: 8,
  },
  addressTimeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  addressCol: {
    flex: 1,
    minWidth: 0,
  },
  timeAgo: {
    flexShrink: 0,
    maxWidth: "38%",
  },
  ctaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  ctaButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  ctaHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    minHeight: 48,
    backgroundColor: "rgba(34, 64, 154, 0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.18)",
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
