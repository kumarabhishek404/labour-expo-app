import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import TextInputComponent from "../inputs/TextInputWithIcon";

interface SearchFilterProps {
  data: any;
  setFilteredData: any;
}

const SearchFilter = ({ data, setFilteredData }: SearchFilterProps) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: any) => {
    setSearchText(text);
    let workers = data?.pages.flatMap((page: any) => page.data || []);
    const filtered: any = workers?.filter(
      (item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase())
      // item.location.toLowerCase().includes(text.toLowerCase()) ||
      // item.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.searchSectionWrapper}>
      <View style={styles.searchBar}>
        <TextInputComponent
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search in your services..."
          label=""
          name="search"
          icon={
            <Ionicons name="search" size={28} color={Colors?.secondaryText} />
          }
        />
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
        <Ionicons name="options" size={28} color={Colors.white} />
      </TouchableOpacity>
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
