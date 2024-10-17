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
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/Loader";
import CategoryButtons from "@/components/CategoryButtons";
import { UserAtom } from "@/app/AtomStore/user";
import { router, Stack } from "expo-router";
import {
  acceptJoiningRequest,
  cancelJoiningRequest,
  fetchAllRequests,
  fetchRecievedRequests,
  fetchSentRequests,
  rejectJoiningRequest,
} from "@/app/api/requests";
import ListingVerticalRequests from "@/components/ListingVerticalRequests";

const Requests = () => {
  const userDetails = useAtomValue(UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("recievedRequests");

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey:
      category === "all"
        ? ["requests"]
        : category === "recievedRequests"
        ? ["recievedRequests"]
        : ["sentRequests"],
    queryFn: ({ pageParam }) =>
      category === "all"
        ? fetchAllRequests({ pageParam })
        : category === "recievedRequests"
        ? fetchRecievedRequests({ pageParam })
        : fetchSentRequests({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
    retry: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setFilteredData(
        response?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelRequest"],
    mutationFn: (id) => cancelJoiningRequest({ requestID: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while liking a worker - ", response);
    },
    // onError: (err) => {
    //   console.error("error while liking the worker ", err);
    // },
  });

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptRequest"],
    mutationFn: (id) => acceptJoiningRequest({ requestId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while accepting a request - ", response);
    },
    // onError: (err) => {
    //   console.error("error while liking the worker ", err);
    // },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectRequest"],
    mutationFn: (id) => rejectJoiningRequest({ requestId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while rejecting request - ", response);
    },
    // onError: (err) => {
    //   console.error("error while liking the worker ", err);
    // },
  });

  const handleSearch = (text: any) => {
    setSearchText(text);
    let workers = response?.pages?.flatMap((page: any) => page.data || []);
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
    refetch();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Requests",
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
        <Loader
          loading={
            isLoading ||
            mutationCancelRequest?.isPending ||
            mutationAcceptRequest?.isPending ||
            mutationRejectRequest?.isPending
          }
        />
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
            type="requests"
            onCagtegoryChanged={onCatChanged}
            stylesProp={styles.categoryContainer}
          />

          <View style={styles.totalData}>
            <Text style={styles.totalItemTxt}>
              {isLoading
                ? "Loading..."
                : `${memoizedData?.length || 0} Results`}
            </Text>
          </View>
          <ListingVerticalRequests
            listings={memoizedData || []}
            category={category}
            loadMore={loadMore}
            isFetchingNextPage={isFetchingNextPage}
            onCancelRequest={mutationCancelRequest?.mutate}
            onAcceptRequest={mutationAcceptRequest?.mutate}
            onRejectRequest={mutationRejectRequest?.mutate}
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
    borderRadius: 8,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginLeft: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  totalData: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  totalItemTxt: {
    fontSize: 12,
  },
});

export default Requests;
