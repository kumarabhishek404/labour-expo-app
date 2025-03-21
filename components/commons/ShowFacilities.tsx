import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";
import { StyleSheet, View } from "react-native";
import ScrollingText from "./ScrollingText";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ShowFacilitiesProps {
  facilities: { [key: string]: boolean };
}

const ShowFacilities: React.FC<ShowFacilitiesProps> = ({ facilities }) => {
  return (
    <>
      {facilities && Object.values(facilities).some(Boolean) && (
        <View style={styles?.facilitiesHeading}>
          <ScrollingText
            text={t("facilitiesOf", {
              facilities: (() => {
                const filteredFacilities = ["food", "living", "travelling"]
                  .filter((facility: string) => facilities[facility])
                  .map((facility) => t(facility));

                return filteredFacilities.length > 1
                  ? filteredFacilities.slice(0, -1).join(", ") +
                      " " +
                      t("and") +
                      " " +
                      filteredFacilities.slice(-1)
                  : filteredFacilities.join("");
              })(),
            })}
            icon={
              <Ionicons
                name="happy-outline"
                size={16}
                color={Colors.tertieryButton}
              />
            }
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  facilitiesHeading: {
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ShowFacilities;
