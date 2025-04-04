import { ScrollView, StyleSheet, View, Platform } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import FirstScreen from "./first";
import ThirdScreen from "./third";
import FourthScreen from "./second";
import FifthScreen from "./fourth";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import CustomHeading from "@/components/commons/CustomHeading";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AUTH from "@/app/api/auth";

const SignupScreen = () => {
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null); // Store user ID for later updates
  const [name, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState();
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  const [mobileNumberExist, setMobileNumberExist] = useState("notSet");

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
      setStep((prev) => prev + 1); // Move to next step
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      TOAST?.error(error?.message || t("updateFailed"));
    },
  });

  // Handles form submission on each step
  const handleSubmit = async () => {
    if (step === 1) {
      if (!name || !phoneNumber) {
        TOAST?.error(t("pleaseFillAllFields"));
        return;
      }
      const payload: any = {
        name: name,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        locale: JSON.stringify(locale),
      };
      mutationRegister.mutate(payload);
      // } else {
      // const formData: any = new FormData();
      // const cleanLocation: any = location
      //   ? { latitude: location?.latitude, longitude: location?.longitude }
      //   : {};

      // if (profilePicture) {
      //   const imageName = profilePicture.split("/").pop();
      //   formData.append("profileImage", {
      //     uri:
      //       Platform.OS === "android"
      //         ? profilePicture
      //         : profilePicture.replace("file://", ""),
      //     type: "image/jpeg",
      //     name: imageName || "photo.jpg",
      //   });
      // }

      // formData.append("address", address);
      // formData.append("locale", JSON.stringify(locale));
      // formData.append("location", JSON.stringify(cleanLocation));
      // formData.append("email", email);
      // formData.append("gender", gender);
      // formData.append(
      //   "dateOfBirth",
      //   dateOfBirth ? moment(dateOfBirth).format("DD-MM-YYYY") : ""
      // );
      // formData.append("skills", JSON.stringify(skills));
      // formData.append("password", password);

      // mutationUpdateProfile.mutate(formData);
    }
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return <FirstScreen />;

      // case 2:
      //   return (
      //     <SecondScreen
      //       setStep={setStep}
      //       address={address}
      //       setAddress={setAddress}
      //       location={location}
      //       setLocation={setLocation}
      //       email={email}
      //       setEmail={setEmail}
      //       dateOfBirth={dateOfBirth}
      //       setDateOfBirth={setDateOfBirth}
      //       gender={gender}
      //       setGender={setGender}
      //       handleUpdate={handleSubmit}
      //     />
      //   );

      case 2:
        return <ThirdScreen />;

      case 3:
        return <FourthScreen />;

      case 4:
        return <FifthScreen />;

      default:
        break;
    }
  };

  return (
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
