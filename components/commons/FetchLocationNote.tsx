import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors"; // Update this to your color constants path
import { useAtomValue } from "jotai";
import { t } from "@/utils/translationHelper";
import { fetchCurrentLocation } from "@/constants/functions";
import Button from "../inputs/Button";
import CustomText from "./CustomText";
import Atoms from "@/app/AtomStore";

const FetchLocationNote = ({ motiveItem }: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const shouldRender =
    !userDetails?.location ||
    !userDetails.location.latitude ||
    !userDetails.location.longitude;

    if (!shouldRender) {
      return null; // Don't render the component
    }

  return (
    <View style={styles.container}>
      <CustomText textAlign="left" style={styles.noteText}>
        {t("fetchLocation", { entity: t(motiveItem).toLowerCase() })}
        {/* {t("pleaseFetchNearestWorkers")} {t(motiveItem)} */}
      </CustomText>
      <Button
        style={styles?.button}
        textStyle={styles?.buttonText}
        isPrimary={true}
        title={t("pleaseFetchCurrentLocation")}
        onPress={fetchCurrentLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  noteText: {
    width: "55%",
    // color: Colors?.darkGrey || "#333",
    // fontSize: 16,
    // textAlign: "center",
    // marginBottom: 10,
  },
  button: {
    width: "40%",
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  buttonText: {
    color: Colors?.white || "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default FetchLocationNote;
