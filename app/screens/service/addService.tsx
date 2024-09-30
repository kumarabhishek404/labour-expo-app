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
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import DateField from "@/components/Calender";
import WorkRequirment from "@/components/WorkRequirements";
import LocationField from "@/components/LocationField";
import ImageUpload from "@/components/ImagePicker";
import Loader from "@/components/Loader";
import { addNewService } from "@/app/api/services";

// Enable LayoutAnimation on Android (it's automatically enabled on iOS)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AddService = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Add Service",
          headerTintColor: Colors.white,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Let's create</Text>
          <Text style={styles.headingText}>your work</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="sickle"
              size={30}
              color={Colors.secondary}
            />
            <TextInput
              value={workTitle}
              style={styles.textInput}
              placeholder="Work Title"
              placeholderTextColor={Colors.secondary}
              onChangeText={setWorkTitle}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={"shovel"}
              size={30}
              color={Colors.secondary}
            />
            <TextInput
              value={workDescription}
              style={styles.textInput}
              placeholder="Work Description"
              placeholderTextColor={Colors.secondary}
              onChangeText={setWorkDescription}
            />
          </View>
          <DateField
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <WorkRequirment
            requirements={requirements}
            setRequirements={setRequirements}
          />
          <ImageUpload images={images} setImages={setImages} />
          <LocationField address={address} setAddress={setAddress} />

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default AddService;

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
});
