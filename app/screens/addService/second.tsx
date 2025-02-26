import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Button from "@/components/inputs/Button";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import WorkRequirment from "@/components/inputs/WorkRequirements";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

interface SecondScreenProps {
  setStep: any;
  requirements: string;
  setRequirements: any;
  facilities: any;
  setFacilities: any;
  type: string;
  subType: string;
}

const SecondScreen: React.FC<SecondScreenProps> = ({
  setStep,
  requirements,
  setRequirements,
  facilities,
  setFacilities,
  type,
  subType,
}: SecondScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requirements: requirements,
    },
  });
  const [errorField, setErrorField] = useState({});
  const setAddServiceStep = useSetAtom(Atoms?.AddServiceStepAtom);

  const onSubmit = (data: any) => {
    console.log("Data--", data);

    setRequirements(data?.requirements);
    setStep(3);
  };

  return (
    <View style={styles?.container}>
      <View style={{ flexDirection: "column", gap: 25 }}>
        <Controller
          control={control}
          name="requirements"
          defaultValue=""
          rules={{
            required: t("workRequirementsIsRequired"),
            validate: (value) => {
              if (!value || value.length === 0) {
                return t("atLeastOneRequirementIsNeeded");
              }

              for (let i = 0; i < value.length; i++) {
                const item: any = value[i];
                if (!item?.name) {
                  setErrorField({
                    index: i,
                    name: "dropdown",
                  });
                  return `${t("requirement")} #${i + 1}: ${t("selectAWorker")}`;
                }
                if (!item?.payPerDay) {
                  setErrorField({
                    index: i,
                    name: "price",
                  });
                  return `${t("requirement")} #${i + 1}: ${t(
                    "payPerDayIsRequired"
                  )}`;
                }
                if (isNaN(parseInt(item?.payPerDay))) {
                  setErrorField({
                    index: i,
                    name: "price",
                  });
                  return `${t("requirement")} #${i + 1}: ${t(
                    "payPerDayShouldBeInNumber"
                  )}`;
                }
                if (item?.payPerDay === 0 || !item?.payPerDay) {
                  setErrorField({
                    index: i,
                    name: "price",
                  });
                  return `${t("requirement")} #${i + 1}: ${t(
                    "payPerDayMustBeGreaterThan0"
                  )}`;
                }
                if (item?.count === 0 || !item?.count) {
                  setErrorField({
                    index: i,
                    name: "counter",
                  });
                  return `${t("requirement")} #${i + 1}: ${t(
                    "totalRequiredMustBeGreaterThan0"
                  )}`;
                }
              }
              setErrorField({
                index: -1,
                name: "",
              });
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <WorkRequirment
              name="requirements"
              watch={watch}
              type={type ?? ""}
              subType={subType ?? ""}
              requirements={value}
              setRequirements={onChange}
              facilities={facilities}
              setFacilities={setFacilities}
              errors={errors}
              errorField={errorField}
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={true}
          title={t("back")}
          onPress={() => {
            setAddServiceStep(1)
            setStep(1);
          }}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
          style={{ width: "30%" }}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
          onPress={handleSubmit(onSubmit)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
  },
  image: {
    width: "80%",
    height: 210,
    resizeMode: "cover",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
});

export default SecondScreen;
