import {
  Alert,
  Image,
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

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    // navigation.navigate("LOGIN");
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { state, dispatch }: any = useStateContext();

  const handleSignup = async () => {
    console.log("Signup button pressed");
    // const service = new UsersClient();
    if (
      !firstName ||
      !email ||
      // !mobile ||
      !password
      // !confirmPassword
    ) {
      // Toast.show("Please fill all fields.", {
      //   position: Toast.positions.BOTTOM,
      //   backgroundColor: "white",
      //   opacity: 1,
      //   textColor: "red",
      // });
      return;
    }
    // if (password !== confirmPassword) {
    //   Alert.alert("Error", "Passwords do not match.");
    //   return;
    // }
    const payload = {
      firstName: firstName,
      lastName: lastName,
      mobileNumber: mobile,
      email: email,
      password: password,
    };
    setIsLoading(true);
    // console.log(firstName, lastName, email, mobile, password);
    try {
      // const response = await service.addNewUser(payload);
      // console.log(response.data.message);
      setIsLoading(false);
      // dispatch({ type: "REGISTER", payload: { userData: response?.data } });
      // Alert.alert("Success", "Account created successfully");
      router.push("/auth/login");
    } catch (error) {
      setIsLoading(false);
      // Alert.alert("Error", "Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Let's get</Text>
          <Text style={styles.headingText}>started</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Octicons name={"person"} size={30} color={Colors.secondary} />
            <TextInput
              value={firstName}
              style={styles.textInput}
              placeholder="Enter your first name"
              placeholderTextColor={Colors.secondary}
              // secureTextEntry={secureEntery}
              // keyboardType="phone-pad"
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Octicons name={"person"} size={30} color={Colors.secondary} />
            <TextInput
              value={lastName}
              style={styles.textInput}
              placeholder="Enter your last name"
              placeholderTextColor={Colors.secondary}
              // secureTextEntry={secureEntery}
              // keyboardType="phone-pad"
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"screen-smartphone"}
              size={30}
              color={Colors.secondary}
            />
            <TextInput
              value={mobile}
              style={styles.textInput}
              placeholder="Enter your mobile"
              placeholderTextColor={Colors.secondary}
              keyboardType="phone-pad"
              onChangeText={setMobile}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name={"mail-outline"}
              size={30}
              color={Colors.secondary}
            />
            <TextInput
              value={email}
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={Colors.secondary}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={Colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={Colors.secondary}
              secureTextEntry={secureEntery}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setSecureEntery((prev) => !prev);
              }}
            >
              <SimpleLineIcons
                name={"eye"}
                size={20}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Sign up</Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Already have an account!</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.signupText}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
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
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
    // paddingHorizontal: 20,
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
  signupText: {
    color: Colors.black,
    textDecorationLine: "underline",
  },
});
