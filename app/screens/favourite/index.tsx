import React, { useState } from "react";
import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import ListingsWorkers from "@/components/ListingWorkers";
import ListingsVertical from "@/components/ListingVertical";
import { UserAtom } from "../../AtomStore/user";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { fetchAllLikedServices } from "../../api/services";
import Loader from "@/components/Loader";
import { fetchAllLikedWorkers } from "../../api/workers";

const Favourite = (props: any) => {
  const userDetails = useAtomValue(UserAtom);
  const [searchText, setSearchText] = useState("");
  const [workers, setWorkers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const { state, dispatch }: any = useStateContext();

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () =>
      (await userDetails?.role) === "Employer"
        ? fetchAllLikedWorkers()
        : fetchAllLikedServices(),
    retry: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setFilteredData(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  const handleSearch = (text: any) => {
    setSearchText(text);
    const filtered: any = workers.filter(
      (item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase()) ||
        item.location.toLowerCase().includes(text.toLowerCase()) ||
        item.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Favourite",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
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

      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
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
                value={searchText}
                onChangeText={handleSearch}
                placeholderTextColor="black"
              />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
              <Ionicons name="options" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails?.role === "Employer" ? (
          <ListingsWorkers listings={filteredData} category="workers" />
        ) : (
          <ListingsVertical listings={filteredData} category="services" />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchBox: {
    color: "#000000",
    height: "100%",
    width: "92%",
    fontSize: 16,
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
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    marginLeft: 20,
  },
});

export default Favourite;
