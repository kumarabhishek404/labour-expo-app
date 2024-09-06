import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { Link, router, Stack } from "expo-router";
import { useStateContext } from "../context/context";
import UsersClient from "../api/user";
import { getItem } from "@/utils/AsyncStorage";
import Loader from "@/components/Loader";

const LoginScreen = () => {
  const navigation = useNavigation();
  const service = new UsersClient();
  const [secureEntery, setSecureEntery] = useState(true);
  const { state, dispatch }: any = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login button pressed");
    if (email && password) {
      setIsLoading(true);
      let payload = {
        email: email,
        password: password,
      };
      try {
        const response: any = await service.signIn(payload);
        console.log("response from login - ", response);
        dispatch({
          type: "LOGIN",
          payload: { isAuth: true },
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        return {
          ...state,
          isAuth: false,
        };
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSignup = () => {
    // navigation.navigate("SIGNUP");
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
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Welcome</Text>
          <Text style={styles.headingText}>Back</Text>
        </View>
        <View style={styles.formContainer}>
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
              value={password}
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
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButtonWrapper}
          >
            <Text style={styles.loginText}>Login</Text>
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
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;

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
    // fontFamily: Fonts.SemiBold,
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
    // fontFamily: Fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    // fontFamily: Fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    // fontFamily: Fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    // fontFamily: Fonts.Regular,
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
    // fontFamily: Fonts.SemiBold,
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
    // fontFamily: Fonts.Regular,
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
    color: Colors.black,
    textDecorationLine: "underline",
    // fontFamily: Fonts.Bold,
  },
});
