import {
  Button,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, Stack, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import { fetchAllWorkers } from "../api/workers";
import { fetchAllServices } from "../api/services";
import Loader from "@/components/commons/Loader";
import { fetchAllEmployers } from "../api/employer";
import GroupWorkersListing from "@/components/commons/GroupWorkersListing";
import GroupEmployersListing from "@/components/commons/GroupEmployersListing";
import profileImage from "../../assets/images/placeholder-person.jpg";
import i18n from "@/utils/i18n";
import { useLocale } from "../context/locale";
import ListingHorizontalServices from "@/components/commons/ListingHorizontalServices";
import ListingHorizontalWorkers from "@/components/commons/ListingHorizontalWorkers";
import HomePageLinks from "@/components/commons/HomePageLinks";
import { useNotification } from "../context/NotificationContext";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { fetchCurrentLocation } from "@/constants/functions";
import BannerSlider from "@/components/commons/BannerSlider";
import { WORKERTYPES } from "@/constants";

const Page = () => {
  useLocale();
  const { notification, expoPushToken, error } = useNotification();
  const userDetails = useAtomValue(UserAtom);
  const headerHeight = useHeaderHeight();
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState(
    userDetails?.role === "EMPLOYER" ? "" : "Hiring"
  );

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["homepage", category],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? fetchAllWorkers({ pageParam, skill: category })
        : fetchAllServices({ pageParam, type: category });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: secondResponse,
    isLoading: isSecondLoading,
    isRefetching: isSecondRefetching,
    isFetchingNextPage: isSecondFetchingNextPage,
    fetchNextPage: fetchSecondNextPage,
    hasNextPage: hasSecondsNextPage,
    refetch: secondRefetch,
  } = useInfiniteQuery({
    queryKey: ["tops", category],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? fetchAllWorkers({ pageParam, skill: category })
        : fetchAllEmployers({ pageParam, type: category });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });
  useEffect(() => {
    fetchLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadSecondMore = () => {
    if (hasSecondsNextPage && !isSecondFetchingNextPage) {
      fetchSecondNextPage();
    }
  };

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  const memoizedData = useMemo(
    () => response?.pages?.flatMap((data: any) => data?.data),
    [response]
  );

  const secondMemoizedData = useMemo(
    () =>
      secondResponse?.pages
        .flatMap((page: any) => page.data || [])
        ?.flatMap((data: any) => data),
    [secondResponse]
  );

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
    await secondRefetch();
  });

  const fetchLocation = async () => {
    await fetchCurrentLocation();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              style={{ marginLeft: 20 }}
            >
              <Image
                source={
                  userDetails?.profilePicture
                    ? {
                        uri: userDetails?.profilePicture,
                      }
                    : profileImage
                }
                style={{ width: 40, height: 40, borderRadius: 4 }}
              />
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
      <Loader
        loading={
          isLoading || isRefetching || isSecondLoading || isSecondRefetching
        }
      />

      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={!isRefetching && !isSecondRefetching && refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={styles.headingTxt}>
            {i18n.t("welcome")} {userDetails?.firstName}
          </Text>

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
                // value={searchText}
                // onChangeText={handleSearch}
                placeholderTextColor="black"
              />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
              <Ionicons name="options" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <BannerSlider />
          <HomePageLinks />

          <Text style={styles.categroyTitle}>
            {userDetails?.role === "EMPLOYER" ? "Workers" : "Services"}
          </Text>

          <CategoryButtons
            type={userDetails?.role === "EMPLOYER" ? "workers" : "services"}
            onCagtegoryChanged={onCatChanged}
            stylesProp={styles.categoryContainer}
          />

          {userDetails?.role === "EMPLOYER" ? (
            <ListingHorizontalWorkers
              availableInterest={WORKERTYPES}
              category={category}
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <ListingHorizontalServices
              category={category}
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}

          {userDetails?.role === "EMPLOYER" ? (
            <GroupWorkersListing
              category={category}
              listings={secondMemoizedData || []}
              loadMore={loadSecondMore}
              isFetchingNextPage={isSecondFetchingNextPage}
            />
          ) : (
            <GroupEmployersListing
              category={category}
              listings={secondMemoizedData || []}
              loadMore={loadSecondMore}
              isFetchingNextPage={isSecondFetchingNextPage}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgColor,
  },
  headingTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    marginTop: 10,
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
  searchBox: {
    color: "#000000",
    height: "100%",
    width: "92%",
    fontSize: 16,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginLeft: 20,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  row: {
    width: "48%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  secondRow: {
    width: "48%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
  },
  box: {
    height: 176,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  secondBox: {
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  firstBoxText: {
    width: 140,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    textAlign: "left",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  secondBoxText: {
    width: 140,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    textAlign: "left",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.9,
  },
  image: {
    width: 120,
    height: 150,
  },
  secondImage: {
    width: 70,
    height: 75,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333333",
  },
  subtitle: {
    fontSize: 10,
    color: "#888888",
  },
  singleBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  categroyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
  },
  categoryContainer: {},
});
