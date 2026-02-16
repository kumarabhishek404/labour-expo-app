import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { WORKTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import ButtonComp from "@/components/inputs/Button";

interface Props {
  defaultType: string;
  onBack: () => void;
  onNext: (type: string) => void;
}

export default function SelectWorkCategoryStep({
  defaultType,
  onBack,
  onNext,
}: Props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { type: defaultType },
  });

  // 👇 watch selected value in real-time
  const selectedType = watch("type");

  const submit = (data: any) => onNext(data.type);

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("workTypeTitle")}</Text>
        <Text style={styles.subtitle}>{t("workTypeSubtitle")}</Text>
      </View>

      {/* Selection Grid */}
      <Controller
        control={control}
        name="type"
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.grid}>
            {WORKTYPES.map((item: any) => {
              const active = value === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
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

      {/* Error */}
      {errors.type && <Text style={styles.error}>{t("workTypeRequired")}</Text>}

      {/* Hint */}
      <Text style={styles.hint}>{t("workTypeHint")}</Text>

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
          onPress={handleSubmit(submit)}
          disabled={!selectedType}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, paddingTop: 10 },

  header: { gap: 6 },

  title: {
    fontSize: 24,
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
    marginTop: 10,
  },

  card: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
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
    marginTop: -5,
  },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
