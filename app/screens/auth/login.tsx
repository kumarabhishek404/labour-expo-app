import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Atoms from "@/app/AtomStore";
import USER from "@/app/api/user";
import { useForm, Controller } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import { useTranslation } from "@/utils/i18n";
import WORKER1 from "@/assets/worker1.png";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import AUTH from "@/app/api/auth";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import { saveToken } from "@/utils/authStorage";
import Loader from "@/components/commons/Loaders/Loader";
import StickButtonWithWall from "@/components/commons/StickButtonWithWall";
import APP_CONTEXT from "@/app/context/locale";
import MobileNumberField from "@/components/inputs/MobileNumber";
import ContactSupport from "@/components/commons/ContactSupport";

export default function Login() {
  APP_CONTEXT?.useApp();
  const { t } = useTranslation();
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);
  const [countryCode, setCountryCode] = useState<string>("+91");

  const [step, setStep] = useState<1 | 2>(1);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { mobile } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobile: mobile || "",
      otp: "",
    },
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

  /* -------------------- STEP 1: SEND OTP -------------------- */
  const sendOtpMutation = useMutation({
    mutationFn: (payload: { mobile: string }) => AUTH.signIn(payload),
    onSuccess: () => {
      setLoginError(null);
      setStep(2);
    },
    onError: (err: any) => {
      setLoginError(err?.response?.data?.message || "Failed to send OTP");
    },
  });

  /* -------------------- STEP 2: VERIFY OTP -------------------- */
  const verifyOtpMutation = useMutation({
    mutationFn: (payload: { mobile: string; otp: string }) =>
      AUTH.signIn(payload),

    onSuccess: async (response) => {
      const { token, user } = response;

      await saveToken(token);

      // 1️⃣ Account not active
      // if (user?.status !== "ACTIVE") {
      //   router.replace("/(tabs)/fifth");
      //   return;
      // }

      // 2️⃣ Incomplete onboarding
      if (!user?.name || !user?.address || !user?.gender || !user?.age) {
        setUserDetails(user);
        router.push({
          pathname: "/screens/auth/register/second",
          params: { userId: user._id },
        });
        return;
      }

      // if (!user.profilePicture) {
      //   setUserDetails(user);
      //   router.push({
      //     pathname: "/screens/auth/register/fifth",
      //     params: { userId: user._id },
      //   });
      //   return;
      // }

      // 3️⃣ Navigate immediately 🚀
      setUserDetails({ isAuth: true, ...user });
      router.replace("/(tabs)");

      // 4️⃣ Fire-and-forget background tasks 🔄
      Promise.allSettled([
        PUSH_NOTIFICATION.registerForPushNotificationsAsync(
          user.notificationConsent,
          user._id,
        ),
        refreshUser().then((updatedUser) =>
          setUserDetails({ isAuth: true, ...updatedUser }),
        ),
      ]);
    },

    onError: async (err: any) => {
      setLoading(false);
      const errorMessage = err?.response?.data?.message;
      setLoginError(errorMessage || "Login failed");
    },
  });

  /* -------------------- HANDLERS -------------------- */
  const handleLoginPress = (data: any) => {
    if (step === 1) {
      sendOtpMutation.mutate({ mobile: data.mobile });
    } else {
      verifyOtpMutation.mutate({
        mobile: data.mobile,
        otp: data.otp,
      });
    }
  };

  const handleNewRegistration = () => {
    router.replace("/screens/auth/register/first"); // Use replace
    setUserDetails(null);
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      <Loader
        loading={sendOtpMutation.isPending || verifyOtpMutation.isPending}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screenWrapper}>
            <View
              style={[
                styles.centerBlock,
                step === 2 ? { minHeight: 650 } : { minHeight: 550 },
              ]}
            >
              <Image source={WORKER1} style={styles.image} />

              <CustomHeading baseFont={24}>
                {t("welcome")} {t("users")}
              </CustomHeading>

              <View style={styles.formContainer}>
                {/* MOBILE INPUT */}
                <Controller
                  control={control}
                  name="mobile"
                  rules={{
                    required: t("mobileIsRequired"),
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: t("enterAValidMobileNumber"),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <MobileNumberField
                      name="mobile"
                      countryCode={countryCode}
                      setCountryCode={setCountryCode}
                      mobile={value as string}
                      setPhoneNumber={onChange}
                      errors={errors}
                      placeholder={t("enterMobileTitle")}
                      icon={
                        <Feather
                          name="phone"
                          size={25}
                          color={Colors.disabled}
                        />
                      }
                    />
                    // <TextInputComponent
                    //   label="mobile"
                    //   name="mobile"
                    //   value={value as string}
                    //   type="number"
                    //   maxLength={10}
                    //   onChangeText={onChange}
                    //   placeholder={t("enterYourMobile")}
                    //   errors={errors}
                    //   textStyles={{ marginLeft: 10 }}
                    //   icon={
                    //     <Ionicons
                    //       name="call-outline"
                    //       size={25}
                    //       color={Colors.secondary}
                    //     />
                    //   }
                    // />
                  )}
                />

                {/* OTP INPUT (STEP 2 ONLY) */}
                {step === 2 && (
                  <Controller
                    control={control}
                    name="otp"
                    rules={{
                      required: t("otpIsRequired"),
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: t("enterAValidOtp"),
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInputComponent
                        label="otp"
                        name="otp"
                        value={value as string}
                        type="number"
                        maxLength={6}
                        onChangeText={onChange}
                        placeholder={t("enterYourOtp")}
                        errors={errors}
                        textStyles={{ marginLeft: 10 }}
                        icon={
                          <Ionicons
                            name="call-outline"
                            size={25}
                            color={Colors.secondary}
                          />
                        }
                      />
                    )}
                  />
                )}

                {step === 2 && (
                  <TouchableOpacity
                    onPress={() =>
                      sendOtpMutation.mutate({
                        mobile: watch("mobile") as string,
                      })
                    }
                    disabled={resendDisabled}
                  >
                    <CustomText
                      color={resendDisabled ? Colors.primary : Colors.danger}
                      baseFont={16}
                      textAlign="right"
                    >
                      {resendDisabled
                        ? `${t("resendOtpIn", { seconds: timer })}`
                        : t("resendOtp")}
                    </CustomText>
                  </TouchableOpacity>
                )}

                {loginError && (
                  <CustomText color={Colors.error} style={styles.errorText}>
                    {loginError}
                  </CustomText>
                )}

                <Button
                  isPrimary
                  title={step === 1 ? t("sendOtp") : t("login")}
                  onPress={handleSubmit(handleLoginPress)}
                  style={styles.loginButtonWrapper}
                  textStyle={{ fontSize: 24, fontWeight: "600" }}
                  disabled={loading} // Disable button when loading
                />

                {/* <View style={styles.footerContainer}>
              <CustomText>{t("dontHaveAnAccount")}</CustomText>
              <TouchableOpacity onPress={handleNewRegistration}>
                <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                  {t("signUp")}
                </CustomHeading>
              </TouchableOpacity>
            </View> */}
              </View>
            </View>
            <ContactSupport />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StickButtonWithWall
        content={
          <View style={{ paddingHorizontal: 4 }}>
            <CustomText fontWeight="bold" baseFont={16} color={Colors?.white}>
              {t("changeLanguage")}
            </CustomText>
          </View>
        }
        onPress={() =>
          router.push({
            pathname: "/screens/settings/changeLanguage",
            params: { title: "notifications", type: "all" },
          })
        }
        position="top"
        containerStyles={{ height: 40 }}
      />
    </>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  /* Scroll takes full screen height */
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
  },

  /* Full screen wrapper */
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: "space-between", // ⭐ pushes support to bottom
  },

  /* Login section centered vertically */
  centerBlock: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 40,
  },

  image: {
    height: 240,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },

  formContainer: {
    marginTop: 10,
    gap: 15,
  },

  errorText: {
    textAlign: "center",
  },

  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  // image: {
  //   height: 260,
  //   resizeMode: "contain",
  //   alignSelf: "center",
  // },
  // formContainer: {
  //   marginTop: 20,
  //   gap: 15,
  // },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: Colors.white,
  },
  loginButton: {
    height: 53,
    borderRadius: 8,
  },
  // errorText: {
  //   textAlign: "center",
  // },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  // loginButtonWrapper: {
  //   backgroundColor: Colors.primary,
  //   borderRadius: 8,
  //   height: 53,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
});
