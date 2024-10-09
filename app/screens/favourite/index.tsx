import React, { useMemo, useState } from "react";
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
import { UserAtom } from "../../AtomStore/user";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllLikedServices } from "../../api/services";
import Loader from "@/components/Loader";
import { fetchAllLikedWorkers } from "../../api/workers";
import CategoryButtons from "@/components/CategoryButtons";
import ListingsVerticalWorkers from "@/components/ListingsVerticalWorkers";
import ListingsVerticalServices from "@/components/ListingsVerticalServices";

const Favourite = (props: any) => {
  const userDetails = useAtomValue(UserAtom);
  const [searchText, setSearchText] = useState("");
  const [workers, setWorkers] = useState([]);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("All");

  // const { state, dispatch }: any = useStateContext();

  // const {
  //   isLoading,
  //   data: response,
  //   refetch,
  //   isRefetching,
  // } = useQuery({
  //   queryKey: ["services"],
  //   queryFn: async () =>
  //     (await userDetails?.role) === "Employer"
  //       ? fetchAllLikedWorkers()
  //       : fetchAllLikedServices(),
  //   retry: 0,
  // });

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["favourites"],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "Employer"
        ? fetchAllLikedWorkers({ pageParam })
        : fetchAllLikedServices({ pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
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

        <CategoryButtons
          type={userDetails?.role === "Employer" ? "workers" : "services"}
          onCagtegoryChanged={onCatChanged}
          stylesProp={styles.categoryContainer}
        />

        <View style={styles.totalData}>
          <Text style={styles.totalItemTxt}>
            {isLoading ? "Loading..." : `${memoizedData?.length || 0} Results`}
          </Text>
        </View>
        {userDetails?.role === "Employer" ? (
          <ListingsVerticalWorkers
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
          />
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
  categoryContainer: {
    paddingHorizontal: 20,
  },
  totalData: {
    paddingHorizontal: 20,
  },
  totalItemTxt: {
    fontSize: 12,
  },
});

export default Favourite;
