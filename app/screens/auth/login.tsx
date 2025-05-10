import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Atoms from "@/app/AtomStore";
import USER from "@/app/api/user";
import { useForm, Controller } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PasswordComponent from "@/components/inputs/Password";
import { fetchCurrentLocation } from "@/constants/functions";
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

export default function Login() {
  const { t } = useTranslation();
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const { mobile } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useAtom(Atoms?.tokenAtom);
  const [loginError, setLoginError] = useState<string | null>(null); // State for login error

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobile: mobile || "",
      password: "",
    },
  });

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data
      );
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
    },
  });

  const mutationSignIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => AUTH?.signIn(data),

    onSuccess: async (response) => {
      setLoading(true);
      setLoginError(null); // Clear any previous error
      const authToken = response?.token;
      await saveToken(authToken);
      await setToken(authToken);

      try {
        const updatedUser: any = await refreshUser();
        if (!updatedUser) {
          console.error("❌ Failed to fetch updated user info.");
          setLoading(false);
          return;
        }

        if (updatedUser?.status !== "ACTIVE") {
          setUserDetails({ isAuth: true, ...updatedUser }); //set user details
          router.replace("/(tabs)/fifth");
          return;
        }

        if (!updatedUser.profilePicture) {
          setUserDetails({ isAuth: true, ...updatedUser }); //set user details
          router.replace({
            pathname: "/screens/auth/register/fourth",
            params: { userId: updatedUser._id },
          });
          return;
        }

        if (
          !updatedUser?.location?.latitude ||
          !updatedUser?.location?.longitude
        ) {
          const locationData: any = await fetchCurrentLocation();
          if (locationData) {
            await mutationUpdateProfileInfo.mutateAsync({
              _id: updatedUser._id,
              location: locationData.location,
            });
          }
        }

        await PUSH_NOTIFICATION?.registerForPushNotificationsAsync(
          updatedUser?.notificationConsent
        );

        setUserDetails({ isAuth: true, ...updatedUser }); //set user details
        router.replace("/(tabs)"); // Use replace for smoother navigation
        setLoading(false);
      } catch (err) {
        console.error("❌ Background task error after login:", err);
        setLoading(false);
      }
    },

    onError: async (err: any) => {
      setLoading(false);
      const errorCode = err?.response?.data?.errorCode;
      const errorMessage = err?.response?.data?.message; // Get the error message
      setLoginError(errorMessage || "Login failed"); // Set the error state

      const userId = err?.response?.data?.userId;
      const token = err?.response?.data?.token;

      if (
        errorCode === "SET_PASSWORD_FIRST" ||
        errorCode === "SET_PROFILE_PICTURE_FIRST"
      ) {
        await saveToken(token);

        const route =
          errorCode === "SET_PASSWORD_FIRST"
            ? "/screens/auth/register/second"
            : "/screens/auth/register/fourth";

        router.replace({ pathname: route, params: { userId } }); // Use replace
      }
    },
  });

  const handleForgotPassword = () => {
    router.push("/screens/auth/forgetPassword");
  };

  const handleFormSubmit = async (data: any) => {
    mutationSignIn.mutate(data);
    // await loginUser(data?.mobile, data?.pass)
  };

  const handleNewRegistration = () => {
    router.replace("/screens/auth/register/first"); // Use replace
    setUserDetails(null);
  };

  return (
    <>
      <Loader loading={mutationSignIn?.isPending || loading} />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={WORKER1} style={styles.image} />
        <View style={styles.textContainer}>
          <CustomHeading baseFont={24}>
            {t("welcome")} {t("users")}
          </CustomHeading>
        </View>

        <View style={styles.formContainer}>
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
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                label="mobile"
                name="mobile"
                value={value as string}
                onBlur={onBlur}
                type="number"
                maxLength={10}
                onChangeText={onChange}
                placeholder={t("enterYourMobile")}
                errors={errors}
                textStyles={{ fontSize: 18 }}
                icon={
                  <Ionicons
                    name="call-outline"
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
            name="password"
            rules={{ required: t("passwordIsRequired") }}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordComponent
                label="password"
                name="password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterYourPassword")}
                errors={errors}
                icon={
                  <MaterialIcons
                    name="password"
                    size={30}
                    color={Colors.secondary}
                    style={{ paddingVertical: 10, paddingRight: 10 }}
                  />
                }
              />
            )}
          />

          <View style={styles.forgetPasswordContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <CustomHeading fontWeight="normal" color={Colors.link}>
                {t("forgotPassword")}
              </CustomHeading>
            </TouchableOpacity>
          </View>

          {loginError && ( // Display error message
            <CustomText style={styles.errorText} color={Colors.error}>
              {loginError}
            </CustomText>
          )}

          <Button
            isPrimary
            title={t("login")}
            onPress={handleSubmit(handleFormSubmit)}
            style={styles.loginButtonWrapper}
            textStyle={{ fontSize: 24, fontWeight: "600" }}
            disabled={loading} // Disable button when loading
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("dontHaveAnAccount")}</CustomText>
            <TouchableOpacity onPress={handleNewRegistration}>
              <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                {t("signUp")}
              </CustomHeading>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  textContainer: {
    marginVertical: 10,
  },
  formContainer: {
    marginTop: 15,
    gap: 15,
  },
  forgetPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  image: {
    height: 270,
    resizeMode: "contain",
    alignSelf: "center",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    marginTop: 8,
  },
  loaderOverlay: {
    // Styles for the overlay
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensure it's above other content
  },
});
