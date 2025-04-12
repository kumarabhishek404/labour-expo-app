import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import MobileNumberField from "@/components/inputs/MobileNumber";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import AUTH from "@/app/api/auth";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import Loader from "@/components/commons/Loaders/Loader";

interface FormData {
  mobile: string;
}

// Same import section...

const RegisterScreen: React.FC = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const setUserDetails = useSetAtom(Atoms?.UserAtom);
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const { userId } = useLocalSearchParams();

  const [step, setStep] = useState<number>(1);
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [otp, setOtp] = useState<string>("");
  const [mobileNumberExist, setMobileNumberExist] = useState<string>("notSet");
  const [timer, setTimer] = useState<number>(30);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const [nextStepAfterOtp, setNextStepAfterOtp] = useState<{
    route: string;
    params: any;
  } | null>(null);
  const [userCanResumeRegistration, setUserCanResumeRegistration] =
    useState(false);

  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: { mobile: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (step === 2) {
      startResendTimer();
    }

    // Optional cleanup if user leaves the screen
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step]);

  const startResendTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setResendDisabled(true);
    setTimer(30);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload) => AUTH.register(payload),
    onSuccess: (data) => {
      setUserDetails({ token: data?.data?.token });
      router.push({
        pathname: "/screens/auth/register/second",
        params: { userId: userId || data?.data?.userId },
      });
    },
    onError: () => TOAST.error(t("registrationFailed")),
  });

  const checkMobileNumber = useMutation({
    mutationFn: async (payload: { mobile: string }) =>
      AUTH.checkMobileExistance(payload),
    onSuccess: ({ data }) => {
      const exists = data?.data?.exists;
      const token = data?.data?.token;
      const user = data?.data?.user;
      setUserDetails({ ...user, token: token });
      setMobileNumberExist(exists ? "exist" : "notExist");

      if (exists && user) {
        const {
          name,
          gender,
          address,
          dateOfBirth,
          password,
          profilePicture,
          _id,
        } = user;

        const isEmpty = (val: any) =>
          val === undefined || val === null || String(val).trim() === "";

        const missingBasics =
          isEmpty(name) ||
          isEmpty(gender) ||
          isEmpty(address) ||
          isEmpty(dateOfBirth);

        let route = "";
        if (missingBasics) route = "/screens/auth/register/second";
        else if (isEmpty(password)) route = "/screens/auth/register/third";
        else if (isEmpty(profilePicture))
          route = "/screens/auth/register/fourth";
        else route = "/screens/auth/login";

        const userTokenExists = userDetails?.token;

        if (userTokenExists) {
          router.push({
            pathname: route,
            params:
              route === "/screens/auth/login"
                ? { mobile: user.mobile }
                : { userId: _id },
          });
          setValue("mobile", "");
        } else {
          // ✅ Mark that user can resume registration
          setUserCanResumeRegistration(true);

          setNextStepAfterOtp({
            route,
            params:
              route === "/screens/auth/login"
                ? { mobile: user.mobile }
                : { userId: _id },
          });
          setStep(1);
          setValue("mobile", "");
        }
      } else {
        setUserCanResumeRegistration(false); // user doesn't exist, no resume possible
      }
    },
    onError: () => TOAST.error(t("errorCheckingMobile")),
  });

  const sendOtp = useMutation({
    mutationFn: async (mobile: string) => AUTH.sendOTP(mobile),
    onSuccess: ({ Status }) => {
      if (Status === "Success") {
        setStep(2);
        startResendTimer();
        TOAST.success(t("otpSentSuccess"));
      } else {
        TOAST.error(t("otpSentFail"));
      }
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (payload: { mobile: string; otp: string }) =>
      AUTH.verifyOTP(payload),
    onSuccess: ({ Status }) => {
      if (Status === "Success") {
        TOAST.success(t("otpVerified"));

        // Reset OTP input
        setOtp("");

        // Reset step to initial state
        setStep(1);

        // If user already exists and we had a next step planned, resume registration
        if (nextStepAfterOtp) {
          router.push({
            pathname: nextStepAfterOtp.route,
            params: nextStepAfterOtp.params,
          });
          return;
        }

        // Otherwise, treat this as a fresh registration
        const payload: any = {
          countryCode: countryCode,
          mobile: watch("mobile"),
          locale: locale,
        };
        mutationRegister.mutate(payload);
      } else {
        TOAST.error(t("otpInvalidMessage"));
      }
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Loader loading={mutationRegister?.isPending} />
        <View style={styles.centeredView}>
          <AntDesign
            name="mobile1"
            size={150}
            color={Colors.tertieryButton}
            style={styles.image}
          />
          <CustomHeading baseFont={26}>{t("verificationTitle")}</CustomHeading>
          <CustomText
            baseFont={16}
            color={Colors.disabledText}
            style={{ textAlign: "center" }}
          >
            {step === 1
              ? t("verificationDescription1")
              : t("verificationDescription2")}
          </CustomText>
        </View>

        <View style={styles.formContainer}>
          {step === 1 && (
            <>
              <Controller
                control={control}
                name="mobile"
                rules={{
                  required: t("mobileRequired"),
                  pattern: {
                    value: /^\d{10}$/,
                    message: t("mobileInvalid"),
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <MobileNumberField
                    name="mobile"
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                    mobile={value}
                    setPhoneNumber={(val: string) => {
                      setMobileNumberExist("notSet");
                      onChange(val);
                      if (val.length === 10)
                        checkMobileNumber.mutate({ mobile: val });
                    }}
                    errors={errors}
                    loading={checkMobileNumber?.isPending}
                    isMobileNumberExist={mobileNumberExist === "exist"}
                    placeholder={t("enterMobileTitle")}
                    icon={
                      <Feather name="phone" size={26} color={Colors.disabled} />
                    }
                  />
                )}
              />
              <Button
                isPrimary
                title={t("sendOtp")}
                onPress={() =>
                  sendOtp.mutate(`${countryCode}${watch("mobile")}`)
                }
                style={styles.button}
                disabled={
                  !isValid ||
                  (mobileNumberExist === "exist" && !userCanResumeRegistration)
                }
                textStyle={{ fontSize: 24, fontWeight: "600" }}
              />
            </>
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
                    sendOtp.mutate(`${countryCode}${watch("mobile")}`)
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
              <Button
                isPrimary
                title={t("verifyOtp")}
                onPress={() =>
                  verifyOtp.mutate({
                    mobile: `${countryCode}${watch("mobile")}`,
                    otp,
                  })
                }
                style={styles.button}
                disabled={otp.length !== 6}
                textStyle={{ fontSize: 24, fontWeight: "600" }}
              />
            </View>
          )}

          <View style={styles.footerContainer}>
            <CustomText>{t("alreadyHaveAnAccount")}</CustomText>
            <TouchableOpacity onPress={() => router.back()}>
              <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                {t("signIn")}
              </CustomHeading>
            </TouchableOpacity>
          </View>
          {(sendOtp?.isPending || verifyOtp?.isPending) && (
            <ActivityIndicator size="large" color={Colors.primary} />
          )}
        </View>
      </ScrollView>
    </>
  );
};

// Style remains unchanged...

export default RegisterScreen;

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
  button: {
    height: 53,
    borderRadius: 8,
    width: "100%",
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
  image: { width: 150, height: 150, marginBottom: 20 },
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
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
