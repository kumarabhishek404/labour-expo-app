import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import ButtonComp from "@/components/inputs/Button";
import WorkerRequirementSelector from "@/components/inputs/WorkRequirements";
import Colors from "@/constants/Colors";

interface Props {
  type: string;
  subType: string;
  defaultRequirements: any[];
  onBack: () => void;
  onNext: (data: any[]) => void;
}

export default function AddRequirementsStep({
  type,
  subType,
  defaultRequirements,
  onBack,
  onNext,
}: Props) {
  const [errorField, setErrorField] = useState({});

  const { control, watch, handleSubmit } = useForm({
    defaultValues: { requirements: defaultRequirements },
  });

  const submit = (data: any) => {
    onNext(data.requirements);
  };

  return (
    <View style={{ gap: 20 }}>
      {/* Heading */}
      <Text style={styles.title}>👷 {t("hireWorkersTitle")}</Text>
      <Text style={styles.subtitle}>{t("hireWorkersSubtitle")}</Text>

      {/* Worker Requirement Selector */}
      <Controller
        control={control}
        name="requirements"
        render={({ field: { onChange, value } }) => (
          <WorkerRequirementSelector
            type={type ?? ""}
            subType={subType ?? ""}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* Tip */}
      <View style={styles.tipBox}>
        <Text style={{ fontWeight: "600" }}>💡 {t("salaryTipTitle")}</Text>
        <Text style={styles.tipText}>{t("salaryTipText")}</Text>
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
          disabled={watch("requirements")?.length === 0}
          onPress={handleSubmit(submit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#666", lineHeight: 22 },

  tipBox: {
    backgroundColor: "#FFF8E1",
    padding: 15,
    borderRadius: 12,
  },
  tipText: { color: "#666", marginTop: 5, lineHeight: 22 },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
