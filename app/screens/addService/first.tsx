import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import WorkRequirment from "@/components/inputs/WorkRequirements";
import { WORKTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";
import { filterSubCategories } from "@/constants/functions";
import PaperDropdown from "@/components/inputs/Dropdown";
import ImageUpload from "@/components/inputs/ImagePicker";
import TOAST from "@/app/hooks/toast";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

interface FirstScreenProps {
  setStep: any;
  type: string;
  setType: any;
  subType: string;
  setSubType: any;
  images: any;
  setImages: any;
  requirements: any;
  setRequirements: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  type,
  setType,
  subType,
  setSubType,
  images,
  setImages,
  requirements,
  setRequirements,
}: FirstScreenProps) => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: type,
      subType: subType,
      images: images,
    },
  });
  const setAddServiceStep = useSetAtom(Atoms?.AddServiceStepAtom);

  const onSubmit = (data: any) => {
    if (data?.images && data?.images?.length > 3) {
      TOAST?.error("You can not upload more than 3 images");
    } else {
      if (data?.images && data?.images?.length > 0) setImages(data?.images);
      setType(data?.type);
      setSubType(data?.subType);
      setAddServiceStep(2);
      setStep(2);
    }
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
                selectedValue={value}
                onSelect={(selectedValue: any) => {
                  onChange(selectedValue);
                  setValue("subType", "");
                  // setRequirements(requirements);
                }}
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
              <PaperDropdown
                name="subType"
                selectedValue={value}
                onSelect={(selectedValue: any) => {
                  onChange(selectedValue);
                  // setValue("requirements", requirements);
                }}
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
          name="images"
          render={({ field: { onChange, onBlur, value } }) => (
            <ImageUpload
              name="images"
              images={value}
              setImages={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />
      </View>

      <View style={styles?.buttonContainer}>
        <Button
          style={{ width: "100%" }}
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
