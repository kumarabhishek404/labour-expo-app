import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { filterSubCategories } from "@/constants/functions";
import ButtonComp from "@/components/inputs/Button";

interface Props {
  type: string;
  defaultSubType: string;
  onBack: () => void;
  onNext: (subType: string) => void;
}

export default function SelectWorkSubCategoryStep({
  type,
  defaultSubType,
  onBack,
  onNext,
}: Props) {
  const {
    control,
    handleSubmit,
    watch, // 👈 watch form values
    formState: { errors },
  } = useForm({
    defaultValues: { subType: defaultSubType },
  });

  const selectedSubType = watch("subType"); // 👈 real-time value

  const submit = (data: any) => {
    onNext(data.subType);
  };

  const subCategories = filterSubCategories(type);

  return (
    <View style={{ gap: 25 }}>
      {/* Heading */}
      <View style={{ gap: 6 }}>
        <Text style={styles.title}>{t("workSubTypeTitle")}</Text>
        <Text style={styles.subtitle}>{t("workSubTypeSubtitle")}</Text>
      </View>

      {/* Grid */}
      <Controller
        control={control}
        name="subType"
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.grid}>
            {subCategories.map((item: any) => {
              const active = value === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7} // 👈 better tap feel
                  style={[styles.card, active && styles.activeCard]}
                  onPress={() => onChange(item.value)}
                >
                  <Text style={[styles.cardText, active && styles.activeText]}>
                    {t(item.label)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {/* Hint */}
      <Text style={styles.hint}>{t("workSubTypeHint")}</Text>

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
          disabled={!selectedSubType}
          onPress={handleSubmit(submit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },

  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "#fafafa",
  },

  activeCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    transform: [{ scale: 1.02 }],
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },

  activeText: {
    color: "white",
    fontWeight: "700",
  },

  error: {
    color: "#ff3b30",
    fontSize: 14,
  },

  hint: {
    fontSize: 13,
    color: "#888",
    marginTop: -10,
  },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
