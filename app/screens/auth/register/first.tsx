import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import { COUNTRYPHONECODE } from "@/constants";
import { t } from "@/utils/translationHelper";
import MobileNumberField from "@/components/inputs/MobileNumber";
import { Feather } from "@expo/vector-icons";
import ModalComponent from "@/components/commons/Modal";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import { Link, router, Stack } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import AUTH from "@/app/api/auth";
import REGISTRATION from "../../../../assets/registration.png";
import { Image } from "react-native";

const RegisterScreen = () => {
  const setUserDetails = useSetAtom(Atoms?.UserAtom);
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const [isModalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumberExist, setMobileNumberExist] = useState("notExist");

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      countryCode: countryCode,
      phoneNumber: "",
      name: "",
    },
  });

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload) => AUTH.register(payload),
    onSuccess: (data) => {
      console.log("User registered:", data);
      setUserDetails({
        token: data?.data?.token,
      });
      router.push({
        pathname: "/screens/auth/register/second",
        params: { userId: data?.data?.userId },
      });
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const mutationCheckMobileNumber = useMutation({
    mutationKey: ["checkMobileNumber"],
    mutationFn: (payload: { mobile: string }) =>
      AUTH?.checkMobileExistance(payload),
    onSuccess: (response) => {
      if (response?.data?.data?.exists) {
        setMobileNumberExist("exist");
      } else {
        setMobileNumberExist("notExist");
      }
    },
    onError: (err) => {
      console.error("Error checking mobile number", err);
    },
  });

  const onSubmit = (data: any) => {
    setModalVisible(true);
  };

  const onConfirmMobileNumber = () => {
    setModalVisible(false);
    if (!watch("name") || !watch("phoneNumber")) {
      TOAST?.error(t("pleaseFillAllFields"));
      return;
    }
    const payload: any = {
      name: watch("name"),
      countryCode: watch("countryCode"),
      mobile: watch("phoneNumber"),
      locale: locale,
    };
    mutationRegister.mutate(payload);
  };

  const modalContent = () => (
    <View style={{ paddingVertical: 20, gap: 5 }}>
      <CustomText baseFont={25} color={Colors?.subHeading}>
        {t("isYourCorrectNumber")}
      </CustomText>
      <CustomText baseFont={30} fontWeight="bold" color={Colors?.tertiery}>
        {watch("phoneNumber")}
      </CustomText>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationRegister?.isPending} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={REGISTRATION} style={styles.image} />
        <View style={styles.textContainer}>
          <CustomHeading baseFont={24}>{t("registerNow")}</CustomHeading>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: t("mobileNumberIsRequired"),
              pattern: {
                value: /^\d{10}$/,
                message: t("enterAValidMobileNumber"),
              },
            }}
            render={({ field: { onChange, value } }) => (
              <MobileNumberField
                name="phoneNumber"
                countriesPhoneCode={COUNTRYPHONECODE}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={value}
                setPhoneNumber={async (val: any) => {
                  setMobileNumberExist("notSet");
                  if (val.length === 10) {
                    await mutationCheckMobileNumber.mutate({ mobile: val });
                  }
                  onChange(val);
                }}
                loading={mutationCheckMobileNumber?.isPending}
                errors={errors}
                isMobileNumberExist={mobileNumberExist === "exist"}
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
                errors={mobileNumberExist === "notExist" ? errors : []}
                disabled={mobileNumberExist !== "notExist"}
              />
            )}
          />

          <Button
            isPrimary
            title={t("saveAndNext")}
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButtonWrapper}
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("alreadyHaveAnAccount")}</CustomText>
            <Link href="/screens/auth/login" asChild>
              <TouchableOpacity>
                <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                  {t("signIn")}
                </CustomHeading>
              </TouchableOpacity>
            </Link>
          </View>

          <ModalComponent
            visible={isModalVisible}
            content={modalContent}
            transparent={true}
            animationType="slide"
            title={t("checkYourMobileNumber")}
            onClose={() => setModalVisible(false)}
            primaryButton={{
              title: t("yesProceed"),
              action: onConfirmMobileNumber,
            }}
            secondaryButton={{
              title: t("noEdit"),
              action: () => setModalVisible(false),
              style: { width: "40%" },
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  textContainer: {
    // marginVertical: 10,
  },
  formContainer: {
    marginTop: 15,
    gap: 15,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  image: {
    // width: "70%",
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default RegisterScreen;
