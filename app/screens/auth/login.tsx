import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { Link, router, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/commons/Loaders/Loader";
import Atoms from "@/app/AtomStore";
import USER from "@/app/api/user";
import TOAST from "../../hooks/toast";
import { useForm, Controller } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PasswordComponent from "@/components/inputs/Password";
import { fetchCurrentLocation } from "@/constants/functions";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import { useTranslation } from "@/utils/i18n";
import WORKER1 from "../../../assets/worker1.png";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import AUTH from "@/app/api/auth";
import useFirstTimeLaunch from "@/app/hooks/useFirstTimeLaunch";

const LoginScreen = () => {
  const { t } = useTranslation();
  const isFirstLaunch = useFirstTimeLaunch();
  const setUserDetails = useSetAtom(Atoms?.UserAtom);
  const setIsAccountInactive = useSetAtom(Atoms?.AccountStatusAtom);
  const notificationConsent = useAtomValue(Atoms?.NotificationConsentAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobile: "",
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
      const user = response?.user;
      const token = response?.token;

      // Update user details
      setUserDetails({
        isAuth: true,
        token,
        ...user,
      });

      // TOAST?.success(t("loggedInSuccessfully"));

      // // Redirect based on user status
      // if (isFirstLaunch) {
      //   return router?.push("/screens/tutorials/bootomNavigation");
      // }

      if (!user?.profilePicture) {
        return router.push({
          pathname: "/screens/auth/register/fourth",
          params: { userId: user?._id },
        });
      }

      if (user?.status !== "ACTIVE") {
        setIsAccountInactive(true);
        return router.replace("/(tabs)/fourth");
      }

      setIsAccountInactive(false);
      router.replace(user?.skills?.length > 0 ? "/(tabs)/second" : "/(tabs)");

      // Fetch and update location if missing
      if (!user?.location?.latitude || !user?.location?.longitude) {
        const locationData = await fetchCurrentLocation();
        if (locationData) {
          setUserDetails((prev: any) => ({
            ...prev,
            location: locationData.location,
          }));

          mutationUpdateProfileInfo?.mutate({
            _id: user?._id,
            location: locationData.location,
          });
        }
      }

      // Register for push notifications
      try {
        await PUSH_NOTIFICATION?.registerForPushNotificationsAsync(
          user?.notificationConsent
        );
        console.log("Notifications enabled");
      } catch (err) {
        console.error("Failed to enable notifications", err);
      }
    },

    onError: (err: any) => {
      const errorCode = err?.response?.data?.errorCode;
      const userId = err?.response?.data?.userId;
      const token = err?.response?.data?.token;

      if (
        errorCode === "SET_PASSWORD_FIRST" ||
        errorCode === "SET_PROFILE_PICTURE_FIRST"
      ) {
        setUserDetails({ token });

        const route =
          errorCode === "SET_PASSWORD_FIRST"
            ? "/screens/auth/register/second"
            : "/screens/auth/register/fourth";

        return router.push({ pathname: route, params: { userId } });
      }
    },
  });

  const handleForgotPassword = () => {
    router.push("/screens/auth/forgetPassword");
  };

  const handleFormSubmit = (data: any) => {
    mutationSignIn.mutate(data);
  };

  console.log("In the login screen--");
  

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader
        loading={
          mutationSignIn?.isPending || mutationUpdateProfileInfo?.isPending
        }
      />
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
                value={value}
                onBlur={onBlur}
                type="number"
                maxLength={10}
                onChangeText={onChange}
                placeholder={t("enterYourMobile")}
                errors={errors}
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

          <Button
            isPrimary
            title={t("login")}
            onPress={handleSubmit(handleFormSubmit)}
            style={styles.loginButtonWrapper}
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("dontHaveAnAccount")}</CustomText>
            <Link href="/screens/auth/register/first" asChild>
              <TouchableOpacity>
                <CustomHeading baseFont={24} color={Colors.tertieryButton}>
                  {t("signUp")}
                </CustomHeading>
              </TouchableOpacity>
            </Link>
          </View>
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
    borderRadius: 100,
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
    // width: "100%",
    height: 270,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default LoginScreen;
