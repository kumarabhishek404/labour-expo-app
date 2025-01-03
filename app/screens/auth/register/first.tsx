import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Link } from "expo-router";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import Stepper from "@/components/commons/Stepper";
import { COUNTRYPHONECODE, REGISTERSTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import MobileNumberField from "@/components/inputs/MobileNumber";
import { Feather } from "@expo/vector-icons";

interface FirstScreenProps {
  setStep: any;
  phoneNumber: string;
  setPhoneNumber: any;
  countryCode: string;
  setCountryCode: any;
  firstName: string;
  setFirstName: any;
  lastName: string;
  setLastName: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}: FirstScreenProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      firstName: firstName,
      lastName: lastName,
    },
  });

  const onSubmit = (data: any) => {
    setCountryCode(data?.countryCode);
    setPhoneNumber(data?.phoneNumber);
    setFirstName(data?.firstName);
    setLastName(data?.lastName);
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
          name="phoneNumber"
          defaultValue=""
          rules={{
            required: t("mobileNumberIsRequired"),
            pattern: {
              value: /^(\+91[-\s]?)?[6-9]\d{9}$/,
              message: t("enterAValidMobileNumber"),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MobileNumberField
              name="phoneNumber"
              countriesPhoneCode={COUNTRYPHONECODE}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={value}
              setPhoneNumber={(val: any) => {
                const regex = /^(\+91[-\s]?)?[6-9]\d{9}$/;
                if (val.length < 10) {
                  onChange(val);
                } else if (val.length === 10 && regex.test(val)) {
                  onChange(val);
                }
                return;
              }}
              onBlur={onBlur}
              errors={errors}
              placeholder={t("enterYourMobileNumber")}
              icon={
                <Feather
                  name={"phone"}
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
          name="firstName"
          rules={{
            required: t("firstNameIsRequired"),
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
            required: t("lastNameIsRequired"),
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
