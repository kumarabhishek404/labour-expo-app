import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { UserAtom } from "../AtomStore/user";
import Loader from "@/components/commons/Loader";
import { fetchAllServices } from "../api/services";
import { fetchAllWorkers } from "../api/workers";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import FilterModal from "@/components/inputs/Filters";
import PaginationString from "@/components/commons/PaginationString";

const Workers = () => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({}); // Store applied filters here

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["services", filters], // Add filters to queryKey to refetch when they change
    queryFn: ({ pageParam }) => {
      const payload = {
        pageParam,
        ...filters, // Add filters to the API request payload
      };
      return userDetails?.role === "EMPLOYER"
        ? fetchAllWorkers(payload)
        : fetchAllServices(payload);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const totalData = response?.pages[0]?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  console.log("userDetails--", userDetails);
  
  const handleSearch = (text: any) => {
    setSearchText(text);
    let workers = response?.pages.flatMap((page: any) => page.data || []);
    const filtered = workers?.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleApply = (appliedFilters: React.SetStateAction<{}>) => {
    // Apply filters to API call and close modal
    setFilters(appliedFilters);
    setFilterVisible(false); // Close the modal
  };

  const handleClear = () => {
    // Clear all filters and refetch data
    setFilters({});
    setFilterVisible(false);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const onCatChanged = (category: React.SetStateAction<string>) => {
    setCategory(category);
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
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              style={styles.filterBtn}
            >
              <Ionicons name="options" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <CategoryButtons
          type={userDetails?.role === "EMPLOYER" ? "workers" : "services"}
          onCagtegoryChanged={onCatChanged}
        />

        <PaginationString
          type="services"
          isLoading={isLoading}
          totalFetchedData={memoizedData?.length}
          totalData={totalData}
        />

        {memoizedData && memoizedData?.length > 0 ? (
          <>
            {userDetails?.role === "EMPLOYER" ? (
              <ListingsVerticalWorkers
                type="worker"
                listings={memoizedData || []}
                category="workers"
                loadMore={loadMore}
                isFetchingNextPage={isFetchingNextPage}
              />
            ) : (
              <ListingsVerticalServices
                listings={memoizedData || []}
                category="services"
                loadMore={loadMore}
                isFetchingNextPage={isFetchingNextPage}
                isMyService={userDetails?.role === "EMPLOYER"}
              />
            )}
          </>
        ) : (
          <EmptyDatePlaceholder
            title={userDetails?.role === "EMPLOYER" ? "Worker" : "Service"}
          />
        )}
      </View>

      {/* Filter Modal */}
      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApply}
        onClear={handleClear}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10
  },
  headerContainer: {
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
    borderRadius: 8,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginLeft: 20,
  },
  categoryContainer: {
  }
});

export default Workers;
