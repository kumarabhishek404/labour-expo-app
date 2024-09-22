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
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryButtons from "@/components/CategoryButtons";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import { fetchAllWorkers } from "../api/workers";
import { fetchAllServices } from "../api/services";
import Loader from "@/components/Loader";
import { fetchAllEmployers } from "../api/employer";
import ListingWorkersHorizontal from "@/components/ListingWorkersHorizontal";
import ListingServicesHorizontal from "@/components/ListingServicesHorizontal";
import GroupWorkersListing from "@/components/GroupWorkersListing";
import GroupEmployersListing from "@/components/GroupEmployersListing";

const Page = () => {
  const headerHeight = useHeaderHeight();
  const userDetails = useAtomValue(UserAtom);
  const [category, setCategory] = useState("All");

  const {
    isLoading,
    data: response,
    isRefetching,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () =>
      (await userDetails?.role) === "Employer"
        ? fetchAllWorkers()
        : fetchAllServices(),
    retry: 0,
  });

  const {
    isLoading: isSecondLoading,
    data: secondResponse,
    isRefetching: isSecondRefetching,
  } = useQuery({
    queryKey: ["employers"],
    queryFn: async () =>
      (await userDetails?.role) === "Employer"
        ? fetchAllWorkers()
        : fetchAllEmployers(),
    retry: 0,
  });

  const onCatChanged = (category: string) => {
    console.log("Categpry: ", category);
    setCategory(category);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              style={{ marginLeft: 20 }}
            >
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/avatar.php?g=female",
                }}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 10,
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
      <Loader
        loading={
          isLoading || isSecondLoading || isRefetching || isSecondRefetching
        }
      />

      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingTxt}>Work Is Worship!</Text>

          <View style={styles.searchSectionWrapper}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                style={{ marginRight: 5 }}
                color={Colors.black}
              />
              <TextInput
                style={styles.searchBox}
                placeholder="Search..."
                // value={searchText}
                // onChangeText={handleSearch}
                placeholderTextColor="black"
              />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
              <Ionicons name="options" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <CategoryButtons onCagtegoryChanged={onCatChanged} />
          {userDetails?.role === "Employer" ? (
            <ListingWorkersHorizontal
              listings={response?.data}
              category={category}
            />
          ) : (
            <ListingServicesHorizontal
              listings={response?.data}
              category={category}
            />
          )}

          {userDetails?.role === "Employer" ? (
            <GroupWorkersListing
              listings={secondResponse?.data}
              category={category}
            />
          ) : (
            <GroupEmployersListing
              listings={secondResponse?.data}
              category={category}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor,
  },
  headingTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    marginTop: 10,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingLeft: 16,
    borderRadius: 10,
  },
  searchBox: {
    color: "#000000",
    height: "100%",
    width: "92%",
    fontSize: 16,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    marginLeft: 20,
  },
});
