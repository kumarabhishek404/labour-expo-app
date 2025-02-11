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

interface SecondScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  startDate: Date;
  setStartDate: any;
  duration: number;
  setDuration: any;
}

const SecondScreen: React.FC<SecondScreenProps> = ({
  setStep,
  address,
  setAddress,
  location,
  setLocation,
  startDate,
  setStartDate,
  duration,
  setDuration,
}: SecondScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: address,
      location: location,
      startDate: startDate,
      duration: duration,
    },
  });

  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setStartDate(data?.startDate);
    setDuration(data?.duration);
    setStep(3);
  };

  return (
    <View style={styles?.container}>
      <View style={{ flexDirection: "column", gap: 15 }}>
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
                onBlur={onBlur}
                location={location}
                setLocation={setLocation}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                errors={errors}
              />
            )}
          />
        </View>

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
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />

        <View style={{ marginBottom: 20 }}>
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
        </View>
      </View>
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={false}
          title={t("back")}
          onPress={() => {
            setStep(1);
          }}
          style={{ width: "30%" }}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
          onPress={handleSubmit(onSubmit)}
          style={{ width: "50%" }}
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
    marginTop: 20,
  },
});

export default SecondScreen;
