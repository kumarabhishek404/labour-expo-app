import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import FourthScreen from "./second";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import CustomHeading from "@/components/commons/CustomHeading";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import AUTH from "@/app/api/auth";
import UpdateUserSkillsScreen from "./fourth";
import UploadProfilePictureScreen from "./fifth";

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);

  // Register User (Step 1)
  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload) => AUTH.register(payload),
    onSuccess: (data) => {
      console.log("User registered:", data);
      setUserId(data?.id); // Store user ID
      setStep(2); // Move to the next step
    },
    onError: (error) => {
      console.error("Registration error:", error);
      TOAST?.error(error?.message || t("registrationFailed"));
    },
  });

  // Update Profile (Step 2-4)
  const mutationUpdateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: object) =>
      USER.updateUserById({
        _id: userId,
        ...payload,
      }),
    onSuccess: () => {
      console.log("Profile updated successfully");
      setStep((prev) => prev + 1);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      TOAST?.error(error?.message || t("updateFailed"));
    },
  });

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return <UploadProfilePictureScreen />;

      case 2:
        return <FourthScreen />;

      case 3:
        return <UpdateUserSkillsScreen />;

      default:
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Loader
          loading={
            mutationRegister?.isPending || mutationUpdateProfile?.isPending
          }
        />
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <CustomHeading textAlign="left" baseFont={22}>
              {step === 5 ? t("clickSelfie") : t("hello")}
            </CustomHeading>
            <CustomHeading textAlign="left" baseFont={22}>
              {step === 5 ? t("toVerify") : t("makeNewAccount")}
            </CustomHeading>
          </View>
          <View style={styles.formContainer}>{renderFormComponents()}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  textContainer: {
    marginVertical: 20,
  },
  formContainer: {
    paddingVertical: 10,
  },
});
