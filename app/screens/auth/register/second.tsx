import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Ionicons } from "@expo/vector-icons";
import EmailAddressField from "@/components/inputs/EmailAddress";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";
import { isEmptyObject } from "@/constants/functions";
import Stepper from "@/components/commons/Stepper";
import { REGISTERSTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import DateField from "@/components/inputs/DateField";
import Gender from "@/components/inputs/Gender";

interface SecondScreenProps {
  setStep: any;
  address: string;
  setAddress: any;
  location: object;
  setLocation: any;
  email: string;
  setEmail: any;
  dateOfBirth: Date;
  setDateOfBirth: any;
  gender: string;
  setGender: any;
}

const SecondScreen: React.FC<SecondScreenProps> = ({
  setStep,
  address,
  setAddress,
  location,
  setLocation,
  email,
  setEmail,
  dateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
}: SecondScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: address,
      location: location,
      email: email,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender,
    },
  });
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const onSubmit = (data: any) => {
    setAddress(data?.address);
    setEmail(data?.email);
    setDateOfBirth(data?.dateOfBirth);
    setGender(data?.gender);
    setStep(3);
  };

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={2} steps={REGISTERSTEPS} />
      </View>

      <View style={{ flexDirection: "column", gap: 20 }}>
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
              setSelectedOption={setSelectedOption}
              onBlur={onBlur}
              errors={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{
            required: t("emailAddressIsRequired"),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: t("enterAValidEmailAddress"),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailAddressField
              name="email"
              email={value}
              setEmail={onChange}
              onBlur={onBlur}
              errors={errors}
              placeholder={t("enterYourEmailAddress")}
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, marginRight: 10 }}
                />
              }
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

        <Controller
          control={control}
          name="gender"
          rules={{
            required: t("genderIsRequired"),
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
      </View>

      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={false}
          title={t("back")}
          onPress={() => setStep(1)}
        />
        <Button
          isPrimary={true}
          title={t("saveAndNext")}
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
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },

  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default SecondScreen;
