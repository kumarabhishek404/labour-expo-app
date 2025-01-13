import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";
import Step2 from "../../../../assets/step2.jpg";
import DateField from "@/components/inputs/DateField";
import { isEmptyObject } from "@/constants/functions";
import { AddServiceInProcess } from "@/app/AtomStore/user";
import { useSetAtom } from "jotai";
import Stepper from "@/components/commons/Stepper";
import { ADDSERVICESTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import moment from "moment";

interface SecondScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  startDate: Date;
  setStartDate: any;
  endDate: Date;
  setEndDate: any;
}

const SecondScreen: React.FC<SecondScreenProps> = ({
  setStep,
  address,
  setAddress,
  location,
  setLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
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
      endDate: endDate,
    },
  });

  const setIsAddService = useSetAtom(AddServiceInProcess);
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setStartDate(data?.startDate);
    setEndDate(data?.endDate);
    setStep(3);
  };

  return (
    <View style={styles?.container}>
      <Image source={Step2} style={styles.image} />
      <View style={{ marginVertical: 30 }}>
        <Stepper currentStep={2} steps={ADDSERVICESTEPS} />
      </View>

      <View style={{ flexDirection: "column", gap: 15 }}>
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

        <Controller
          control={control}
          name="startDate"
          defaultValue={new Date()}
          rules={{
            required: t("startDateIsRequired"),
            validate: (value) => {
              if (new Date(value) < new Date()) {
                return t("startDateNotEarlierThanToday");
              } else if (new Date(value) > new Date(watch("endDate"))) {
                return t("startDateNotLaterThanEndDate");
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

        <Controller
          control={control}
          name="endDate"
          defaultValue={new Date()}
          rules={{
            required: t("endDateIsRequired"),
            validate: (value) => {
              if (new Date(value) <= new Date()) {
                return t("endDateNotEarlierThanToday");
              } else if (new Date(value) < new Date(watch("startDate"))) {
                return t("endDateNotEarlierThanStartDate");
              } else {
                return true;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              title={t("endDate")}
              name="endDate"
              type="serviceDate"
              date={moment(value)}
              setDate={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={false}
          title={t("back")}
          onPress={() => {
            setStep(1);
            setIsAddService(false);
          }}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});

export default SecondScreen;
