import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

const MyProjects_Data = [
  {
    id: 1,
    city: "Pune",
    state: "Maharashtra",
    title: "Mason, Painter, Electrician, Plumber Needed",
    img: "https://www.goconstruct.org/media/ec0pubko/hbf-construction-work-on-a-redrow-site-min.jpg?anchor=center&mode=crop&width=940&height=610&rnd=132659746009270000",
    priceRange: "400 Rs - 900 Rs",
  },

  {
    id: 4,
    city: "Chennai",
    state: "Tamil Nadu",
    title: "Construction Labor Required",
    img: "https://constructionreviewonline.com/wp-content/uploads/2021/03/Construction.jpg",
    priceRange: "300 Rs - 700 Rs",
  },
];

const MyProjects = () => {
  return (
    <View className="py-2 px-3 mt-8 bg-gray-100 flex-1">
      <Text
        style={{
          fontFamily: "Montserrat_600SemiBold",
        }}
        className="text-xl font-semibold mb-3 text-gray-800"
      >
        My Projects
      </Text>
      <ScrollView
        className="bg-gray-100 flex-1 space-y-4 "
        showsVerticalScrollIndicator={false}
      >
        {MyProjects_Data.map((Job) => (
          <TouchableOpacity key={Job.id} activeOpacity={0.7}>
            <Link href="../common/job-detail">
              <View className="bg-white p-2 rounded-lg shadow">
                <Image
                  source={{ uri: Job.img }}
                  className="w-full h-40 rounded-lg mb-2"
                  style={{ resizeMode: "cover" }}
                />
                <Text
                  style={{ fontFamily: "Montserrat_500Medium" }}
                  className="text-md font-semibold mb-1"
                >
                  {Job?.title}
                </Text>
                <View className="flex-row items-center space-x-2 mb-2">
                  <FontAwesome6 name="location-dot" size={16} color="black" />
                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className="text-sm text-gray-700"
                  >
                    {Job?.city}, {Job.state}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-2">
                  <FontAwesome
                    name="calendar-minus-o"
                    size={16}
                    color="black"
                  />
                  <Text
                    style={{ fontFamily: "Montserrat_500Medium" }}
                    className="text-sm text-gray-700"
                  >
                    22 November 2024 to 29 November 2025
                  </Text>
                </View>
              </View>
            </Link>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyProjects;

const styles = StyleSheet.create({});
