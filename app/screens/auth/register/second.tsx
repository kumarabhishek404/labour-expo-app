import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import EmailAddressField from "@/components/inputs/EmailAddress";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { Controller, useForm } from "react-hook-form";
import { isEmptyObject } from "@/constants/functions";
import { t } from "@/utils/translationHelper";
import DateField from "@/components/inputs/DateField";
import Gender from "@/components/inputs/Gender";
import moment, { Moment } from "moment";
import { router, Stack, useLocalSearchParams } from "expo-router";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import USER from "@/app/api/user";
import TOAST from "@/app/hooks/toast";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AutoLocationButton from "@/components/inputs/CurrentLocation";

const SecondScreen = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userDetails?.name || "",
      address: userDetails?.address || "",
      email: userDetails?.email || "",
      gender: userDetails?.gender || "",
      age: userDetails?.age || "",
      aadhaarNumber: userDetails?.aadhaarNumber || "",
    },
  });
  const [location, setLocation] = useState<any>({});
  const [savedAddress, setSavedAddress] = useState<any>([]);
  const { userId } = useLocalSearchParams();

  const mutationUpdateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) =>
      USER.updateUserById({
        _id: userId,
        ...payload,
      }),
    onSuccess: () => {
      console.log("Profile updated successfully");
      TOAST?.success(t("userDetailsAddedSuccessfully"));
      router.push({
        pathname: "/screens/auth/register/fourth",
        params: { userId: userId },
      });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });

  const onSubmit = (data: any) => {
    console.log("data--", data);

    mutationUpdateProfile.mutate({
      name: data?.name,
      age: Number(data?.age),
      aadhaarNumber: data?.aadhaarNumber,
      geoLocation: location,
      savedAddresses: data?.address,
      address: data?.address ?? "",
      email: data?.email,
      gender: data?.gender,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationUpdateProfile?.isPending} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centeredView}>
            <View style={styles.centeredView}>
              <CustomHeading baseFont={26}>
                {t("personalDetails")}
              </CustomHeading>
              <CustomText
                baseFont={16}
                color={Colors.disabledText}
                style={{ textAlign: "center" }}
              >
                {t("pleaseEnterYourPersonalDetailsToContinue")}
              </CustomText>
            </View>

            <View style={styles.centeredView}>
              <View style={{ width: "100%", flexDirection: "column", gap: 20 }}>
                {/* Name Field - Required */}
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: t("firstNameIsRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      name="name"
                      label="name"
                      value={value}
                      onChangeText={onChange}
                      placeholder={t("enterYourFirstName")}
                      textStyles={{ fontSize: 16 }}
                      errors={errors}
                      isRequired={true}
                    />
                  )}
                />

                {/* Address Field - Required */}

                <Controller
                  control={control}
                  name="address"
                  rules={{ required: t("addressIsRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <AutoLocationButton
                      label="address"
                      name="address"
                      address={value}
                      setAddress={onChange}
                      location={location}
                      setLocation={setLocation}
                      savedAddress={savedAddress}
                      setSavedAddress={setSavedAddress}
                      errors={errors}
                      isRequired={true}
                    />
                  )}
                />

                {/* Email Field */}
                {/* <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <EmailAddressField
                    name="email"
                    email={value}
                    setEmail={onChange}
                    placeholder={t("enterYourEmailAddress")}
                    icon={
                      <Ionicons
                        name={"mail-outline"}
                        size={30}
                        color={Colors.secondary}
                        style={{ paddingVertical: 10, marginRight: 10 }}
                      />
                    }
                    errors={errors}
                  />
                )}
              /> */}

                {/* Date of Birth Field */}
                {/* <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="dateOfBirth"
                rules={{
                  required: t("dateOfBirthIsRequired"),
                  validate: (value) => {
                    const selectedDate = moment(value);
                    const eighteenYearsAgo = moment().subtract(18, "years");

                    return selectedDate.isBefore(eighteenYearsAgo)
                      ? true
                      : t("youMustBeAtLeast18YearsOld");
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <DateField
                    title={t("dateOfBirth")}
                    name="dateOfBirth"
                    type="dateOfBirth"
                    date={moment(value)}
                    setDate={onChange}
                    errors={errors}
                  />
                )}
              />
            </View> */}

                {/* Gender Selection */}
                <Controller
                  control={control}
                  name="gender"
                  rules={{ required: t("genderIsRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <Gender
                      name="gender"
                      label={t("whatIsYourGender")}
                      options={[
                        { title: t("male"), value: "male", icon: "👨" },
                        { title: t("female"), value: "female", icon: "👩‍🦰" },
                        { title: t("other"), value: "other", icon: "✨" },
                      ]}
                      gender={value}
                      setGender={onChange}
                      containerStyle={errors?.gender && styles.errorInput}
                      errors={errors}
                      isRequired={true}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="age"
                  rules={{
                    required: t("ageIsRequired"),
                    validate: (value) =>
                      Number(value) >= 18 || t("youMustBeAtLeast18YearsOld"),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInputComponent
                      name="age"
                      label="age"
                      value={value}
                      onChangeText={onChange}
                      placeholder={t("enterYourAge")}
                      type="number"
                      maxLength={2}
                      errors={errors}
                      isRequired={true}
                    />
                  )}
                />

                {/* <Controller
                control={control}
                name="aadhaarNumber"
                render={({ field: { onChange, value } }) => (
                  <TextInputComponent
                    name="aadhaarNumber"
                    label="aadhaarNumber"
                    value={value}
                    onChangeText={(text) =>
                      onChange(text.replace(/[^0-9]/g, ""))
                    }
                    placeholder="XXXX XXXX XXXX"
                    type="numeric"
                    maxLength={12}
                    errors={errors}
                  />
                )}
              /> */}
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              isPrimary={true}
              title={t("back")}
              onPress={() => router.back()}
              bgColor={Colors.danger}
              borderColor={Colors.danger}
              style={{ width: "30%" }}
            />
            <Button
              isPrimary={true}
              title={t("saveAndNext")}
              onPress={handleSubmit(onSubmit)}
              bgColor={Colors.success}
              borderColor={Colors.success}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  centeredView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    gap: 20,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
});

export default SecondScreen;
