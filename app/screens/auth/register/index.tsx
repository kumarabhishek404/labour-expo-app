import { ScrollView, StyleSheet, View, Platform, Image } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Loader from "@/components/commons/Loader";
import FirstScreen from "./first";
import SecondScreen from "./second";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import FifthScreen from "./fifth";
import moment from "moment";
import CustomHeading from "@/components/commons/CustomHeading";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import Step2 from "../../../../assets/step2.jpg";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

const SignupScreen = () => {
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const [step, setStep] = useState(1);
  const [name, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]: any = useState("WORKER");
  const [skills, setSkills]: any = useState([]);
  const [previousRole, setPreviousRole] = useState("WORKER");
  const [mobileNumberExist, setMobileNumberExist] = useState("notSet");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: any) => USER?.register(payload),
    onSuccess: () => {
      console.log("onSuccess----");
      setProfilePicture("");
      setFirstName("");
      setAddress("");
      setLocation({});
      setCountryCode("+91");
      setPhoneNumber("");
      setEmail("");
      setRole("WORKER");
      setSkills([]);
      setPassword("");
      setConfirmPassword("");
      setGender("");
      setDateOfBirth("");
      setStep(1);
    },
  });

  const handleSubmit = async (data: any) => {
    const formData: any = new FormData();
    if (data?.profilePicture) {
      const imageName = data?.profilePicture.split("/").pop();
      try {
        formData.append("profileImage", {
          uri:
            Platform.OS === "android"
              ? data?.profilePicture
              : data?.profilePicture.replace("file://", ""),
          type: "image/jpeg",
          name: imageName || "photo.jpg",
        });
      } catch (error) {
        console.error("Error appending image:", error);
      }
    }

    const cleanLocation = location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : {};
    if (!name || !role || !countryCode || !phoneNumber) {
      TOAST?.showToast?.error(t("pleaseFillAllFields"));
      return;
    }

    if (role !== "EMPLOYER" && skills?.length === 0) {
      TOAST?.showToast?.error(t("workerMustHaveAtLeasOneSkill"));
      return;
    }

    formData.append("name", name);
    formData.append("address", address);
    formData.append("locale", JSON.stringify(locale));
    formData.append("location", JSON.stringify(cleanLocation));
    formData.append("countryCode", countryCode);
    formData.append("mobile", phoneNumber);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append(
      "dateOfBirth",
      dateOfBirth && moment(dateOfBirth)?.format("DD-MM-YYYY")
    );
    formData.append("skills", JSON.stringify(skills));
    formData.append("password", password);
    console.log("formData----", formData);

    try {
      mutationRegister.mutate(formData);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            mobileNumberExist={mobileNumberExist}
            setMobileNumberExist={setMobileNumberExist}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            name={name}
            setFirstName={setFirstName}
          />
        );
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
      //     />
      //   );
      case 2:
        return (
          <ThirdScreen
            setStep={setStep}
            role={role}
            setRole={setRole}
            previousRole={previousRole}
            setPreviousRole={setPreviousRole}
            selectedInterests={skills}
            setSelectedInterests={setSkills}
          />
        );

      case 3:
        return (
          <FourthScreen
            setStep={setStep}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        );

      case 4:
        return (
          <FifthScreen
            setStep={setStep}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            handleRegister={handleSubmit}
          />
        );

      default:
        break;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={mutationRegister?.isPending} />
      <View style={styles.container}>
        {step === 4 ? (
          <View style={styles.textContainer}>
            <CustomHeading textAlign="left" baseFont={22}>
              {t("clickSelfie")}
            </CustomHeading>
            <CustomHeading textAlign="left" baseFont={22}>
              {t("toVerify")}
            </CustomHeading>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <CustomHeading textAlign="left" baseFont={22}>
              {t("hello")}
            </CustomHeading>
            <CustomHeading textAlign="left" baseFont={22}>
              {t("makeNewAccount")}
            </CustomHeading>
          </View>
        )}
        <View style={styles.formContainer}>{renderFormComponents()}</View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginTop: 30,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  formContainer: {
    paddingVertical: 10,
  },
});
