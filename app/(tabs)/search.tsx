import {
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
import { Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import DateField from "@/components/Calender";
import WorkRequirment from "@/components/WorkRequirements";
import PriceField from "@/components/PriceField";
import LocationField from "@/components/LocationField";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImagePicker";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    // navigation.navigate("LOGIN");
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
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginLeft: 20,
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 6,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Feather name="arrow-left" size={20} />
            </TouchableOpacity>
          ),
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
              style={styles.textInput}
              placeholder="Work Title"
              placeholderTextColor={Colors.secondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name={"shovel"} size={30} color={Colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Work Description"
              placeholderTextColor={Colors.secondary}
            />
          </View>
          <DateField />
          <WorkRequirment />
          {/* <PriceField /> */}
          <ImageUpload />
          {/* <Modal /> */}
          <LocationField />
          {/* <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"screen-smartphone"}
              size={30}
              color={Colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone no"
              placeholderTextColor={Colors.secondary}
              secureTextEntry={secureEntery}
              keyboardType="phone-pad"
            />
          </View> */}

          <TouchableOpacity style={styles.loginButtonWrapper}>
            <Text style={styles.loginText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default SignupScreen;

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
