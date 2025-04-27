import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";
import Step2 from "../../../assets/step2.jpg";
import DateField from "@/components/inputs/DateField";
import { isEmptyObject } from "@/constants/functions";
import { useSetAtom } from "jotai";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import moment from "moment";
import Duration from "@/components/inputs/Duration";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import { Ionicons } from "@expo/vector-icons";

interface ThirdScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  startDate: Date;
  setStartDate: any;
  duration: number;
  setDuration: any;
  description: any;
  setDescription: any;
}

const ThirdScreen: React.FC<ThirdScreenProps> = ({
  setStep,
  address,
  setAddress,
  location,
  setLocation,
  startDate,
  setStartDate,
  duration,
  setDuration,
  description,
  setDescription,
}: ThirdScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: address,
      location: location,
      startDate: startDate,
      duration: duration,
      description: description,
    },
  });

  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setStartDate(data?.startDate);
    setDuration(data?.duration);
    setDescription(data?.description);
    setStep(4);
  };

  return (
    <>
      <View style={{ flexDirection: "column", gap: 25 }}>
        <View style={{ zIndex: 9 }}>
          <Controller
            control={control}
            name="address"
            defaultValue=""
            rules={{
              required: t("addressIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AddLocationAndAddress
                label={t("address")}
                name="address"
                address={value}
                setAddress={onChange}
                location={location}
                setLocation={setLocation}
                selectedOption={selectedOption}
                errors={errors}
              />
            )}
          />
        </View>

        <View style={{ zIndex: 8 }}>
          <Controller
            control={control}
            name="startDate"
            defaultValue={new Date()}
            rules={{
              required: t("startDateIsRequired"),
              validate: (value) => {
                if (new Date(value) < new Date()) {
                  return t("startDateNotEarlierThanToday");
                } else {
                  return true;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
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
        </View>

        <Controller
          control={control}
          name="duration"
          defaultValue={0}
          rules={{
            required: t("durationIsRequired"),
            validate: (value) => {
              if (value <= 0) {
                return t("durationMustBeGreaterThanZero");
              } else {
                return true;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Duration
              duration={value}
              setDuration={onChange}
              errors={errors}
              name="duration"
            />
          )}
        />

        <View style={{ marginBottom: 20 }}>
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextAreaInputComponent
                name="description"
                label="description"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterWorkDescription")}
                errors={errors}
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
      </View>

      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={true}
          title={t("back")}
          onPress={() => {
            setStep(2);
          }}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
          style={{ width: "30%", paddingVertical: 8 }}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
          onPress={handleSubmit(onSubmit)}
          style={{ flex: 1, paddingVertical: 8 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    width: "80%",
    height: 210,
    resizeMode: "cover",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default ThirdScreen;
