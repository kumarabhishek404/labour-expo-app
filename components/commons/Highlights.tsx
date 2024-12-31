import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { dateDifference } from "@/constants/functions";
import { openGoogleMaps } from "@/app/hooks/map";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";

const destination = {
  latitude: 40.758896,
  longitude: -73.98513,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Highlights = ({ service }: any) => {
  return (
    <View style={styles?.container}>
      <View style={styles.highlightWrapper}>
        <View style={styles?.highlightBox}>
          <View style={styles.highlightIcon}>
            <Ionicons name="time" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText textAlign="left">{t("duration")}</CustomText>
            <CustomHeading textAlign="left">
              {service?.duration ||
                dateDifference(service?.startDate, service?.endDate)}
            </CustomHeading>
          </View>
        </View>

        <View style={styles?.highlightBox}>
          <View style={styles.highlightIcon}>
            <FontAwesome name="users" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomText textAlign="left">{t("travelling")}</CustomText>
            <CustomHeading textAlign="left">Yes</CustomHeading>
          </View>
        </View>   
      </View>

      <View style={[styles.highlightWrapper, {}]}>
        {service?.location && service?.location?.latitude && (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.highlightIcon}>
                <FontAwesome5
                  name="rupee-sign"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomText textAlign="left">{t("distance")}</CustomText>
                <CustomHeading textAlign="left">Just 2 Kms</CustomHeading>
              </View>
            </View>
            <Button
              isPrimary={false}
              title="Get Direction"
              onPress={() => openGoogleMaps(destination)}
              icon={
                <FontAwesome
                  name="users"
                  size={12}
                  color={Colors.primary}
                  style={{ marginRight: 6 }}
                />
              }
              style={{
                width: 150,
                marginTop: 6,
                borderWidth: 1.5,
                paddingVertical: 3,
                paddingHorizontal: 6,
              }}
              textStyle={{
                fontWeight: "700",
                fontSize: 12,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  highlightWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  highlightBox: {
    flexDirection: "row",
    width: "48%",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
    height: 30,
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
