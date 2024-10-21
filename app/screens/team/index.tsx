import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
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
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { fetchAllMembers } from "@/app/api/mediator";
import { UserAtom } from "@/app/AtomStore/user";
import { fetchAllWorkers } from "@/app/api/workers";
import { router, Stack } from "expo-router";
import ListingVerticalMembers from "@/components/commons/ListingVerticalMembers";
import PaginationString from "@/components/commons/PaginationString";

const Members = () => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["members"],
    queryFn: ({ pageParam }) => fetchAllMembers({ pageParam }),
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

  const handleSearch = (text: any) => {
    setSearchText(text);
    let workers = response?.pages.flatMap((page: any) => page.data || []);
    const filtered: any = workers?.filter(
      (item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
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

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Team",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
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
                borderRadius: 8,
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

          <CategoryButtons
            type="members"
            onCagtegoryChanged={onCatChanged}
            stylesProp={styles.categoryContainer}
          />

          <PaginationString
            type="members"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          <ListingVerticalMembers
            listings={memoizedData || []}
            category="workers"
            loadMore={loadMore}
            isFetchingNextPage={isFetchingNextPage}
          />
        </View>
      </View>
    </>
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
  },
});

export default Members;
