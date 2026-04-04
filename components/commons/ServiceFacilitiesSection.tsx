import React from "react";
import { View, StyleSheet } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

type Facilities = {
  food?: boolean;
  living?: boolean;
  travelling?: boolean;
  esi_pf?: boolean;
};

type Item = {
  key: keyof Facilities;
  labelKey: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    key: "food",
    labelKey: "food",
    icon: (
      <MaterialCommunityIcons
        name="food-apple"
        size={22}
        color={Colors.primary}
      />
    ),
  },
  {
    key: "living",
    labelKey: "living",
    icon: <Ionicons name="home" size={22} color={Colors.primary} />,
  },
  {
    key: "travelling",
    labelKey: "travelling",
    icon: (
      <FontAwesome5 name="shuttle-van" size={18} color={Colors.primary} />
    ),
  },
  {
    key: "esi_pf",
    labelKey: "esi_pf",
    icon: <FontAwesome5 name="coins" size={18} color={Colors.primary} />,
  },
];

const ServiceFacilitiesSection = ({
  facilities,
}: {
  facilities?: Facilities | null;
}) => {
  if (!facilities || typeof facilities !== "object") return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons
          name="shield-check"
          size={22}
          color={Colors.primary}
        />
        <CustomHeading textAlign="left" baseFont={18} color={Colors.black}>
          {t("facilitiesProvidedByEmployer")}
        </CustomHeading>
      </View>
      <CustomText
        textAlign="left"
        baseFont={13}
        color={Colors.secondary}
        style={styles.subtitle}
      >
        {t("facilitiesSectionHint")}
      </CustomText>

      <View style={styles.grid}>
        {items.map(({ key, labelKey, icon }) => {
          const on = Boolean(facilities[key]);
          return (
            <View key={key} style={styles.cell}>
              <View style={styles.iconCircle}>{icon}</View>
              <CustomText
                textAlign="center"
                baseFont={12}
                fontWeight="700"
                color={Colors.inputLabel}
                style={styles.cellLabel}
              >
                {t(labelKey)}
              </CustomText>
              <View
                style={[
                  styles.badge,
                  on ? styles.badgeOn : styles.badgeOff,
                ]}
              >
                <CustomText
                  baseFont={12}
                  fontWeight="800"
                  color={on ? Colors.white : Colors.subHeading}
                >
                  {on ? t("yes") : t("no")}
                </CustomText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.12)",
    shadowColor: "#1e3a8a",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 14,
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  cell: {
    width: "48%",
    alignItems: "center",
    backgroundColor: Colors.fourth,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.08)",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.1)",
  },
  cellLabel: {
    marginBottom: 8,
    minHeight: 32,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    minWidth: 52,
    alignItems: "center",
  },
  badgeOn: {
    backgroundColor: Colors.success,
  },
  badgeOff: {
    backgroundColor: Colors.gray,
  },
});

export default ServiceFacilitiesSection;
