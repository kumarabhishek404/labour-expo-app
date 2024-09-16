import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/Loader";
import { UserAtom } from "../AtomStore/user";
import { signIn } from "../api/user";

const LoginScreen = () => {
  const [_, setUserDetails] = useAtom(UserAtom);
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);

  let payload = {
    email: email,
    password: password,
  };

  const { isLoading, data: response, } = useQuery({
    queryKey: ["login", payload],
    queryFn: () => signIn(payload),
    retry: false,
    enabled: !!email && !!password && !!enabled,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response?.user) {
      setUserDetails({
        isAuth: true,
        _id: response?.user?._id,
        firstName: response?.user?.firstName,
        middleName: response?.user?.middleName,
        lastName: response?.user?.lastName,
        mobileNumber: response?.user?.mobileNumber,
        likedJobs: response?.user?.likedJobs,
        likedEmployees: response?.user?.likedEmployees,
        email: response?.user?.email,
        address: response?.user?.address,
        profilePic: response?.user?.avatar,
        role: response?.user?.role,
        token: response?.token,
        serviceAddress: ["Balipur, post - Shakrauli, Etah Uttar Predesh"],
      });
      // setWorkDetails({
      //   workDetails: {
      //     total: 0,
      //     completed: 0,
      //     upcoming: 0,
      //     cancelled: 0,
      //   },
      //   serviceDetails: {
      //     total: 0,
      //     completed: 0,
      //     upcoming: 0,
      //     cancelled: 0,
      //   },
      //   earnings: {
      //     work: 0,
      //     rewards: 0,
      //   },
      //   spent: {
      //     work: 0,
      //     tip: 0,
      //   },
      // });
    }
  }, [response]);

  const handleForgotPassword = () => {};

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Welcome</Text>
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
                setEnabled(false);
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
                setEnabled(false);
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
            onPress={() => setEnabled(true)}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Already have an account!</Text>
            <Link href="/auth/register" asChild>
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
    marginLeft: 10
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
