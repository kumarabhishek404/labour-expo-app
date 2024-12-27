import { ScrollView, StyleSheet, View, Platform } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Loader from "@/components/commons/Loader";
import FirstScreen from "./first";
import SecondScreen from "./second";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import { register } from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import FifthScreen from "./fifth";
import moment from "moment";
import CustomHeading from "@/components/commons/CustomHeading";
import { toast } from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]: any = useState("WORKER");
  const [skills, setSkills]: any = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: any) => register(payload),
    onSuccess: () => {
      console.log("onSuccess----");
      setProfilePicture("");
      setFirstName("");
      setLastName("");
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
      setDateOfBirth(new Date());
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
    if (
      !firstName ||
      !lastName ||
      !address ||
      !phoneNumber ||
      !email
    ) {
      toast.error(t("pleaseFillAllFields"));
      return;
    }
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("address", address);
    formData.append("location", JSON.stringify(cleanLocation));
    formData.append("countryCode", countryCode);
    formData.append("mobile", phoneNumber);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("dateOfBirth", moment(dateOfBirth).format("DD-MM-YYYY"));
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
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            gender={gender}
            setGender={setGender}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
          />
        );
      case 2:
        return (
          <SecondScreen
            setStep={setStep}
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            email={email}
            setEmail={setEmail}
          />
        );
      case 3:
        return (
          <ThirdScreen
            setStep={setStep}
            role={role}
            setRole={setRole}
            selectedInterests={skills}
            setSelectedInterests={setSkills}
          />
        );

      case 4:
        return (
          <FourthScreen
            setStep={setStep}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        );

      case 5:
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
    <ScrollView style={styles?.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={mutationRegister?.isPending} />
      <View style={styles.container}>
        {step === 5 ? (
          <View style={styles.textContainer}>
            <CustomHeading textAlign="left" fontSize={22}>
              Click selfie
            </CustomHeading>
            <CustomHeading textAlign="left" fontSize={22}>
              to verify
            </CustomHeading>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <CustomHeading textAlign="left" fontSize={22}>
              Make new
            </CustomHeading>
            <CustomHeading textAlign="left" fontSize={22}>
              account
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
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
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
