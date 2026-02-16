import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Duration from "@/components/inputs/Duration";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { Ionicons } from "@expo/vector-icons";
import ButtonComp from "@/components/inputs/Button";

interface Props {
  onNext: () => void;
  onBack: () => void;
  duration: number;
  setDuration: any;
  description: string;
  setDescription: any;
}

const SelectDurationAndDescriptionStep = ({
  onNext,
  onBack,
  duration,
  setDuration,
  description,
  setDescription,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { duration, description },
  });

  const onSubmit = (data: any) => {
    setDuration(data.duration);
    setDescription(data.description);
    onNext();
  };

  return (
    <View style={{ gap: 20 }}>
      {/* Heading */}
      <Text style={styles.title}>📝 {t("jobDetailsTitle")}</Text>
      <Text style={styles.subtitle}>{t("jobDetailsSubtitle")}</Text>

      {/* Duration */}
      <Controller
        control={control}
        name="duration"
        rules={{
          required: t("durationIsRequired"),
          validate: (value) => value > 0 || t("durationMustBeGreaterThanZero"),
        }}
        render={({ field: { onChange, value } }) => (
          <Duration
            duration={value}
            setDuration={onChange}
            errors={errors}
            name="duration"
          />
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextAreaInputComponent
            name="description"
            label="description"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={t("describeWorkExample")}
            errors={errors}
            icon={
              <Ionicons
                name={"create-outline"}
                size={28}
                color={Colors.secondary}
                style={{ paddingVertical: 10, paddingRight: 10 }}
              />
            }
          />
        )}
      />

      {/* Helper tips */}
      <View style={styles.tipBox}>
        <Text style={{ fontWeight: "600" }}>💡 {t("whatToWrite")}</Text>
        <Text style={styles.tipText}>{t("descriptionTips")}</Text>
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
          onPress={handleSubmit(onSubmit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default SelectDurationAndDescriptionStep;

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#666", lineHeight: 22 },

  tipBox: {
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 12,
  },
  tipText: { color: "#666", marginTop: 5, lineHeight: 22 },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
