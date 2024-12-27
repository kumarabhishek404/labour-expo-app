import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { Link, router, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/commons/Loader";
import {
  AccountStatusAtom,
  UserAtom,
} from "../../AtomStore/user";
import { signIn, updateUserById } from "../../api/user";
import { toast } from "../../hooks/toast";
import { useForm, Controller } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PasswordComponent from "@/components/inputs/Password";
import { fetchCurrentLocation } from "@/constants/functions";
import CustomHeading from "@/components/commons/CustomHeading";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import { useTranslation } from "@/utils/i18n";

const LoginScreen = () => {
  const { t } = useTranslation();
  const setUserDetails = useSetAtom(UserAtom);
  const setIsAccountInactive = useSetAtom(AccountStatusAtom);
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
    mutationFn: (payload: any) => updateUserById(payload),
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
    mutationFn: (data) => signIn(data),
    onSuccess: async (response) => {
      let user = response?.user;
      console.log("user after login", user);
      setUserDetails({
        isAuth: true,
        token: response?.token,
        ...user,
      });
      console.log("user?.status", user?.status);

      toast.success("Logged in successfully!");
      if (user?.status === "ACTIVE") {
        setIsAccountInactive(false);
        console.log("user?.role", user?.role);
        router.push("/(tabs)");
      } else {
        setIsAccountInactive(true);
        router.push("/(tabs)/fifth");
      }
      // Condition to fetch location if location key is empty or has latitude 0
      if (
        !user?.location ||
        Object.keys(user?.location).length === 0 ||
        (!user?.location?.latitude && !user?.location?.longitude)
      ) {
        const locationData = await fetchCurrentLocation();
        console.log("Location data - ", locationData);
        if (locationData) {
          setUserDetails((prevDetails: any) => ({
            ...prevDetails,
            location: locationData.location,
          }));
          mutationUpdateProfileInfo?.mutate({
            location: locationData.location,
          });
        }
      }
    },
    onError: (err) => {
      console.error("Error while logging in user - ", err);
      toast.error("Login failed");
    },
  });

  const handleForgotPassword = () => {
    router.push("/screens/auth/forgetPassword");
  };

  const onSubmit = (data: any) => {
    mutationSignIn.mutate(data);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader
        loading={
          mutationSignIn?.isPending || mutationUpdateProfileInfo?.isPending
        }
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("hello")},
          </CustomHeading>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("welcome")}
          </CustomHeading>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="mobile"
            defaultValue=""
            rules={{
              required: t("mobileIsRequired"),
              pattern: {
                value: /^[0-9]{10}$/,
                message: t("enterAValidMobileNumber"),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                label={t("mobile")}
                name="mobile"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterYourMobile")}
                containerStyle={errors?.mobile && styles.errorInput}
                errors={errors}
                icon={
                  <Ionicons
                    name={"call-outline"}
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
            defaultValue=""
            rules={{ required: t("passwordIsRequired") }}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordComponent
                label={t("password")}
                name="password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterYourPassword")}
                containerStyle={errors?.password && styles.errorInput}
                errors={errors}
                icon={
                  <MaterialIcons
                    name={"password"}
                    size={30}
                    color={Colors.secondary}
                    style={{ paddingVertical: 10, paddingRight: 10 }}
                  />
                }
              />
            )}
          />

          <View style={styles.forgetPasswordContainer}>
            <TouchableOpacity
              style={styles.forgetPasswordContainer}
              onPress={handleForgotPassword}
            >
              <CustomHeading fontWeight="normal" color={Colors?.link}>
                {t("forgotPassword")}
              </CustomHeading>
            </TouchableOpacity>
          </View>

          <Button
            isPrimary={true}
            title={t("login")}
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButtonWrapper}
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("dontHaveAnAccount")}</CustomText>
            <Link href="/screens/auth/register" asChild>
              <TouchableOpacity>
                <CustomHeading color={Colors?.link}>
                  {t("signUp")}
                </CustomHeading>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  textContainer: {
    marginVertical: 20,
  },
  formContainer: {
    marginTop: 15,
    gap: 15,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  forgetPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
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
});

export default LoginScreen;
