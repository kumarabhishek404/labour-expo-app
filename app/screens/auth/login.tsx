import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAtom, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { Link, router, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/commons/Loader";
import {
  EarningAtom,
  ServiceAtom,
  SpentAtom,
  UserAtom,
  WorkAtom,
} from "../../AtomStore/user";
import { signIn, updateUserById } from "../../api/user";
import { toast } from "../../hooks/toast";
import i18n from "@/utils/i18n";
import { useForm, Controller } from "react-hook-form";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PasswordComponent from "@/components/inputs/Password";
import * as Location from "expo-location"; // Importing Location module
import { fetchCurrentLocation, isEmptyObject } from "@/constants/functions";

const LoginScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const setWorkDetails = useSetAtom(WorkAtom);
  const setServiceDetails = useSetAtom(ServiceAtom);
  const setEarnings = useSetAtom(EarningAtom);
  const setSpents = useSetAtom(SpentAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      let work = user?.workDetails;
      let service = user?.serviceDetails;
      let earnings = user?.earnings;
      let spents = user?.spent;

      // Set user details in global state
      setUserDetails({
        isAuth: true,
        _id: user?._id,
        firstName: user?.firstName,
        middleName: user?.middleName,
        lastName: user?.lastName,
        mobileNumber: user?.mobileNumber,
        likedServices: user?.likedJobs || [],
        likedWorkers: user?.bookmarkedWorkers || [],
        likedMediators: user?.likedMediators || [],
        email: user?.email,
        skills: user?.skills,
        location: user?.location || {},
        address: user?.address,
        profilePicture: user?.profilePicture,
        role: user?.role,
        token: response?.token,
        serviceAddress: [],
      });

      setWorkDetails({
        total: work?.total,
        completed: work?.completed,
        cancelled: work?.cancelled?.byEmployer + work?.cancelled?.byWorker,
        upcoming: work?.upcoming || 0,
      });

      setServiceDetails({
        total: service?.total,
        completed: service?.completed,
        cancelled: work?.cancelled?.byEmployer + work?.cancelled?.byWorker,
      });

      setEarnings({
        work: earnings?.work,
        rewards: earnings?.rewards,
      });

      setSpents({
        work: spents?.work,
        tip: spents?.tip,
      });

      toast.success("Logged in successfully!");

      // Condition to fetch location if location key is empty or has latitude 0
      if (
        !user?.location ||
        // isEmptyObject(user?.location) ||
        user?.location?.latitude === 0
      ) {
        const locationData = await fetchCurrentLocation();
        if (locationData) {
          setUserDetails((prevDetails: any) => ({
            ...prevDetails,
            location: locationData.location,
            // address: locationData.address,
          }));
          mutationUpdateProfileInfo?.mutate({
            location: locationData.location,
            // address: locationData.address,
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
          <Text style={styles.headingText}>Hello,</Text>
          <Text style={styles.headingText}>{i18n.t("welcome")}</Text>
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
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

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
  },
  input: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
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

export default LoginScreen;
