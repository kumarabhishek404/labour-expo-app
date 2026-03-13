import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Controller, useForm } from "react-hook-form";
import SelfieScreen from "@/components/inputs/Selfie";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { router, Stack, useLocalSearchParams } from "expo-router";
import CustomHeading from "@/components/commons/CustomHeading";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Loader from "@/components/commons/Loaders/Loader";
import { saveToken } from "@/utils/authStorage";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import {
  savePendingProfileUpload,
  uploadPendingProfileImage,
} from "@/utils/backgroundImageUpload";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import CustomText from "@/components/commons/CustomText";

const UploadProfilePictureScreen = () => {
  const { userId, role, skills } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useAtom(Atoms.UserAtom);
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      profilePicture: "",
    },
  });

  const mutationFinishRegistration = useMutation({
    mutationKey: ["finishRegistration"],
    mutationFn: (payload: any) => USER.updateUserById(payload),
    onSuccess: async (response: any) => {
      const token = response?.data?.token;
      const user = response?.data?.data;
      await saveToken(token);
      setUserDetails({ isAuth: true, ...user });

      if (user?._id) {
        try {
          await PUSH_NOTIFICATION.registerForPushNotificationsAsync(
            true,
            user._id,
          );
        } catch (err) {
          console.error("Push notification registration failed: ", err);
        }
      }

      router.replace("/(tabs)");
      uploadPendingProfileImage();
    },
    onError: (error) => {
      console.error("Error finishing registration: ", error);
    },
  });

  const handleProfilePictureSubmit = async (data: any) => {
    try {
      const parsedSkills = skills ? JSON.parse(skills as string) : [];

      // If user selected image
      if (data?.profilePicture) {
        let uri =
          Platform.OS === "android"
            ? data.profilePicture
            : data.profilePicture.replace("file://", "");

        await savePendingProfileUpload({
          uri,
          userId,
        });
      }

      mutationFinishRegistration.mutate({
        _id: userId,
        role,
        skills: parsedSkills,
      });
    } catch (error) {
      console.error("Error submitting profile picture:", error);
      TOAST?.error(t("somethingWentWrong"));
    }
  };

  return (
    <View style={styles?.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* <Loader loading={mutationUpdateProfile?.isPending} /> */}
      <CustomHeading baseFont={25} style={styles.heading}>
        {t("takeSelfieForRegistration")}
      </CustomHeading>
{/* 
      <CustomText
        baseFont={14}
        color={Colors.primary}
        style={{ marginBottom: 10 }}
      >
        {t("profilePictureOptional")}
      </CustomText> */}
      <CustomText
        baseFont={16}
        fontWeight="600"
        color={Colors.primary}
        style={{ marginBottom: 15 }}
      >
        {t("selfieHelpsWork")}
      </CustomText>
      <Controller
        control={control}
        name="profilePicture"
        defaultValue=""
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelfieScreen
            name="profilePicture"
            profilePicture={value}
            setProfilePicture={onChange}
            onBlur={onBlur}
            errors={errors}
          />
        )}
      />
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={true}
          title={t("back")}
          onPress={() => router?.back()}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
          style={{ width: "35%", paddingHorizontal: 6 }}
        />
        <Button
          isPrimary={true}
          title={
            watch("profilePicture")
              ? t("saveProfilePicture")
              : t("skipAndContinue")
          }
          onPress={handleSubmit(handleProfilePictureSubmit)}
          style={{ width: "60%", paddingHorizontal: 8 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors?.fourth,
    paddingVertical: 0,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },
  heading: {
    marginBottom: 10,
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },

  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
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

export default UploadProfilePictureScreen;
