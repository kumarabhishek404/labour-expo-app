import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Icon from "../../assets/adaptive-icon.png";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState("password");

  const onSubmit = (data) => {
    console.log("Button clicked");

    console.log(data);
  };
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  };

  return (
    <SafeAreaView className="py-4 flex-1 justify-center items-center px-6">
      <View className="flex items-center">
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7fTFb3G8JZJy_oWg4rfoketLxdUnUF2eLw&s",
          }}
        />
        <Text
          style={{
            fontFamily: "Montserrat_500Medium",
          }}
          className="text-gray-900 text-[18px]"
        >
          Register Yourself
        </Text>
      </View>

      <View className="flex-1 justify-start mt-16" behavior="padding">
        <View className="flex space-y-2">
          <KeyboardAvoidingView className="space-y-2">
            <View>
              <View className="flex flex-row items-center bg-gray-100 px-2">
                <FontAwesome name="user" size={24} color="gray" />

                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Enter Your Name"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-[300px] h-12 px-2 rounded placeholder:text-sm"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: "Name is required!",
                    },
                  }}
                />
              </View>
              {errors?.email?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.email?.message}
                </Text>
              )}
            </View>
            <View>
              <View className="flex flex-row items-center bg-gray-100 px-2">
                <MaterialIcons name="email" size={24} color="gray" />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Enter Your Email"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-[300px] h-12 px-2 rounded placeholder:text-sm"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: "Email is required!",
                    },
                  }}
                />
              </View>
              {errors?.email?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.email?.message}
                </Text>
              )}
            </View>

            <View>
              <View className="flex flex-row items-center bg-gray-100 px-2">
                <Entypo name="lock" size={24} color="gray" />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      secureTextEntry
                      autoCorrect={false}
                      placeholder="Enter Your Password"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-[300px] h-12 px-2 rounded placeholder:text-sm"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: "Password is required!",
                    },
                  }}
                />
              </View>
              {errors?.password?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.password?.message}
                </Text>
              )}
            </View>
          </KeyboardAvoidingView>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-600 mt-16 flex justify-center rounded items-center h-12"
          >
            <Link href="/(authenticate)/role">
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                }}
                className="text-[18px] font-semibold text-white"
              >
                Register
              </Text>
            </Link>
          </Pressable>
          <View className="flex flex-row items-center space-x-4 py-2">
            <View className="h-[1px] bg-gray-200 flex-1"></View>
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
              }}
              className="text-[18px]"
            >
              OR
            </Text>
            <View className="h-[1px] bg-gray-200 flex-1"></View>
          </View>

          <Pressable className="bg-blue-600 mt-16 flex justify-center rounded items-center h-12">
            <Link href="/(authenticate)/login">
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                }}
                className="text-[18px] font-semibold text-white"
              >
                Login
              </Text>
            </Link>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({});
