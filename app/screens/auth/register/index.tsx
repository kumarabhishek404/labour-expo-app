import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import axios from "axios";
// import { useStateContext } from "../context/context";
// import UsersClient from "../api/user";
import Loader from "@/components/commons/Loader";
import { toast } from "@/app/hooks/toast";
import FirstScreen from "./first";
import Step1 from "../../../../assets/step1.jpg";
import SecondScreen from "./second";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import { register } from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import SelfieScreen from "@/components/inputs/Selfie";
import FifthScreen from "./fifth";
import moment from "moment";

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
      // setLabourType("ONE");
      setSkills("");
      setPassword("");
      setConfirmPassword("");
      setStep(5);
    },
    // onError: (err) => {
    //   console.error("Error while logging in user - ", err);
    //   toast.error("Login failed");
    // },
  });

  const handleSubmit = async () => {
    const formData: any = new FormData();

    console.log("Image--", profilePicture);
    
    const imageName = profilePicture.split("/").pop();
    formData.append("profileImage", {
      uri: profilePicture,
      type: "image/jpeg",
      name: imageName,
    });

    const payload = {
      profilePicture: profilePicture,
      firstName: firstName,
      lastName: lastName,
      address: address,
      location: location,
      countryCode: countryCode,
      mobileNumber: phoneNumber,
      email: email,
      role: role,
      gender: gender,
      dateOfBirth: dateOfBirth,
      skills: skills,
      password: password,
    };
    
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("address", address);
    // formData.append("location", JSON.stringify(location ?? {}));
    // formData.append("countryCode", countryCode);
    formData.append("mobile", phoneNumber);
    formData.append("email", email);
    formData.append("role", role?.name);
    formData.append("gender", gender);
    formData.append("dateOfBirth", moment(dateOfBirth).format("DD-MM-YYYY"));
    formData.append("skills", skills);
    formData.append("password", password);

console.log("Formdata --", formData);


    mutationRegister.mutate(formData);
  };

  const handleRegister = () => {
    const formData: any = new FormData();
    const imageUri: any = profilePicture;
    const imageName = imageUri.split("/").pop();
    formData.append("profilePicture", {
      uri: imageUri,
      type: "image/jpeg",
      name: imageName,
    });

    const payload = {
      profilePicture: profilePicture,
      firstName: firstName,
      lastName: lastName,
      address: address,
      location: location,
      countryCode: countryCode,
      mobileNumber: phoneNumber,
      email: email,
      role: role,
      gender: gender,
      dateOfBirth: dateOfBirth,
      skills: skills,
      password: password,
    };

    mutationRegister.mutate(payload);
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            // profilePicture={profilePicture}
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
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Make new</Text>
          <Text style={styles.headingText}>account</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles?.inputContainer}>{renderFormComponents()}</View>
        </View>
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
  headingText: {
    fontSize: 32,
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
  },
  formContainer: {
    paddingVertical: 20,
  },
  inputContainer: {
    // height: 400,
  },
});
