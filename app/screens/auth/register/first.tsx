import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Gender from "@/components/inputs/Gender";
import DateField from "@/components/inputs/DateField";
import { Link } from "expo-router";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import Stepper from "@/components/commons/Stepper";
import { REGISTERSTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";


interface FirstScreenProps {
  setStep: any;
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
  firstName,
  setFirstName,
  lastName,
  setLastName,
  gender,
  setGender,
  dateOfBirth,
  setDateOfBirth,
}: FirstScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      dateOfBirth: new Date(dateOfBirth),
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
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={1} steps={REGISTERSTEPS} />
      </View>
      <View style={{ gap: 15, marginBottom: 15 }}>
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: t("firstNameIsRequired")
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              name="firstName"
              label={t("firstName")}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("enterYourFirstName")}
              containerStyle={errors?.firstName && styles.errorInput}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          rules={{
            required: t("lastNameIsRequired")
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              name="lastName"
              label={t("lastName")}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("enterYourLastName")}
              containerStyle={errors?.lastName && styles.errorInput}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          rules={{
            required: t("genderIsRequired")
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Gender
              name="gender"
              label={t("whatIsYourGender")}
              options={[
                { title: t("male"), value: "male", icon: "👩‍🦰" },
                { title: t("female"), value: "female", icon: "👨" },
                { title: t("other"), value: "other", icon: "✨" },
              ]}
              gender={value}
              setGender={onChange}
              containerStyle={errors?.gender && styles.errorInput}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="dateOfBirth"
          defaultValue={new Date()}
          rules={{
            required: t("dateOfBirthIsRequired"),
            validate: (value) => {
              const selectedDate = new Date(value);
              const today = new Date();
              const eighteenYearsAgo = new Date();
              eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

              if (selectedDate > eighteenYearsAgo) {
                return t("youMustBeAtLeast18YearsOld");
              } else {
                return true;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              title={t("dateOfBirth")}
              name="dateOfBirth"
              date={value}
              setDate={onChange}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />
      </View>
      <Button
        isPrimary={true}
        title={t("saveAndNext")}
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      />

      <View style={styles.footerContainer}>
        <CustomText fontSize={14}>{t("alreadyHaveAnAccount")}</CustomText>
        <Link href="/screens/auth/login" asChild>
          <TouchableOpacity>
            <CustomHeading color={Colors?.link}>{t("signIn")}</CustomHeading>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    borderColor: Colors.primary,
    backgroundColor: "#ffe5cc",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  submitButton: {
    borderRadius: 30,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
});

export default FirstScreen;
