import React, { useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";
import Step1 from "../../../assets/step1.jpg";
import { useSetAtom } from "jotai";
import { AddServiceInProcess } from "@/app/AtomStore/user";
import DropdownComponent from "@/components/inputs/Dropdown";
import WorkRequirment from "@/components/inputs/WorkRequirements";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS, WORKTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";
import { filterSubCategories } from "@/constants/functions";

interface FirstScreenProps {
  setStep: any;
  type: string;
  setType: any;
  subType: string;
  setSubType: any;
  requirements: any;
  setRequirements: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  type,
  setType,
  subType,
  setSubType,
  requirements,
  setRequirements,
}: FirstScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: type,
      subType: subType,
      requirements: requirements,
    },
  });
  const setIsAddService = useSetAtom(AddServiceInProcess);
  const [errorField, setErrorField] = useState({});

  const onSubmit = (data: any) => {
    setType(data?.type);
    setSubType(data?.subType);
    setRequirements(data?.requirements);
    setIsAddService(true);
    setStep(2);
  };

  return (
    <>
      {/* <Image source={Step1} style={styles.image} /> */}
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={1} steps={ADDSERVICESTEPS} />
      </View>

      <View style={{ gap: 10 }}>
        <Controller
          control={control}
          name="type"
          defaultValue=""
          rules={{
            required: t("workTypeIsRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DropdownComponent
              name="type"
              label={t("workType")}
              value={value}
              setValue={onChange}
              placeholder={t("selectWorkType")}
              emptyPlaceholder={t("pleaseSelectWorkTypeFirst")}
              options={WORKTYPES}
              errors={errors}
              containerStyle={errors?.type && styles.errorInput}
              search={false}
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="subType"
          defaultValue=""
          rules={{
            required: t("workSubTypeIsRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DropdownComponent
              name="subType"
              label={t("workSubType")}
              value={value}
              setValue={onChange}
              placeholder={t("selectWorkSubType")}
              emptyPlaceholder={t("pleaseSelectWorkTypeFirst")}
              options={filterSubCategories(watch("type"))}
              errors={errors}
              containerStyle={errors?.subType && styles.errorInput}
              search={false}
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

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
                const item = value[i];
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
          render={({ field: { onChange, onBlur, value } }) => (
            <WorkRequirment
              label={t("workRequirements")}
              name="requirements"
              type={watch("type") ?? ""}
              subType={watch("subType") ?? ""}
              requirements={value}
              setRequirements={onChange}
              onBlur={onBlur}
              errors={errors}
              errorField={errorField}
            />
          )}
        />
      </View>

      <Button
        style={styles?.bottomButton}
        isPrimary={true}
        title={t("next")}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  image: {
    width: "80%",
    height: 210,
    resizeMode: "cover",
    alignSelf: "center",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  bottomButton: {
    marginVertical: 20,
  },
});

export default FirstScreen;
