import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
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

const SecondScreen = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userDetails?.name || "", // Fixed syntax error by adding '||'
      address: userDetails?.address || "", // Fixed syntax error by adding '||'
      email: userDetails?.email?.value || "", // Fixed syntax error by adding '||'
      dateOfBirth:
        userDetails?.dateOfBirth ||
        moment().subtract(18, "years").startOf("year"),
      gender: userDetails?.gender || "", // Fixed syntax error by changing to 'userDetails?.gender || ""'
    },
  });
  const [location, setLocation] = useState<any>({});
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
      router.push({
        pathname: "/screens/auth/register/third",
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
      location: {
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
      address: data?.address,
      email: data?.email,
      dateOfBirth: data?.dateOfBirth,
      gender: data?.gender,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationUpdateProfile?.isPending} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centeredView}>
          <CustomHeading baseFont={26}>{t("personalDetails")}</CustomHeading>
          <CustomText
            baseFont={16}
            color={Colors.disabledText}
            style={{ textAlign: "center" }}
          >
            {t("pleaseEnterYourPersonalDetailsToContinue")}
          </CustomText>
        </View>

        <View style={styles.centeredView}>
          <View style={{ flexDirection: "column", gap: 20 }}>
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
                />
              )}
            />

            {/* Address Field - Required */}
            <Controller
              control={control}
              name="address"
              rules={{ required: t("addressIsRequired") }}
              render={({ field: { onChange, value } }) => (
                <AddLocationAndAddress
                  label={t("address")}
                  name="address"
                  address={value}
                  setAddress={onChange}
                  location={location}
                  setLocation={setLocation}
                  errors={errors}
                />
              )}
            />

            {/* Email Field */}
            <Controller
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
            />

            {/* Date of Birth Field */}
            <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="dateOfBirth"
                defaultValue={moment().subtract(18, "years").startOf("year")}
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
            </View>

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
                />
              )}
            />
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
