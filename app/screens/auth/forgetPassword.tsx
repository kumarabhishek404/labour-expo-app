import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { Link, router, Stack } from "expo-router";
import { FontAwesome5, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/Loader";
import { EarningAtom, UserAtom, WorkAtom } from "../../AtomStore/user";
import { forgotPassword, resetPassword, signIn } from "../../api/user";
import { toast } from "../../hooks/toast";
import i18n from "@/utils/i18n";

const LoginScreen = () => {
  const setUserDetails = useSetAtom(UserAtom);
  const setWorkDetails = useSetAtom(WorkAtom);
  const setEarnings = useSetAtom(EarningAtom);
  const [isResetCodeSent, setIsResetCodeSent] = useState(false);
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mutationForgetPassword = useMutation({
    mutationKey: ["forgetPassword"],
    mutationFn: () => forgotPassword({ email: email }),
    onSuccess: (response) => {
      console.log("Response ---", response);
      if (response?.status === 200) {
        setIsResetCodeSent(true);
      }
    },
  });

  const mutationSetPassword = useMutation({
    mutationKey: ["setPassword"],
    mutationFn: () =>
      resetPassword({
        email: email,
        resetToken: resetCode,
        password: password,
      }),
    onSuccess: (response) => {
      console.log();
      if (response?.status === 200) {
        setIsResetCodeSent(false);
        router.push("/screens/auth/login");
      }
    },
  });

  const handleOnChangeConfirmPassword = (text: any) => {
    if (password !== text) {
      setErrorMessage("Password do not matched");
      setConfirmPassword(text);
    } else {
      setErrorMessage("");
      setConfirmPassword(text);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={mutationForgetPassword?.isPending || mutationSetPassword?.isPending} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Reset Your</Text>
          <Text style={styles.headingText}>Password</Text>
        </View>
        <View style={styles.formContainer}>
          {isResetCodeSent ? (
            <>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name={"user-secret"}
                  size={30}
                  color={Colors.secondary}
                />
                <TextInput
                  value={resetCode}
                  style={styles.textInput}
                  placeholder="Enter your reset code"
                  //   keyboardType="numeric"
                  placeholderTextColor={Colors.secondary}
                  onChangeText={(code) => {
                    setResetCode(code.replace(/[^0-9]/g, ""));
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <SimpleLineIcons
                  name={"lock"}
                  size={30}
                  color={Colors.secondary}
                />
                <TextInput
                  value={password}
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.secondary}
                  secureTextEntry={secureEntery}
                  onChangeText={(password) => {
                    setPassword(password);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSecureEntery((prev) => !prev);
                  }}
                >
                  <SimpleLineIcons
                    name={"eye"}
                    size={20}
                    color={Colors.secondary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <SimpleLineIcons
                  name={"lock"}
                  size={30}
                  color={Colors.secondary}
                />
                <TextInput
                  value={confirmPassword}
                  style={styles.textInput}
                  placeholder="Re Enter your password"
                  placeholderTextColor={Colors.secondary}
                  secureTextEntry={secureEntery}
                  onChangeText={(password) => {
                    handleOnChangeConfirmPassword(password);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSecureEntery((prev) => !prev);
                  }}
                >
                  <SimpleLineIcons
                    name={"eye"}
                    size={20}
                    color={Colors.secondary}
                  />
                </TouchableOpacity>
              </View>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </>
          ) : (
            <View style={styles.inputContainer}>
              <Ionicons
                name={"mail-outline"}
                size={30}
                color={Colors.secondary}
              />
              <TextInput
                value={email}
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={Colors.secondary}
                keyboardType="email-address"
                onChangeText={(email) => {
                  setEmail(email);
                }}
              />
            </View>
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
            onPress={() =>
              isResetCodeSent
                ? mutationSetPassword.mutate()
                : mutationForgetPassword.mutate()
            }
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
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.primary,
    // fontFamily: Fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
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
    fontWeight: "600",
    alignSelf: "flex-end",
    marginVertical: 10,
    textDecorationLine: "underline",
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
    // fontFamily: Fonts.Bold,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginBottom: 10,
  },
});
