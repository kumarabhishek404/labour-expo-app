import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import React, { useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Jobs_Data = [
  {
    id: 1,
    name: "Labour",
    jobs: [
      {
        name: "Construction Labourer",
        totalRequired: 10,
        foodProvided: "Yes",
        shelterProvider: "No",
        payPerDay: "₹500",
      },
    ],
  },
  {
    id: 2,
    name: "Mason",
    jobs: [
      {
        name: "Brick Mason",
        totalRequired: 5,
        foodProvided: "Yes",
        shelterProvider: "Yes",
        payPerDay: "₹800",
      },
      {
        name: "Stone Mason",
        totalRequired: 3,
        foodProvided: "No",
        shelterProvider: "No",
        payPerDay: "₹900",
      },
    ],
  },
  {
    id: 3,
    name: "Carpenter",
    jobs: [
      {
        name: "Furniture Carpenter",
        totalRequired: 4,
        foodProvided: "Yes",
        shelterProvider: "No",
        payPerDay: "₹700",
      },
    ],
  },
  {
    id: 4,
    name: "Painter",
    jobs: [
      {
        name: "House Painter",
        totalRequired: 3,
        foodProvided: "No",
        shelterProvider: "No",
        payPerDay: "₹600",
      },
    ],
  },
  {
    id: 5,
    name: "Electrician",
    jobs: [
      {
        name: "Residential Electrician",
        totalRequired: 2,
        foodProvided: "Yes",
        shelterProvider: "No",
        payPerDay: "₹900",
      },
    ],
  },
  {
    id: 6,
    name: "Plumber",
    jobs: [
      {
        name: "Pipe Fitter",
        totalRequired: 2,
        foodProvided: "Yes",
        shelterProvider: "Yes",
        payPerDay: "₹850",
      },
    ],
  },
  {
    id: 7,
    name: "Welder",
    jobs: [
      {
        name: "Metal Welder",
        totalRequired: 4,
        foodProvided: "No",
        shelterProvider: "No",
        payPerDay: "₹1000",
      },
    ],
  },
  {
    id: 8,
    name: "Foreman",
    jobs: [
      {
        name: "Site Foreman",
        totalRequired: 1,
        foodProvided: "Yes",
        shelterProvider: "Yes",
        payPerDay: "₹1200",
      },
    ],
  },
  {
    id: 9,
    name: "Supervisor",
    jobs: [
      {
        name: "Construction Supervisor",
        totalRequired: 1,
        foodProvided: "Yes",
        shelterProvider: "Yes",
        payPerDay: "₹1100",
      },
    ],
  },
  {
    id: 10,
    name: "Engineer",
    jobs: [
      {
        name: "Civil Engineer",
        totalRequired: 2,
        foodProvided: "No",
        shelterProvider: "No",
        payPerDay: "₹1500",
      },
    ],
  },
];

import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRouter } from "expo-router";
const Job = {
  img: "https://www.goconstruct.org/media/ec0pubko/hbf-construction-work-on-a-redrow-site-min.jpg?anchor=center&mode=crop&width=940&height=610&rnd=132659746009270000",
  name: "Construction Site Supervisor",
  engineerName: "Alice Johnson",
  contactNumber: "+9876543210",
  alternateContactNumber: "+1234567890",
  email: "alice.johnson@construction.com",
  alternateEmail: "ajohnson@alternate.com",
  jobs: Jobs_Data,
  pinCode: "567890",
  postOffice: "Central Post Office",
  city: "Buildtown",
  state: "Construct State",
  addressLine1: "789 Construction Rd.",
  addressLine2: "Suite 101",
  landmark: "Next to Main Building Supply",
};
import Ionicons from "@expo/vector-icons/Ionicons";
const JobDetails = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <View className="py-2 px-3 mt-8 bg-gray-100 flex-1">
      <View className="flex flex-row space-x-4">
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
          }}
          className="text-xl font-semibold mb-3 text-gray-800"
        >
          Job
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="my-2 px-2 rounded-3xl py-2 shadow "
      >
        <View className="p-2 bg-white flex space-y-1 rounded">
          <Image
            source={{ uri: Job.img }}
            style={{ width: "100%", height: 200 }}
            className="rounded"
          />
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
            className="text-xl font-semibold"
          >
            {Job?.name}
          </Text>
          <View className="flex flex-row space-x-2 items-center">
            <FontAwesome6 name="location-dot" size={15} color="black" />
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-xs"
              >
                {Job?.city},{Job.state}{" "}
              </Text>
            </View>
          </View>
          <View className="flex flex-row space-x-2 items-center">
            <FontAwesome name="calendar-minus-o" size={15} color="black" />
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                }}
                className="text-xs"
              >
                22 November 2024 to 29 November 2025
              </Text>
            </View>
          </View>
        </View>
        {Job?.jobs.map((job) => (
          <View
            key={job.id}
            className="p-2 my-2 bg-white flex space-y-1 rounded"
          >
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
              }}
              className="text-lg font-semibold text-blue-500"
            >
              {job.name}
            </Text>
            {job?.jobs?.map((job) => (
              <View className="bg-blue-50 my-2 p-2">
                <View className="flex  flex-row justify-between">
                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                    className="font-semibold"
                  >
                    {job.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                    }}
                  >
                    {job.payPerDay} / Day
                  </Text>
                </View>
                <View className="flex flex-row mt-2 justify-between">
                  <View className="flex items-center">
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      Required
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      {" "}
                      {job.totalRequired}
                    </Text>
                  </View>
                  <View className="flex items-center">
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      Food
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      {" "}
                      {job.foodProvided === "Yes" ? (
                        <FontAwesome
                          name="check-circle"
                          size={20}
                          color="green"
                        />
                      ) : (
                        <Entypo
                          name="circle-with-cross"
                          size={20}
                          color="red"
                        />
                      )}
                    </Text>
                  </View>
                  <View className="flex items-center">
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      Sheleter
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      {" "}
                      {job.shelterProvider === "Yes" ? (
                        <FontAwesome
                          name="check-circle"
                          size={20}
                          color="green"
                        />
                      ) : (
                        <Entypo
                          name="circle-with-cross"
                          size={20}
                          color="red"
                        />
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default JobDetails;

const styles = StyleSheet.create({});
