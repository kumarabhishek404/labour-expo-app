import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import DateField from "@/components/inputs/DateField";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import moment from "moment";
import ButtonComp from "@/components/inputs/Button";
import AddressSelector from "@/components/inputs/AddressSelectot";

interface Props {
  onNext: () => void;
  onBack: () => void;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  startDate: Date;
  setStartDate: any;
}

const SelectLocationAndDateStep = ({
  onNext,
  onBack,
  address,
  setAddress,
  location,
  setLocation,
  startDate,
  setStartDate,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { address, startDate },
  });

  const onSubmit = (data: any) => {
    setAddress(data.address);
    setStartDate(data.startDate);
    onNext();
  };

  return (
    <View style={{ gap: 20 }}>
      {/* Heading */}
      <Text style={styles.title}>📍 {t("whereAndWhenTitle")}</Text>
      <Text style={styles.subtitle}>{t("whereAndWhenSubtitle")}</Text>

      {/* Address */}
      <Controller
        control={control}
        name="address"
        rules={{ required: t("addressIsRequired") }}
        render={({ field: { onChange, value } }) => (
          <AddressSelector
            label={t("selectWorkLocation")}
            address={value}
            setAddress={onChange}
            setLocation={setLocation}
            errors={errors?.address}
          />
        )}
      />

      {/* Start Date */}
      <Controller
        control={control}
        name="startDate"
        defaultValue={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        rules={{
          required: t("startDateIsRequired"),
          validate: (value) =>
            new Date(value) >= new Date() || t("startDateNotEarlierThanToday"),
        }}
        render={({ field: { onChange, value } }) => (
          <DateField
            title={t("startDate")}
            name="startDate"
            type="serviceDate"
            date={moment(value)}
            setDate={onChange}
            errors={errors}
          />
        )}
      />

      {/* Helper Tip */}
      <View style={styles.tipBox}>
        <Text style={{ fontWeight: "600" }}>💡 {t("locationTipTitle")}</Text>
        <Text style={styles.tipText}>{t("locationTipText")}</Text>
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

export default SelectLocationAndDateStep;

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
