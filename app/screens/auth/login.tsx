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
  EarningAtom,
  ServiceAtom,
  SpentAtom,
  UserAtom,
  WorkAtom,
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
        status: user?.status || "",
        firstName: user?.firstName,
        middleName: user?.middleName,
        lastName: user?.lastName,
        mobileNumber: user?.mobileNumber,
        email: user?.email,
        gender: user?.gender || "",
        dateOfBirth: user?.dateOfBirth || "",
        skills: user?.skills,
        location: user?.location || {},
        address: user?.address,
        profilePicture: user?.profilePicture,
        coverPicture: user?.coverPicture || "",
        role: user?.role,
        description: user?.description || "",
        token: response?.token,
        rating: user?.rating || "",
        reviews: user?.reviews || {},
        alternateMobile: user?.alternateMobile || "",
        alternateEmail: user?.alternateEmail || "",
        savedAddresses: user?.savedAddresses || [],
        savedLocation: user?.savedLocation || [],
        likedServices: user?.likedJobs || [],
        likedEmployers: user?.likedEmployers || [],
        likedWorkers: user?.bookmarkedWorkers || [],
        likedMediators: user?.likedMediators || [],
        appliedServices: user?.appliedServices || [],
        likedBy: user?.likedBy || [],
        bookedBy: user?.bookedBy || [],
        myServices: user?.myServices || [],
        myBookings: user?.myBookings || [],
        booked: user?.booked || [],
        createdAt: user?.createdAt || "",
        updatedAt: user?.updatedAt || "",
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
      if (user?.status === "inactive" || user?.status === "submitted") {
        setIsAccountInactive(true);
        router.replace("/(tabs)/profile");
      } else {
        setIsAccountInactive(false);
        router.replace("/(tabs)");
      }
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
          <CustomHeading textAlign="left" fontSize={24}>
            Hello,
          </CustomHeading>
          <CustomHeading textAlign="left" fontSize={24}>
            {t("welcome")}
          </CustomHeading>
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
              <CustomHeading fontWeight="normal" color={Colors?.link}>
                Forgot Password?
              </CustomHeading>
            </TouchableOpacity>
          </View>

          <Button
            isPrimary={true}
            title="Login"
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButtonWrapper}
          />

          <View style={styles.footerContainer}>
            <CustomText>Don&#39;t have an account?</CustomText>
            <Link href="/screens/auth/register" asChild>
              <TouchableOpacity>
                <CustomHeading color={Colors?.link}>Sign Up</CustomHeading>
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
