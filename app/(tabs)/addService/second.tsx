import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Stepper from "@/app/(tabs)/addService/stepper";
import { ADDSERVICESTEPS } from "@/constants";
import AddLocationAndAddress from "@/components/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";
import Step2 from "../../../assets/step2.jpg";
import DateField from "@/components/dateField";

interface SecondScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: string;
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

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setLocation(data?.location);
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
            required: "Address is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AddLocationAndAddress
              name="address"
              address={value}
              setAddress={onChange}
              onBlur={onBlur}
              location={location}
              setLocation={setLocation}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="startDate"
          defaultValue={new Date()}
          rules={{
            required: "Start date is required",
            validate: (value) => {
              if (new Date(value) < new Date()) {
                return "Start date cannot be earlier than today";
              } else if (new Date(value) > new Date(watch("endDate"))) {
                return "Start date cannot be later than End date";
              } else {
                return true;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              title="Start Date"
              name="startDate"
              date={value}
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
            required: "End date is required",
            validate: (value) => {
              if (new Date(value) <= new Date()) {
                return "End date cannot be earlier than today";
              } else if (new Date(value) < new Date(watch("startDate"))) {
                return "End date cannot be earlier than Start date";
              } else {
                return true;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              title="End Date"
              name="endDate"
              date={value}
              setDate={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />
      </View>
      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(1)} />
        <Button
          isPrimary={true}
          title="Save and Next"
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
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});

export default SecondScreen;
