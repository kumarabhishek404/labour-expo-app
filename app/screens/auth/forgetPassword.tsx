import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/commons/Loader";
import { forgotPassword, resetPassword } from "../../api/user";
import { Controller, useForm } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PasswordComponent from "@/components/inputs/Password";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import { t } from "@/utils/translationHelper";

const ForgetPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      resetToken: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isResetCodeSent, setIsResetCodeSent] = useState(false);

  const [passwordConditions, setPasswordConditions] = useState({
    hasNumber: false,
    hasAlphabet: false,
    hasLowerCase: false,
    hasSymbol: false,
    isLongEnough: false,
  });

  const checkPasswordConditions = (password: any) => {
    const conditions = {
      hasNumber: /\d/.test(password),
      hasAlphabet: /[A-Za-z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLongEnough: password.length >= 8,
    };

    setPasswordConditions(conditions);
  };

  const mutationForgetPassword = useMutation({
    mutationKey: ["forgetPassword"],
    mutationFn: (payload: any) => forgotPassword(payload),
    onSuccess: (response) => {
      if (response?.status === 200) {
        setIsResetCodeSent(true);
      }
    },
  });

  const mutationSetPassword = useMutation({
    mutationKey: ["setPassword"],
    mutationFn: (payload: any) => resetPassword(payload),
    onSuccess: (response) => {
      if (response?.status === 200) {
        setIsResetCodeSent(false);
        router.push("/screens/auth/login");
      }
    },
  });

  const onSubmit = (data: any) => {
    if (isResetCodeSent)
      mutationSetPassword.mutate({
        email: data?.email,
        resetToken: data?.resetToken,
        password: data?.password,
      });
    else mutationForgetPassword.mutate({ email: data?.email });
  };

  return (
    <ScrollView style={{ padding: 10, backgroundColor: Colors?.white }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader
        loading={
          mutationForgetPassword?.isPending || mutationSetPassword?.isPending
        }
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("hey")}
          </CustomHeading>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("resetYour")}
          </CustomHeading>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("password")}
          </CustomHeading>
        </View>
        <View>
          {isResetCodeSent ? (
            <>
              <Controller
                control={control}
                name="resetToken"
                defaultValue=""
                rules={{ required: t("resetCodeIsRequired") }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    label={t("resetPasswordCode")}
                    name="resetToken"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={{ marginBottom: 15 }}
                    placeholder={t("enterYourResetPasswordCode")}
                    containerStyle={errors?.resetToken && styles.errorInput}
                    errors={errors}
                    icon={
                      <Ionicons
                        name={"mail-outline"}
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
                rules={{
                  required: t("passwordIsRequired"),
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: t("youHaveToFullFillAllTheFollowingConditions"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <PasswordComponent
                      label={t("password")}
                      name="password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text: any) => {
                        onChange(text);
                        checkPasswordConditions(text);
                      }}
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
                    <View style={{ marginBottom: 15 }}>
                      <CustomText
                        textAlign="left"
                        color={
                          (passwordConditions.hasNumber && Colors?.success) ||
                          ""
                        }
                      >
                        {passwordConditions.hasNumber ? (
                          <Entypo name={"check"} size={16} />
                        ) : (
                          <Entypo name="cross" size={16} />
                        )}{" "}
                        {t("useAtLeastOneNumber")}
                      </CustomText>
                      <CustomText
                        textAlign="left"
                        color={
                          (passwordConditions.hasLowerCase &&
                            Colors?.success) ||
                          ""
                        }
                      >
                        {passwordConditions.hasLowerCase ? (
                          <Entypo name={"check"} size={16} />
                        ) : (
                          <Entypo name="cross" size={16} />
                        )}{" "}
                        {t("useAtLeastOneLowerCaseLetter")}
                      </CustomText>
                      <CustomText
                        textAlign="left"
                        color={
                          (passwordConditions.hasSymbol && Colors?.success) ||
                          ""
                        }
                      >
                        {passwordConditions.hasSymbol ? (
                          <Entypo name={"check"} size={16} />
                        ) : (
                          <Entypo name="cross" size={16} />
                        )}{" "}
                        {t("useAtLeastOneSymbol")}
                      </CustomText>
                      <CustomText
                        textAlign="left"
                        color={
                          (passwordConditions.isLongEnough &&
                            Colors?.success) ||
                          ""
                        }
                      >
                        {passwordConditions.isLongEnough ? (
                          <Entypo name={"check"} size={16} />
                        ) : (
                          <Entypo name="cross" size={16} />
                        )}{" "}
                        {t("beAtLeast8CharactersLong")}
                      </CustomText>
                    </View>
                  </>
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                defaultValue=""
                rules={{
                  required: t("pleaseConfirmYourPassword"),
                  validate: (value) =>
                    value == watch("password") || t("passwordsDoNotMatch"),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordComponent
                    label={t("confirmPassword")}
                    name="confirmPassword"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("reEnterYourPassword")}
                    containerStyle={
                      errors?.confirmPassword && styles.errorInput
                    }
                    errors={errors}
                    icon={
                      <FontAwesome
                        name={"user-secret"}
                        size={30}
                        color={Colors.secondary}
                        style={{ paddingVertical: 10, paddingRight: 10 }}
                      />
                    }
                  />
                )}
              />
            </>
          ) : (
            <Controller
              control={control}
              name="email"
              defaultValue=""
              rules={{
                required: t("emailIsRequired"),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: t("enterAValidEmailAddress"),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputComponent
                  label={t("email")}
                  name="email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder={t("enterYourEmail")}
                  containerStyle={errors?.email && styles.errorInput}
                  errors={errors}
                  icon={
                    <Ionicons
                      name={"mail-outline"}
                      size={30}
                      color={Colors.secondary}
                      style={{ paddingVertical: 10, paddingRight: 10 }}
                    />
                  }
                />
              )}
            />
          )}

          <Button
            isPrimary={true}
            title={
              isResetCodeSent ? t("setNewPasswords") : t("resetPasswordLink")
            }
            style={styles.forgetButtonWrapper}
            onPress={handleSubmit(onSubmit)}
          />

          <View style={styles.footerContainer}>
            <CustomText>{t("ifYouKnewYourPassword")}</CustomText>
            <TouchableOpacity
              onPress={() => router.push("/screens/auth/login")}
            >
              <CustomHeading color={Colors?.link}>{t("signIn")}</CustomHeading>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  textContainer: {
    marginVertical: 20,
  },
  forgetButtonWrapper: {
    borderRadius: 40,
    marginTop: 20,
  },
  signContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 5,
  },
  redirectButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginVertical: 20,
  },
  loginButton: {
    flexDirection: "row",
    borderWidth: 2,
    height: 50,
    borderColor: Colors.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 20,
    gap: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
