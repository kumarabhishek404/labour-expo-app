import React, { useState } from "react";
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
import {
  Feather,
  Ionicons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/Loader";
import { EarningAtom, UserAtom, WorkAtom } from "../../AtomStore/user";
import { signIn } from "../../api/user";
import { toast } from "../../hooks/toast";
import i18n from "@/utils/i18n";
import { useForm, Controller } from "react-hook-form"; // Import react-hook-form
import TextInputComponent from "@/components/TextInputWithIcon";
import PasswordComponent from "@/components/password";
import SelfieScreen from "@/components/selfie";

const LoginScreen = () => {
  const setUserDetails = useSetAtom(UserAtom);
  const setWorkDetails = useSetAtom(WorkAtom);
  const setEarnings = useSetAtom(EarningAtom);
  const [secureEntry, setSecureEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutationSignIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => signIn(data), // Pass form data to mutation
    onSuccess: (response) => {
      let user = response?.user;
      let work = user?.workDetails;
      let earnings = user?.earnings;

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
        serviceAddress: [
          "1234 Main St, New York, NY 10001",
          "Balipur, post - Shakrauli, Etah Uttar Predesh",
        ],
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
      <Loader loading={mutationSignIn?.isPending} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>{i18n.t("welcome")}</Text>
          <Text style={styles.headingText}>Back</Text>
        </View>

        <View style={styles.formContainer}>
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

          <Controller
            control={control}
            name="password"
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordComponent
                label="Password"
                name="password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter your password"
                containerStyle={errors?.password && styles.errorInput}
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

          <View style={styles.forgetPasswordContainer}>
            <TouchableOpacity
              style={styles.forgetPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* <Text style={styles.continueText}>or continue with</Text> */}

          {/* Google Login Button */}
          {/* <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity> */}

          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don't have an account?</Text>
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
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.primary,
  },
  formContainer: {
    marginTop: 20,
    // gap: 10,
  },
  input: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  textInput: {
    height: 53,
    flex: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  forgetPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  forgotPasswordText: {
    textAlign: "right",
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
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
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
  },
  signupText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
