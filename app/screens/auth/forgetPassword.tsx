import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/commons/Loaders/Loader";
import { Controller, useForm } from "react-hook-form";
import PasswordComponent from "@/components/inputs/Password";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import { t } from "@/utils/translationHelper";
import TOAST from "@/app/hooks/toast";
import AUTH from "@/app/api/auth";
import MobileNumberField from "@/components/inputs/MobileNumber";

interface FormData {
  mobile: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

const ForgetPasswordScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [mobileNumberExist, setMobileNumberExist] = useState<string>("notSet");
  const [otp, setOtp] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (step === 2) {
      setResendDisabled(true);
      setTimer(30);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const checkMobileNumber = useMutation({
    mutationFn: async (payload: { mobile: string }) =>
      AUTH.checkMobileExistance(payload),
    onSuccess: ({ data }) => {
      if (data?.data?.exists) {
        setMobileNumberExist("exist");
        setUserId(data?.data?.user?._id);
      } else {
        setMobileNumberExist("notExist");
        TOAST.error(t("mobileNumberNotExist"));
      }
    },
    onError: () => TOAST.error(t("errorCheckingMobile")),
  });

  const sendOTP = useMutation({
    mutationKey: ["sendOTP"],
    mutationFn: async (mobile: string) => AUTH.sendOTP(mobile),
    onSuccess: ({ Status }) => {
      if (Status === "Success") {
        setStep(2);
        TOAST.success(t("otpSentSuccessfully"));
      } else {
        TOAST.error(t("otpSentFail"));
      }
    },
    onError: () => TOAST.error(t("failedToSendOTP")),
  });

  const verifyOTP = useMutation({
    mutationKey: ["verifyOTP"],
    mutationFn: async (payload: { mobile: string; otp: string }) =>
      AUTH.verifyOTP(payload),
    onSuccess: ({ Status }) => {
      if (Status === "Success") {
        TOAST.success(t("otpVerified"));
        setStep(3);
      } else {
        TOAST.error(t("otpInvalidMessage"));
      }
    },
    onError: () => TOAST.error(t("invalidOTP")),
  });

  const resetPassword = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (payload: {
      userId: string;
      mobile: string;
      password: string;
    }) => AUTH.resetPassword(payload),
    onSuccess: ({ status }) => {
      if (status === 200) {
        TOAST.success(t("passwordResetSuccess"));
        router.push("/screens/auth/login");
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    console.log("Stappp-===", step, data, userId);

    if (step === 1) {
      if (mobileNumberExist !== "exist") {
        setLoading(false);
        return TOAST.error(t("mobileNumberNotExist"));
      }
      sendOTP.mutate(`${countryCode}${data.mobile}`);
    } else if (step === 2) {
      if (otp) {
        verifyOTP.mutate({
          mobile: `${countryCode}${watch("mobile")}`,
          otp: otp || "",
        });
      } else {
        TOAST?.error(t("pleaseEnterOTP"));
      }
    } else if (step === 3 && userId) {
      resetPassword.mutate({
        userId: userId,
        mobile: watch("mobile"),
        password: data.password || "",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader
        loading={
          sendOTP?.isPending ||
          verifyOTP?.isPending ||
          resetPassword?.isPending ||
          loading
        }
      />
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <AntDesign
            name="mobile1"
            size={150}
            color={Colors.tertieryButton}
            style={styles.image}
          />
          <CustomHeading baseFont={26}>{t("resetYourPassword")}</CustomHeading>
          <CustomText
            baseFont={16}
            color={Colors.disabledText}
            style={{ textAlign: "center" }}
          >
            {t("resetPasswordDescription")}
          </CustomText>

          <CustomText
            baseFont={20}
            color="#FF6B00"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            {t("voiceCallMayBeCome")}
          </CustomText>
        </View>

        <View style={styles.formContainer}>
          {step === 1 && (
            <Controller
              control={control}
              name="mobile"
              rules={{
                required: t("mobileIsRequired"),
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: t("enterValidMobileNumber"),
                },
              }}
              render={({ field: { onChange, value } }) => (
                <MobileNumberField
                  name="phoneNumber"
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  mobile={value}
                  setPhoneNumber={(val: string) => {
                    setMobileNumberExist("notSet");
                    if (val.length === 10)
                      checkMobileNumber.mutate({ mobile: val });
                    onChange(val);
                  }}
                  errors={errors}
                  loading={checkMobileNumber?.isPending}
                  isMobileNumberNotExist={mobileNumberExist === "notExist"}
                  placeholder={t("enterMobileTitle")}
                  icon={
                    <Feather name="phone" size={26} color={Colors.disabled} />
                  }
                />
              )}
            />
          )}

          {step === 2 && (
            <View style={styles.otpContainer}>
              <View style={styles.mobileNumberView}>
                <CustomText baseFont={18} color={Colors.tertieryButton}>
                  {countryCode} {watch("mobile")}
                </CustomText>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Feather name="edit" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.otpLableContainer}>
                <CustomHeading
                  textAlign="left"
                  baseFont={16}
                  color={Colors.inputLabel}
                  style={{ alignSelf: "flex-start" }}
                >
                  {t("otpTitle")}
                </CustomHeading>
                <TouchableOpacity
                  onPress={() =>
                    sendOTP.mutate(`${countryCode}${watch("mobile")}`)
                  }
                  disabled={resendDisabled}
                >
                  <CustomText
                    color={resendDisabled ? Colors.text : Colors.primary}
                    baseFont={16}
                  >
                    {resendDisabled
                      ? `${t("resendOtpIn", { seconds: timer })}`
                      : t("resendOtp")}
                  </CustomText>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.otpContainer}>
              <Controller
                control={control}
                name="password"
                rules={{ required: t("passwordIsRequired") }}
                render={({ field: { onChange, value } }) => (
                  <PasswordComponent
                    name="password"
                    label="password"
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder={t("enterYourPassword")}
                    errors={errors}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: t("confirmPasswordRequired"),
                  validate: (value) =>
                    value === watch("password") || t("passwordsDoNotMatch"),
                }}
                render={({ field: { onChange, value } }) => (
                  <PasswordComponent
                    name="confirmPassword"
                    label="confirmPassword"
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder={t("reEnterYourPassword")}
                    errors={errors}
                  />
                )}
              />
            </View>
          )}

          <Button
            isPrimary
            title={
              step === 1
                ? t("sendOtp")
                : step === 2
                ? t("verifyOtp")
                : t("resetPassword")
            }
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            disabled={!isValid || (step === 1 && mobileNumberExist !== "exist")}
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("ifYouKnewYourPassword")}</CustomText>
            <TouchableOpacity onPress={() => router.back()}>
              <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                {t("signIn")}
              </CustomHeading>
            </TouchableOpacity>
          </View>

          {/* {(checkMobileNumber?.isPending ||
            sendOTP?.isPending ||
            verifyOTP?.isPending ||
            resetPassword?.isPending) && (
            <ActivityIndicator size="large" color={Colors.primary} />
          )} */}
        </View>
      </View>
    </>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  centeredView: {
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  image: { width: 150, height: 150, marginBottom: 20 },
  button: {
    height: 53,
    borderRadius: 8,
    width: "100%",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  otpContainer: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  otpInput: {
    width: "100%",
    textAlign: "center",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 5,
    fontSize: 20,
    letterSpacing: 8,
    backgroundColor: Colors.white,
  },
  mobileNumberView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  otpLableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});
