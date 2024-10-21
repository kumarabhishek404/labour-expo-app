import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Gender from "@/components/inputs/Gender";
import DateField from "@/components/inputs/DateField";

interface FirstScreenProps {
  setStep: any;
  setProfilePicture: any;
  firstName: string;
  setFirstName: any;
  lastName: string;
  setLastName: any;
  gender: string;
  setGender: any;
  dateOfBirth: Date;
  setDateOfBirth: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  setFirstName,
  setLastName,
  setGender,
  setDateOfBirth
}: FirstScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: new Date(),
    },
  });

  const onSubmit = (data: any) => {
    setFirstName(data?.firstName);
    setLastName(data?.lastName);
    setGender(data?.gender);
    setDateOfBirth(data?.dateOfBirth);
    setStep(2);
  };

  return (
    <>
      {/* Existing form fields */}
      <Controller
        control={control}
        name="firstName"
        rules={{ required: "First Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputComponent
            name="firstName"
            label="First Name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your First Name"
            containerStyle={errors?.firstName && styles.errorInput}
            errors={errors}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        rules={{ required: "Last Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputComponent
            name="lastName"
            label="Last Name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your Last Name"
            containerStyle={errors?.lastName && styles.errorInput}
            errors={errors}
          />
        )}
      />

      {/* Gender selection */}
      <Controller
        control={control}
        name="gender"
        rules={{ required: "Gender is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Gender
            name="gender"
            label="What's your gender?"
            options={[
              { title: "Male", value: "male", icon: "👩‍🦰" },
              { title: "Female", value: "female", icon: "👨" },
              { title: "Other", value: "other", icon: "✨" },
            ]}
            gender={value}
            setGender={onChange}
            containerStyle={errors?.lastName && styles.errorInput}
            errors={errors}
          />
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        defaultValue={new Date()}
        rules={{
          required: "Start date is required",
          validate: (value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

            if (selectedDate > eighteenYearsAgo) {
              return "You must be at least 18 years old";
            } else {
              return true;
            }
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <DateField
            title="Date Of Birth"
            name="dateOfBirth"
            date={value}
            setDate={onChange}
            onBlur={onBlur}
            errors={errors}
          />
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>Save and Next</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    borderColor: Colors.primary,
    backgroundColor: "#ffe5cc",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
});

export default FirstScreen;
