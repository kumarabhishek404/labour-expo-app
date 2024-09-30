import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import DateField from "@/components/Calender";
import WorkRequirment from "@/components/WorkRequirements";
import PriceField from "@/components/PriceField";
import LocationField from "@/components/LocationField";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImagePicker";
import { addNewService } from "../api/services";
import Loader from "@/components/Loader";
import axios from "axios";
import { makePostRequestFormData } from "../api";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import AddService from "../screens/service/addService";
import Helps from "../screens/helps";

const MiddleOption = () => {
  const userDetails = useAtomValue(UserAtom);
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections]: any = useState({});
  const [workTitle, setWorkTitle] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState("");
  const [requirements, setRequirements]: any = useState([
    {
      type: "",
      count: 0,
      price: "",
    },
  ]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!images) {
      alert("Please select a file first!");
      return;
    }
    console.log(images);
    const formData: any = new FormData();
    const imageUri: any = images;
    const imageName = imageUri.split("/").pop();
    formData.append("coverImage", {
      uri: imageUri,
      type: "image/jpeg",
      name: imageName,
    });

    const jobData = {
      // jobID: "job12345",
      employer: "64e7dd4b9e9f1d23e6a8b8b4",
      // name: "New Work In Balipur 4",
      // description: "We need skilled laborers for a large construction project.",
      location: "Central City",
      // startDate: "2024-09-15",
      // endDate: "2024-12-30",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      // address: "1234 Main St, New York, NY 10001",
      jobs: [
        {
          name: "Mason",
          totalRequired: 10,
          foodProvided: false,
          shelterProvider: false,
          payPerDay: 100,
        },
        {
          name: "Carpenter",
          totalRequired: 5,
          foodProvided: false,
          shelterProvider: false,
          payPerDay: 120,
        },
        {
          name: "Electrician",
          totalRequired: 3,
          foodProvided: false,
          shelterProvider: false,
          payPerDay: 150,
        },
      ],
    };

    formData.append("name", workTitle);
    formData.append("description", workDescription);
    formData.append("location", jobData.location);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("city", jobData.city);
    formData.append("state", jobData.state);
    formData.append("pinCode", jobData.pinCode);
    formData.append("address", address);
    formData.append("jobs", JSON.stringify(jobData.jobs));

    console.log("payloadddd---", formData);

    try {
      const response: any = await addNewService(formData);
      console.log("Response Data ---", response?.data);
      if (response?.success) {
        alert("Form submitted successfully!");
      } else {
        alert("Failed to submit form.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
    }
  };

  // Simplified questions and respective content for rural audiences
  const questions = [
    {
      id: 1,
      question: "How to stop scooter for some time?",
      answer: "Tap the pause button on the screen.",
    },
    {
      id: 2,
      question: "Where can I leave the scooter?",
      answer: "Park it at a safe place, away from traffic.",
    },
    {
      id: 3,
      question: "How to stop using the scooter?",
      answer: "Tap on 'End Ride' when you're done.",
    },
    {
      id: 4,
      question: "Where is my scooter?",
      answer: "Check the map in the app for the location.",
    },
    {
      id: 5,
      question: "I got hurt or damaged the scooter",
      answer: "Call support immediately or use the app to report.",
    },
    {
      id: 6,
      question: "Something else",
      answer: "Contact our support for other issues.",
    },
  ];

  const toggleSection = (id: any) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [id]: !prevSections[id],
    }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle:
            userDetails?.role === "Employer" ? "Add Service" : "Help",
          headerTintColor: Colors.white,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          // headerLeft: () => (
          //   <TouchableOpacity
          //     onPress={() => router.back()}
          //     style={{
          //       marginLeft: 20,
          //       backgroundColor: Colors.white,
          //       padding: 6,
          //       borderRadius: 6,
          //       shadowColor: "#171717",
          //       shadowOffset: { width: 2, height: 4 },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 3,
          //     }}
          //   >
          //     <Feather name="arrow-left" size={20} />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 6,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="notifications" size={20} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Loader loading={isLoading} />
      {userDetails?.role === "Employer" ? <AddService /> : <Helps />}
    </>
  );
};

export default MiddleOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
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
    marginTop: 20,
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    // fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 60,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  signupButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    // marginTop: 20,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    // fontFamily: fonts.Regular,
    color: Colors.primary,
  },
  arrow: {
    fontSize: 18,
    color: "#333",
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    // fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.primary,
    // fontFamily: fonts.Regular,
  },
  redirectButtonWrapper: {
    // width: '100%',
    // display: 'flex',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginVertical: 20,
  },
  loginButton: {
    flexDirection: "row",
    borderWidth: 2,
    height: 50,
    borderColor: Colors.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 20,
    gap: 10,
  },
  signupText: {
    color: Colors.primary,
  },

  //   container: {
  //     flex: 1,
  //     backgroundColor: '#f9f9f9',
  //     padding: 20,
  // },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  questionButton: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    color: "#333",
  },
  answerContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
  },
  answerText: {
    fontSize: 16,
    color: "#555",
  },
});
