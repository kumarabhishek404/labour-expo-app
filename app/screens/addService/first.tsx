import React, { useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";
import { useSetAtom } from "jotai";
import DropdownComponent from "@/components/inputs/Dropdown";
import WorkRequirment from "@/components/inputs/WorkRequirements";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS, WORKTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";
import { filterSubCategories } from "@/constants/functions";
import { router, Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import CustomText from "@/components/commons/CustomText";
import DropdownExample from "@/components/inputs/Dropdown";
import PaperDropdown from "@/components/inputs/Dropdown";

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
  const [errorField, setErrorField] = useState({});

  const onSubmit = (data: any) => {
    // console.log("data---", data);

    setType(data?.type);
    setSubType(data?.subType);
    setRequirements(data?.requirements);
    // setIsAddService(true);
    setStep(2);
  };

  const handleValue = (value: any) => {
    console.log("value --", value);
  };

  return (
    <>
      <View style={{ gap: 25 }}>
        <View style={{ zIndex: 9 }}>
          <Controller
            control={control}
            name="type"
            defaultValue={type}
            rules={{
              required: t("workTypeIsRequired"),
            }}
            render={({ field: { value, onChange } }) => (
              <PaperDropdown
                name="type"
                value={value}
                onSelect={onChange}
                translationEnabled
                placeholder="selectWorkType"
                options={WORKTYPES}
                errors={errors}
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
        </View>
        <View style={{ zIndex: 8 }}>
          <Controller
            control={control}
            name="subType"
            defaultValue={subType}
            rules={{
              required: t("workSubTypeIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="subType"
                value={value}
                onSelect={onChange}
                placeholder={
                  watch("type")
                    ? "selectWorkSubType"
                    : "pleaseSelectWorkTypeFirst"
                }
                translationEnabled
                options={filterSubCategories(watch("type"))}
                errors={errors}
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
        </View>
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
          render={({ field: { onChange, value } }) => (
            <WorkRequirment
              // label={"workerType"}
              name="requirements"
              watch={watch}
              type={watch("type") ?? ""}
              subType={watch("subType") ?? ""}
              requirements={value}
              setRequirements={onChange}
              errors={errors}
              errorField={errorField}
            />
          )}
        />
      </View>

      <View style={styles?.buttonContainer}>
        <Button
          style={{ width: "100%", }}
          textStyle={{ fontSize: 18 }}
          isPrimary={true}
          title={t("next")}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
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
    marginTop: 25,
  },
  bottomButton: {
    marginVertical: 20,
  },
});

export default FirstScreen;
