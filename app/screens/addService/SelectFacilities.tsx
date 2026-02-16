import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { t } from "@/utils/translationHelper";
import ButtonComp from "@/components/inputs/Button";
import Colors from "@/constants/Colors";

interface Props {
  facilities: any;
  setFacilities: any;
  onBack: () => void;
  onNext: () => void;
}

export default function SelectFacilitiesStep({
  facilities,
  setFacilities,
  onBack,
  onNext,
}: Props) {
  // ✅ Move options here
  const options = [
    { key: "food", label: "🍛  " + t("food") },
    { key: "living", label: "🏠  " + t("living") },
    { key: "esi_pf", label: "📄  " + t("esi_pf") }, // also fix key name
    { key: "travelling", label: "🚌  " + t("travel") },
  ];
  const toggle = (key: string) => {
    setFacilities({ ...facilities, [key]: !facilities[key] });
  };

  return (
    <View style={{ gap: 20 }}>
      {/* Friendly Heading */}
      <Text style={styles.title}>✨ {t("extraBenefits")}</Text>

      {/* Guided subtitle */}
      <Text style={styles.subtitle}>{t("benefitsHelpYou")}</Text>

      {/* Options */}
      {options.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.card, facilities[item.key] && styles.active]}
          onPress={() => toggle(item.key)}
        >
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Info box */}
      <View style={styles.tipBox}>
        <Text style={{ fontWeight: "600" }}>💡 {t("proTip")}</Text>
        <Text style={styles.tipText}>{t("benefitsIncreaseChances")}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.row}>
        <ButtonComp
          isPrimary
          title={t("back")}
          onPress={onBack}
          style={{ width: "30%" }}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
        />
        <ButtonComp
          isPrimary
          title={t("next")}
          onPress={onNext}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#666", lineHeight: 22 },

  card: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  active: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  text: { fontSize: 16, fontWeight: "600" },

  tipBox: {
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 12,
  },
  tipText: { color: "#666", marginTop: 5 },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
