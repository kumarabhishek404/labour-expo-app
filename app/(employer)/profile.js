import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

const Avatar = ({ userData, handleCameraClick, handleFileChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = async () => {
    setIsLoading(true); // Start loading

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // await handleFileChange(result);
    }

    setIsLoading(false); // End loading
  };

  return (
    <View className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
      {isLoading ? (
        <View className="flex items-center justify-center w-full h-full">
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      ) : (
        <Image
          source={{
            uri:
              userData?.avatar ||
              "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
          }}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
        />
      )}

      <TouchableOpacity className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
        <Text className="text-white text-lg">
          <MaterialIcons name="photo-camera" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Profile = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {},
  });
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);

  const onSubmit = () => {};

  return (
    <View className="py-2 px-4 mt-8 bg-gray-100 flex-1">
      <Text
        style={{
          fontFamily: "Montserrat_500Medium",
        }}
        className="text-2xl font-semibold"
      >
        Profile
      </Text>
      <KeyboardAvoidingView className="space-y-2 flex-1 ">
        <ScrollView className="my-2 px-2 py-6 rounded shadow bg-white">
          <View className="flex items-center justify-between">
            <Avatar />
          </View>
          <View className="flex space-y-2">
            <View>
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-sm font-[500]"
                >
                  Name
                </Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder=" Name"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
              {errors?.projectName?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.projectName?.message}
                </Text>
              )}
            </View>
          </View>
          <View className="flex flex-row space-x-2">
            <View className="flex-1">
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-sm font-[500]"
                >
                  Middle Name
                </Text>
                <Controller
                  control={control}
                  name="middleName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Middle Name"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
              {errors?.projectName?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.projectName?.message}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-sm font-[500]"
                >
                  Last Name
                </Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Last Name"
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
              {errors?.projectName?.message && (
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-red-400 text-xs ml-1 py-1"
                >
                  {errors?.projectName?.message}
                </Text>
              )}
            </View>
          </View>

          <View>
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-sm font-[500]"
              >
                Contact Number
              </Text>
              <Controller
                control={control}
                name="conatctNumber"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Contact Number"
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                    className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
            {errors?.projectName?.message && (
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-red-400 text-xs ml-1 py-1"
              >
                {errors?.projectName?.message}
              </Text>
            )}
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-sm font-[500]"
              >
                Alternate Contact Number
              </Text>
              <Controller
                control={control}
                name="alternateContactNumber"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Alternate  Contact Number"
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                    className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
            {errors?.projectName?.message && (
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-red-400 text-xs ml-1 py-1"
              >
                {errors?.projectName?.message}
              </Text>
            )}
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-sm font-[500]"
              >
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Email"
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                    className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
            {errors?.projectName?.message && (
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-red-400 text-xs ml-1 py-1"
              >
                {errors?.projectName?.message}
              </Text>
            )}
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-sm font-[500]"
              >
                Alternate Email
              </Text>
              <Controller
                control={control}
                name="alternateEmail"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Alternate Email"
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                    className="bg-gray-100 w-full h-10 px-2 rounded placeholder:text-sm"
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
            {errors?.projectName?.message && (
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-red-400 text-xs ml-1 py-1"
              >
                {errors?.projectName?.message}
              </Text>
            )}
          </View>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-600 my-5 flex justify-center rounded items-center h-12"
          >
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
              }}
              className="text-[18px] font-semibold text-white"
            >
              Save
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
