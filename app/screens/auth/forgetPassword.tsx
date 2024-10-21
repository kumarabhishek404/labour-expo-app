import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Link, router, Stack } from "expo-router";
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

interface ForgetPasswordScreenProps {}

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
    hasSymbol: false,
    isLongEnough: false,
  });

  const checkPasswordConditions = (password: any) => {
    const conditions = {
      hasNumber: /\d/.test(password),
      hasAlphabet: /[A-Za-z]/.test(password),
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
    <ScrollView style={styles?.container}>
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
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Reset Your</Text>
          <Text style={styles.headingText}>Password</Text>
        </View>
        <View style={styles.formContainer}>
          {!isResetCodeSent ? (
            <>
              <Controller
                control={control}
                name="resetToken"
                defaultValue=""
                rules={{ required: "Reset code is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    label="Reset Password Code"
                    name="resetToken"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your reset password code"
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
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "You have to full fill all the following conditions",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <PasswordComponent
                      label="Password"
                      name="password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text: any) => {
                        onChange(text);
                        checkPasswordConditions(text);
                      }}
                      placeholder="Enter your password"
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
                    <View style={styles.conditionsContainer}>
                      <Text
                        style={[
                          styles.conditionText,
                          passwordConditions.hasNumber && styles?.successText,
                        ]}
                      >
                        {passwordConditions.hasNumber ? (
                          <Entypo name={"check"} size={18} />
                        ) : (
                          <Entypo name="cross" size={18} />
                        )}{" "}
                        Use at least one number (0-9)
                      </Text>
                      <Text
                        style={[
                          styles.conditionText,
                          passwordConditions.hasAlphabet && styles?.successText,
                        ]}
                      >
                        {passwordConditions.hasAlphabet ? (
                          <Entypo name={"check"} size={18} />
                        ) : (
                          <Entypo name="cross" size={18} />
                        )}{" "}
                        Use at least one lower-case letter (a-z)
                      </Text>
                      <Text
                        style={[
                          styles.conditionText,
                          passwordConditions.hasSymbol && styles?.successText,
                        ]}
                      >
                        {passwordConditions.hasSymbol ? (
                          <Entypo name={"check"} size={18} />
                        ) : (
                          <Entypo name="cross" size={18} />
                        )}{" "}
                        Use at least one symbol (e.g., !@#$%^&*)
                      </Text>
                      <Text
                        style={[
                          styles.conditionText,
                          passwordConditions.isLongEnough &&
                            styles?.successText,
                        ]}
                      >
                        {passwordConditions.isLongEnough ? (
                          <Entypo name={"check"} size={18} />
                        ) : (
                          <Entypo name="cross" size={18} />
                        )}{" "}
                        Be at least 8 characters long
                      </Text>
                    </View>
                  </>
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                defaultValue=""
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value == watch("password") || "Passwords do not match",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordComponent
                    label="Confirm Password"
                    name="confirmPassword"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Re Enter your password"
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
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputComponent
                  label="Email"
                  name="email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your email"
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
          <View style={styles.signContainer}>
            <Text style={styles.accountText}>If you knew your password?</Text>
            <TouchableOpacity
              onPress={() => router.push("/screens/auth/login")}
            >
              <Text style={styles.forgotPasswordText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.forgetButtonWrapper}
          >
            <Text style={styles.loginText}>
              {isResetCodeSent ? "Set New Passwords" : "Reset Password Link"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don't have account!</Text>
            <Link href="/screens/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
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
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.primary,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
    alignSelf: "flex-end",
    marginVertical: 10,
    textDecorationLine: "underline",
    color: Colors.black,
    fontSize: 20,
    fontWeight: "500",
  },
  forgetButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: Fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    // fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    // fontFamily: Fonts.SemiBold,
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
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.primary,
    // fontFamily: Fonts.Regular,
  },
  redirectButtonWrapper: {
    // width: '100%',
    // display: 'flex',
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
  signupText: {
    color: Colors.black,
    textDecorationLine: "underline",
    fontSize: 20,
    fontWeight: "500",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginBottom: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  conditionsContainer: {},
  conditionText: {
    fontSize: 13,
    marginBottom: 6,
  },
  successText: {
    color: "green",
  },
});
