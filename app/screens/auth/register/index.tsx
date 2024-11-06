import { ScrollView, StyleSheet, View } from "react-native";
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

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [role, setRole]: any = useState({
    name: "WORKER",
    type: "ONE",
  });
  const [skills, setSkills]: any = useState([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: any) => register(payload),
    onSuccess: () => {
      setProfilePicture("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setLocation("");
      setCountryCode("");
      setPhoneNumber("");
      setEmail("");
      setRole("WORKER");
      setSkills("");
      setPassword("");
      setConfirmPassword("");
      setStep(5);
    },
  });

  const handleSubmit = async () => {
    const formData: any = new FormData();
    const imageName = profilePicture.split("/").pop();
    formData.append("profileImage", {
      uri: profilePicture,
      type: "image/jpeg",
      name: imageName,
    });

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("address", address);
    formData.append("location", JSON.stringify(location ?? {}));
    formData.append("countryCode", countryCode);
    formData.append("mobile", phoneNumber);
    formData.append("email", email);
    formData.append("role", role?.name);
    formData.append("gender", gender);
    formData.append("dateOfBirth", moment(dateOfBirth).format("DD-MM-YYYY"));
    formData.append("skills", skills);
    formData.append("password", password);

    mutationRegister.mutate(formData);
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            setProfilePicture={setProfilePicture}
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
