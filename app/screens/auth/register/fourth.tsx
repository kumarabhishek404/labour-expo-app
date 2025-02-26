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
import { isEmptyObject } from "@/constants/functions";
import AddAddressModal from "@/app/screens/location/addAddress";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

const FifthScreen = () => {
  const [isAddAddress, setIsAddress] = useState(false);
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const { userId } = useLocalSearchParams();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      profilePicture: "",
      address: "",
    },
  });

  const mutationUpdateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER.updateUserById(payload),
    onSuccess: () => {
      console.log("Profile updated successfully");
      router?.push("/screens/auth/login");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });

  const handleAddAddress = (data: any) => {
    setIsAddress(true);
  };

  const handleProfilePictureSubmit = async (data: any) => {
    if (
      !data?.profilePicture ||
      typeof data.profilePicture !== "string" ||
      data.profilePicture.trim() === ""
    ) {
      TOAST?.error(t("pleaseSelectAProfilePicture"));
      return;
    }

    const formData: any = new FormData();
    const imageName = data?.profilePicture.split("/").pop();
    formData.append("profileImage", {
      uri:
        Platform.OS === "android"
          ? data?.profilePicture
          : data?.profilePicture.replace("file://", ""),
      type: "image/jpeg",
      name: imageName || "photo.jpg",
    });
    formData?.append("_id", userId);

    mutationUpdateProfile.mutate(formData);
  };

  console.log("Wathch image --", watch("profilePicture"));

  return (
    <View style={styles?.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationUpdateProfile?.isPending} />
      <CustomHeading baseFont={25} style={styles.heading}>
        {t("updateYourSkillsAndRole")}
      </CustomHeading>
      <Controller
        control={control}
        name="profilePicture"
        defaultValue=""
        rules={{
          required: t("profilePictureIsRequired"),
        }}
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
          isPrimary={false}
          title={t("back")}
          onPress={() => router?.back()}
          style={{ width: "35%", paddingHorizontal: 6 }}
        />
        <Button
          isPrimary={true}
          title={t("saveProfilePicture")}
          onPress={handleSubmit(handleAddAddress)}
          style={{ width: "60%", paddingHorizontal: 8 }}
        />
      </View>

      <AddAddressModal
        userId={userId}
        visible={isAddAddress}
        onClose={() => {
          setDrawerState({
            visible: false,
            title: "",
            content: () => null,
            primaryButton: null,
            secondaryButton: null,
          });
          setIsAddress(false);
        }}
        onAfterSuccess={handleSubmit(handleProfilePictureSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
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
    marginBottom: 20,
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

export default FifthScreen;
