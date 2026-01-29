import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
import LOCAL_CONTEXT from "@/app/context/locale";

export default function Login() {
  LOCAL_CONTEXT?.useLocale();
  const { t } = useTranslation();
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);

  const [step, setStep] = useState<1 | 2>(1);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { mobile } = useLocalSearchParams();

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
      if (user?.status !== "ACTIVE") {
        router.replace("/(tabs)/fifth");
        return;
      }

      // 2️⃣ Incomplete onboarding
      if (!user?.name || !user?.address || !user?.gender || !user?.age) {
        setUserDetails(user);
        router.replace({
          pathname: "/screens/auth/register/second",
          params: { userId: user._id },
        });
        return;
      }

      if (!user.profilePicture) {
        setUserDetails(user);
        router.replace({
          pathname: "/screens/auth/register/fifth",
          params: { userId: user._id },
        });
        return;
      }

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

    onError: (err: any) => {
      setLoginError(err?.response?.data?.message || "Invalid OTP");
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

  /* -------------------- UI -------------------- */
  return (
    <>
      <Loader
        loading={sendOtpMutation.isPending || verifyOtpMutation.isPending}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>
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
              <TextInputComponent
                label="mobile"
                name="mobile"
                value={value as string}
                type="number"
                maxLength={10}
                onChangeText={onChange}
                placeholder={t("enterYourMobile")}
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
            // <View>
            //   <TextInputComponent
            //     label="otp"
            //     name="otp"
            //     style={styles.otpInput}
            //     type="numeric"
            //     placeholder={t("enterYourOtp")}
            //     maxLength={6}
            //     value={otp}
            //     onChangeText={setOtp}
            //     errors={errors}
            //     icon={
            //       <Ionicons
            //         name="call-outline"
            //         size={30}
            //         color={Colors.secondary}
            //       />
            //     }
            //   />
            // </View>
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
            style={styles.loginButton}
          />
        </View>
      </ScrollView>

      <StickButtonWithWall
        content={
          <CustomText fontWeight="bold" color={Colors.white}>
            {t("changeLanguage")}
          </CustomText>
        }
        onPress={() => router.push("/screens/settings/changeLanguage")}
        position="top"
        containerStyles={{ height: 40 }}
      />
    </>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  image: {
    height: 260,
    resizeMode: "contain",
    alignSelf: "center",
  },
  formContainer: {
    marginTop: 20,
    gap: 15,
  },
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
  errorText: {
    textAlign: "center",
  },
});
