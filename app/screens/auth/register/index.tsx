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
import Loader from "@/components/Loader";
import { toast } from "@/app/hooks/toast";
import FirstScreen from "./first";
import Step1 from "../../../../assets/step1.jpg";
import SecondScreen from "./second";
import ThirdScreen from "./third";
import FourthScreen from "./fourth";
import { register } from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import SelfieScreen from "@/components/selfie";
import FifthScreen from "./fifth";

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [role, setRole]: any = useState("WORKER");
  const [labourType, setLabourType]: any = useState("ONE");
  const [skills, setSkills]: any = useState([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: any) => register(payload),
    onSuccess: () => {
      setAvatar("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setLocation("");
      setCountryCode("");
      setPhoneNumber("");
      setEmail("");
      setRole("WORKER");
      setLabourType("ONE");
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

  const handleRegister = () => {
    const formData: any = new FormData();
    const imageUri: any = avatar;
    const imageName = imageUri.split("/").pop();
    formData.append("avatar", {
      uri: imageUri,
      type: "image/jpeg",
      name: imageName,
    });

    const payload = {
      avatar: avatar,
      firstName: firstName,
      lastName: lastName,
      address: address,
      location: location,
      countryCode: countryCode,
      mobileNumber: phoneNumber,
      email: email,
      role: role,
      labourType: labourType,
      skills: skills,
      password: password,
    };
    console.log("Payload---", payload);
    mutationRegister.mutate(payload);
  };

  const renderFormComponents = () => {
    switch (step) {
      case 1:
        return (
          <FirstScreen
            setStep={setStep}
            // avatar={avatar}
            setAvatar={setAvatar}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
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
            labourType={labourType}
            setLabourType={setLabourType}
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
            avatar={avatar}
            setAvatar={setAvatar}
            handleRegister={handleRegister}
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
          <Text style={styles.headingText}>Let's get</Text>
          <Text style={styles.headingText}>started</Text>
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
    borderRadius: 20,
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
