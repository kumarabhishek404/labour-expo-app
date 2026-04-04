import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { getDistanceFromLocation, handleCall } from "@/constants/functions";
// import { openGoogleMaps } from "@/app/hooks/map";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

const Highlights = ({ service, compact }: { service: any; compact?: boolean }) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const [distance, setDistance] = useState<any>(null);

  useEffect(() => {
    const fetchDistance = async () => {
      const dist = await getDistanceFromLocation(
        service?.geoLocation,
        userDetails?.geoLocation ?? userDetails?.location,
        service?.address,
      );
      setDistance(dist);
    };

    fetchDistance();
  }, [service, userDetails]);

  return (
    <View
      style={[styles?.container, compact && styles.containerCompact]}
    >
      <View style={styles.highlightWrapper}>
        <View style={styles?.highlightBox}>
          <View style={styles.highlightIcon}>
            <Ionicons name="time" size={18} color={Colors.tertieryButton} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText textAlign="left">{t("duration")}</CustomText>
            <CustomHeading textAlign="left">
              {t("lessThanMultipleDays", { duration: service?.duration })}
            </CustomHeading>
          </View>
        </View>
        {service?.address ? (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.highlightIcon}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={18}
                  color={Colors.tertieryButton}
                />
              </View>
              <View style={{ width: "45%" }}>
                <CustomText textAlign="left">{t("distance")}</CustomText>

                {distance !== null && !isNaN(distance) && (
                  <CustomHeading textAlign="left">
                    {`${distance} ${t("kms")}`}
                  </CustomHeading>
                )}
              </View>
            </View>
            {/* <Button
              isPrimary={false}
              title={t("getDirection")}
              onPress={() => {}}
              icon={
                <FontAwesome
                  name="users"
                  size={12}
                  color={Colors.primary}
                  style={{ marginRight: 6 }}
                />
              }
              style={{
                width: "35%",
                marginTop: 6,
                borderWidth: 1.5,
                paddingVertical: 3,
                paddingHorizontal: 5,
              }}
              textStyle={{
                fontWeight: "700",
                fontSize: 12,
              }}
            /> */}
          </View>
        ) : (
          <View>
            <CustomText baseFont={14} color={Colors?.secondary}>
              {t("noLocationFound")}
            </CustomText>
          </View>
        )}
      </View>

      {service?.employer?.mobile ? (
        <View style={[styles?.highlightBox, { width: "100%", marginTop: 20 }]}>
          <View style={styles.highlightIcon}>
            <Ionicons name="call" size={18} color={Colors.tertieryButton} />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <CustomText textAlign="left">{t("mobileNumber")}</CustomText>
              <CustomHeading textAlign="left">
                {service?.employer?.mobile}
              </CustomHeading>
            </View>
            {userDetails?._id !== service?.employer && (
              <Button
                isPrimary={true}
                title={t("callEmployer")}
                onPress={() =>
                  handleCall(service?.employer?.mobile, {
                    source: "service_highlights",
                    serviceId: String(service?._id ?? ""),
                  })
                }
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
                icon={
                  <FontAwesome5
                    name="phone-alt"
                    size={16}
                    color={Colors.white}
                    style={{ marginRight: 10 }}
                  />
                }
              />
            )}
          </View>
        </View>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  containerCompact: {
    marginTop: 4,
  },
  highlightWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  highlightBox: {
    flexDirection: "row",
    width: "48%",
  },
  highlightIcon: {
    backgroundColor: Colors?.white,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  getDirectionText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    textAlign: "left",
  },
});

export default Highlights;
