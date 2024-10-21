import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import {
  deleteServiceById,
  fetchMyAppliedServices,
  fetchMyServices,
} from "../api/services";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import Loader from "@/components/commons/Loader";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/PaginationString";

const Services = () => {
  const userDetails = useAtomValue(UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [category, setCategory] = useState("All");
  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myServices"],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? fetchMyServices({ pageParam })
        : fetchMyAppliedServices({ pageParam });
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
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  const mutationDeleteService = useMutation({
    mutationKey: ["deleteService"],
    mutationFn: (id) => deleteServiceById(id),
    onSuccess: (response) => {
      console.log("Response while liking a service - ", response);
    },
    onError: (err) => {
      console.error("error while liking the service ", err);
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
    <View style={{ flex: 1 }}>
      <Loader loading={isLoading || mutationDeleteService?.isPending} />
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
          type={userDetails?.role === "EMPLOYER" ? "services" : "services"}
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
            category="workers"
            isFetchingNextPage={isFetchingNextPage}
            isMyService={userDetails?.role === "EMPLOYER"}
            loadMore={loadMore}
            onDelete={(id: any) => {
              mutationDeleteService?.mutate(id);
            }}
          />
        ) : (
          <EmptyDatePlaceholder
            title={userDetails?.role === "EMPLOYER" ? "Service" : "Booking"}
          />
        )}
      </View>
    </View>
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
