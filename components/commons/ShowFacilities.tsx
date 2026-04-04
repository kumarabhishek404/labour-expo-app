import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import Colors from "@/constants/Colors";

type IonName = ComponentProps<typeof Ionicons>["name"];

interface ShowFacilitiesProps {
  facilities: { [key: string]: boolean };
}

const FACILITY_CONFIG: {
  key: string;
  icon: IonName;
}[] = [
  { key: "food", icon: "restaurant-outline" },
  { key: "living", icon: "bed-outline" },
  { key: "travelling", icon: "car-outline" },
  { key: "esi_pf", icon: "shield-checkmark-outline" },
];

const ShowFacilities: React.FC<ShowFacilitiesProps> = ({ facilities }) => {
  if (!facilities || !Object.values(facilities).some(Boolean)) return null;

  const active = FACILITY_CONFIG.filter((f) => facilities[f.key]);
  if (active.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="gift-outline" size={18} color={Colors.primary} />
        </View>
        <CustomText baseFont={13} fontWeight="800" color={Colors.primary}>
          {t("facilitiesProvidedByEmployer")}
        </CustomText>
      </View>
      <View style={styles.chipsRow}>
        {active.map(({ key, icon }) => (
          <View key={key} style={styles.chip}>
            <Ionicons name={icon} size={16} color={Colors.primary} />
            <CustomText baseFont={12} fontWeight="700" color={Colors.heading}>
              {t(key)}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.12)",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.18)",
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
});

export default ShowFacilities;
