import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import TextInputComponent from "../inputs/TextInputWithIcon";

interface SearchFilterProps {
  type: string;
  data: any;
  setFilteredData: any;
}

const SearchFilter = ({ type, data, setFilteredData }: SearchFilterProps) => {
  const [searchText, setSearchText] = useState("");

  const handleUsersSearch = (text: any) => {
    setSearchText(text);
    let workers = data.flatMap((page: any) => page.data || []);
    const filtered: any = workers?.filter(
      (item: any) =>
        item?.firstName?.toLowerCase().includes(text.toLowerCase()) ||
        item?.lastName?.toLowerCase().includes(text.toLowerCase()) ||
        item?.address?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleServicesSearch = (text: any) => {
    setSearchText(text);
    let workers = data.flatMap((page: any) => page.data || []);
    const filtered: any = workers?.filter(
      (item: any) =>
        item?.name?.toLowerCase().includes(text.toLowerCase()) ||
        item?.description?.toLowerCase().includes(text.toLowerCase()) ||
        item?.address?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.searchSectionWrapper}>
      <View style={styles.searchBar}>
        <TextInputComponent
          value={searchText}
          onChangeText={
            type === "users" ? handleUsersSearch : handleServicesSearch
          }
          placeholder="Search in your services..."
          label=""
          name="search"
          icon={
            <Ionicons
              name="search"
              size={28}
              color={Colors?.secondaryText}
              style={{ marginRight: 10 }}
            />
          }
        />
      </View>
      {/* <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
        <Ionicons name="options" size={28} color={Colors.white} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    color: Colors?.text,
    height: "100%",
    width: "92%",
    fontSize: 16,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
  },
  filterBtn: {
    backgroundColor: Colors.action,
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
});

export default SearchFilter;
