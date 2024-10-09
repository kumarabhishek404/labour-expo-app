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
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/Loader";
import { EarningAtom, UserAtom, WorkAtom } from "../../AtomStore/user";
import { signIn } from "../../api/user";
import { toast } from "../../hooks/toast";
import i18n from "@/utils/i18n";

const LoginScreen = () => {
  const setUserDetails = useSetAtom(UserAtom);
  const setWorkDetails = useSetAtom(WorkAtom);
  const setEarnings = useSetAtom(EarningAtom);
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutationSignIn = useMutation({
    mutationKey: ["login"],
    mutationFn: () => {
      let payload = {
        email: email,
        password: password,
      };
      return signIn(payload);
    },
    onSuccess: (response) => {
      // setUser(response?.user)
      // setToken(response?.token)
      let user = response?.user;
      let work = user?.workDetails;
      let earnings = user?.earnings;
      console.log("Workrrrrrr---", user?.earnings);

      setUserDetails({
        isAuth: true,
        _id: user?._id,
        firstName: user?.firstName,
        middleName: user?.middleName,
        lastName: user?.lastName,
        mobileNumber: user?.mobileNumber,
        likedJobs: user?.likedJobs,
        likedEmployees: user?.likedEmployees,
        email: user?.email,
        address: user?.address,
        avatar: user?.avatar,
        role: user?.role,
        roleType: user?.labourType,
        token: response?.token,
        serviceAddress: ["1234 Main St, New York, NY 10001", "Balipur, post - Shakrauli, Etah Uttar Predesh"],
      });
      setWorkDetails({
        total: work?.total,
        completed: work?.completed,
        cancelled: work?.cancelled,
        upcoming: work?.upcoming,
      });
      setEarnings({
        work: earnings?.work,
        rewards: earnings?.rewards,
      });
      toast.success("Logged in successfully!");
      console.log("Response while loging a user - ", response);
    },
    onError: (err) => {
      console.error("error while loging a user - ", err);
    },
  });

  const handleForgotPassword = () => {
    router.push("/screens/auth/forgetPassword");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={mutationSignIn?.isPending} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>{i18n.t("welcome")}</Text>
          <Text style={styles.headingText}>Back</Text>
        </View>
        <View style={styles.formContainer}>
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
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={Colors.secondary} />
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
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => mutationSignIn.mutate()}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don't have an account!</Text>
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
    width: 117,
    textAlign: "right",
    alignSelf: "flex-end",
    color: Colors.primary,
    marginVertical: 10,
  },
  loginButtonWrapper: {
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
});
