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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import { fetchAllMediators } from "@/app/api/mediator";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/PaginationString";
import { fetchAllLikedServices, fetchAllServices } from "@/app/api/services";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";

const Services = () => {
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const { title, type } = useGlobalSearchParams();

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [type === "favourite" ? "savedServices" : "services"],
    queryFn: ({ pageParam }) =>
      type === "favourite"
        ? fetchAllLikedServices({ pageParam })
        : fetchAllServices({ pageParam }),
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.currentPage < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.currentPage + 1;
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
      // item.location.toLowerCase().includes(text.toLowerCase()) ||
      // item.category.toLowerCase().includes(text.toLowerCase())
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
          headerTitle: `${title}`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
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
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="bookmark-outline" size={20} />
              </View>
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
            type="services"
            onCagtegoryChanged={onCatChanged}
            stylesProp={styles.categoryContainer}
          />

          <PaginationString
            type="services"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
            <ListingsVerticalServices
              listings={memoizedData || []}
              category="services"
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <EmptyDatePlaceholder title={"Mediator"} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
  },
  headerContainer: {},
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
  categoryContainer: {},
});

export default Services;
