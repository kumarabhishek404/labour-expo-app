import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
const Jobs_Data = [
  {
    id: 1,
    name: "Labour",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 2,
    name: "Mason",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 3,
    name: "Carpenter",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 4,
    name: "Painter",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 5,
    name: "Electrician",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 6,
    name: "Plumber",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 7,
    name: "Welder",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 8,
    name: "Foreman",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 9,
    name: "Supervisor",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
  {
    id: 10,
    name: "Engineer",
    jobs: [
      {
        name: "",
        totalRequired: "",
        foodProvided: "",
        shelterProvider: "",
        payPerDay: "",
      },
    ],
  },
];

const NewProject = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {},
  });

  const [jobs, setJobs] = useState(Jobs_Data);
  const [image, setImage] = useState(null);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const jobTypes = [
    "Labour",
    "Mason",
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "Welder",
    "Foreman",
    "Supervisor",
    "Engineer",
  ];
  const handleCheckboxChange = (jobType) => {
    setSelectedJobTypes((prev) => {
      if (prev.includes(jobType)) {
        return prev.filter((type) => type !== jobType);
      } else {
        return [...prev, jobType];
      }
    });
  };
  const renderJobInputs = (job, jobIndex, subJobIndex) => {
    return (
      <View
        key={`${jobIndex}-${subJobIndex}`}
        className="mb-4 bg-blue-50 p-4 rounded-lg shadow"
      >
        <Controller
          control={control}
          name={`jobs.${jobIndex}.${subJobIndex}.name`}
          rules={{ required: "Job name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Job Name"
              className="bg-white p-3 rounded-md mb-3 text-base border border-gray-200"
            />
          )}
        />
        <View className="flex flex-row space-x-3 mb-3">
          <Controller
            control={control}
            name={`jobs.${jobIndex}.${subJobIndex}.totalRequired`}
            rules={{ required: "Total required is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Total Required"
                keyboardType="numeric"
                className="bg-white flex-1 p-3 rounded-md text-base border border-gray-200"
              />
            )}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.${subJobIndex}.payPerDay`}
            rules={{ required: "Pay per day is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Pay Per Day"
                keyboardType="numeric"
                className="bg-white flex-1 p-3 rounded-md text-base border border-gray-200"
              />
            )}
          />
        </View>
        <View className="flex flex-row justify-between items-center mb-2">
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-base font-medium"
          >
            Food Provided
          </Text>
          <Controller
            control={control}
            name={`jobs.${jobIndex}.${subJobIndex}.foodProvided`}
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={(newValue) => onChange(newValue)}
                trackColor={{ false: "#ccc", true: "#000" }}
                thumbColor={value ? "#fff" : "#000"}
              />
            )}
          />
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-base font-medium"
          >
            Shelter Provided
          </Text>
          <Controller
            control={control}
            name={`jobs.${jobIndex}.${subJobIndex}.shelterProvided`}
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={(newValue) => onChange(newValue)}
                trackColor={{ false: "#ccc", true: "#000" }}
                thumbColor={value ? "#fff" : "#000"}
              />
            )}
          />
        </View>
      </View>
    );
  };

  const onSubmit = () => {};

  const handleAddJob = (id) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === id) {
        return {
          ...job,
          jobs: [
            ...job.jobs,
            {
              name: "",
              totalRequired: "",
              foodProvided: "",
              shelterProvider: "",
              payPerDay: "",
            },
          ],
        };
      }
      return job;
    });
    setJobs(updatedJobs);
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("result", result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="py-2 mt-8  px-4 bg-gray-100 flex-1">
      <Text
        style={{
          fontFamily: "Montserrat_500Medium",
        }}
        className="text-2xl font-semibold"
      >
        New project
      </Text>
      <KeyboardAvoidingView className="space-y-2 flex-1 ">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="my-2 px-2 rounded-3xl py-2 shadow bg-white"
        >
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-lg font-[500]"
          >
            Basic Info
          </Text>
          <View className="flex space-y-2">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!image && (
                <Pressable
                  onPress={pickImage}
                  className="bg-blue-600 mt-2 w-full flex justify-center rounded items-center h-12"
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                    className="text-[18px] font-semibold text-white"
                  >
                    Pick an Banner Image
                  </Text>
                </Pressable>
              )}
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: 200 }}
                  className="rounded"
                />
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
                  Project Name
                </Text>
                <Controller
                  control={control}
                  name="projectName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Project Name"
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
                  Project Engineer Name
                </Text>
                <Controller
                  control={control}
                  name="projectName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Project Name"
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
          </View>
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-lg font-semibold mt-4 mb-2"
          >
            Project Details
          </Text>
          <View className="flex flex-row flex-wrap -mx-2">
            {jobTypes.map((jobType) => (
              <View key={jobType} className="w-1/2 px-2 mb-4">
                <View className="flex flex-row items-center">
                  <Pressable
                    onPress={() => handleCheckboxChange(jobType)}
                    className={`w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center mr-3 ${
                      selectedJobTypes.includes(jobType)
                        ? "bg-blue-500 border-blue-500"
                        : ""
                    }`}
                  >
                    {selectedJobTypes.includes(jobType) && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => handleCheckboxChange(jobType)}
                    className="flex-1"
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                      className="text-base font-semibold"
                    >
                      {jobType}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          {jobs
            .filter((job) => selectedJobTypes.includes(job?.name))
            .map((job, jobIndex) => (
              <View key={job.id} className="mb-4">
                <View className="flex flex-row items-center mb-2 ">
                  <Text
                    style={{
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                    className="text-base font-semibold mb-2 flex-1"
                  >
                    {job?.name}
                  </Text>
                  <Pressable
                    onPress={() => handleAddJob(job?.id)}
                    className="bg-blue-600 px-4 py-2 rounded-lg items-center shadow-md"
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_600SemiBold",
                      }}
                      className="text-sm font-semibold text-white"
                    >
                      Add
                    </Text>
                  </Pressable>
                </View>

                {job?.jobs?.map((subJob, subJobIndex) =>
                  renderJobInputs(subJob, jobIndex, subJobIndex)
                )}
              </View>
            ))}

          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-lg  font-[500]"
          >
            Project Address
          </Text>
          <View className="flex flex-row space-x-2">
            <View className="flex-1">
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-sm font-[500]"
                >
                  PIN Code
                </Text>
                <Controller
                  control={control}
                  name="pinCode"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="PIN  Code"
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
                  Post Office
                </Text>
                <Controller
                  control={control}
                  name="projectName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="Post Office"
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
          <View className="flex flex-row space-x-2">
            <View className="flex-1">
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                  className="text-sm font-[500]"
                >
                  City
                </Text>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="City"
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
                  State
                </Text>
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholder="State"
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
                Address Line 1
              </Text>
              <Controller
                control={control}
                name="addLine1"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Address Line 1"
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
                Address Line 2
              </Text>
              <Controller
                control={control}
                name="addLine2"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Address Line 2"
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
                Landmark
              </Text>
              <Controller
                control={control}
                name="landmark"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Landmark"
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
            className="bg-blue-600 mt-2 flex justify-center rounded items-center h-12"
          >
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
              }}
              className="text-[18px] font-semibold text-white"
            >
              Create
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewProject;
