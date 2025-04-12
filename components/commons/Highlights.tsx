import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { calculateDistance, dateDifference } from "@/constants/functions";
// import { openGoogleMaps } from "@/app/hooks/map";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

const destination = {
  latitude: 40.758896,
  longitude: -73.98513,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Highlights = ({ service }: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  return (
    <View style={styles?.container}>
      <View style={styles.highlightWrapper}>
        <View style={styles?.highlightBox}>
          <View style={styles.highlightIcon}>
            <Ionicons name="time" size={18} color={Colors.tertieryButton} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText textAlign="left">{t("duration")}</CustomText>
            <CustomHeading textAlign="left">
              {service?.duration} {service?.duration > 1 ? t("days") : t("day")}
            </CustomHeading>
          </View>
        </View>
        {service?.location && service?.location?.latitude ? (
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
                <CustomHeading textAlign="left">
                  {`${calculateDistance(
                    service?.location,
                    userDetails?.location
                  )} ${t("kms")}`}
                </CustomHeading>
              </View>
            </View>
            <Button
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
            />
          </View>
        ) : (
          <View>
            <CustomText baseFont={14} color={Colors?.secondary}>
              {t("noLocationFound")}
            </CustomText>
          </View>
        )}
      </View>

      <View style={styles?.facilitiesHeading}>
        <CustomHeading
          textAlign="left"
          baseFont={20}
          color={Colors?.black}
        >
          {t("facilitiesProvidedByEmployer")}
        </CustomHeading>
        <MaterialCommunityIcons
          name="hand-pointing-down"
          size={18}
          color={Colors.black}
        />
      </View>

      <View style={styles?.facilitiesContainer}>
        <View style={styles.highlightWrapper}>
          <View style={styles?.highlightBox}>
            <View style={styles.highlightIcon}>
              <MaterialCommunityIcons
                name="food-apple"
                size={20}
                color={Colors.tertieryButton}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomText textAlign="left">{t("food")}</CustomText>
              <CustomHeading textAlign="left">
                {service?.facilities?.food ? t("yes") : t("no")}
              </CustomHeading>
            </View>
          </View>

          <View style={styles?.highlightBox}>
            <View style={styles.highlightIcon}>
              <Ionicons name="home" size={20} color={Colors.tertieryButton} />
            </View>
            <View style={{ flex: 1 }}>
              <CustomText textAlign="left">{t("living")}</CustomText>
              <CustomHeading textAlign="left">
                {service?.facilities?.living ? t("yes") : t("no")}
              </CustomHeading>
            </View>
          </View>
        </View>

        <View style={styles.highlightWrapper}>
          <View style={styles?.highlightBox}>
            <View style={styles.highlightIcon}>
              <FontAwesome5
                name="shuttle-van"
                size={16}
                color={Colors.tertieryButton}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomText textAlign="left">{t("travelling")}</CustomText>
              <CustomHeading textAlign="left">
                {service?.facilities?.travelling ? t("yes") : t("no")}
              </CustomHeading>
            </View>
          </View>
          <View style={styles?.highlightBox}>
            <View style={styles.highlightIcon}>
              <FontAwesome5
                name="coins"
                size={18}
                color={Colors.tertieryButton}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomText textAlign="left">{t("esi_pf")}</CustomText>
              <CustomHeading textAlign="left">
                {service?.facilities?.esi_pf ? t("yes") : t("no")}
              </CustomHeading>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
  facilitiesContainer: {
    borderWidth: 0.5,
    borderColor: Colors?.disabled,
    backgroundColor: Colors?.fourth,
    borderRadius: 8,
    gap: 10,
    padding: 10,
    elevation: 1,
  },
  facilitiesHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
    gap: 5,
  },
});

export default Highlights;
