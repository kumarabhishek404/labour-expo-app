import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import workers from "@/data/workers.json";
import services from "@/data/services.json";
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import ListingsWorkers from "@/components/ListingWorkers";
import ListingsVertical from "@/components/ListingVertical";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { UserAtom } from "../AtomStore/user";
import Loader from "@/components/Loader";
import { fetchAllServices } from "../api/services";
import { fetchAllWorkers } from "../api/workers";

const Workers = () => {
  const userDetails = useAtomValue(UserAtom);
  const [workers, setWorkers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () =>
      (await userDetails?.role) === "Employer"
        ? fetchAllWorkers()
        : fetchAllServices(),
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
    <View style={{ flex: 1 }}>
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
    </View>
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

export default Workers;
