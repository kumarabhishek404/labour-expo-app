import React, { useEffect, useMemo, useState } from "react";
import * as Speech from "expo-speech";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import TabSwitcher from "@/components/inputs/Tabs";
import { useInfiniteQuery } from "@tanstack/react-query";
import SERVICE from "@/app/api/services";
import { router, useFocusEffect, useNavigation } from "expo-router";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import AllServices from "./allServices";
import AllWorkers from "./allWorkers";
import USER from "@/app/api/user";
import GradientWrapper from "@/components/commons/GradientWrapper";
import Colors from "@/constants/Colors";

const Search = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const TABS = [
    {
      label: "workers",
      // description: "descriptionWorkers",
    },
    {
      label: "services",
      // description: "descriptionServices",
    },
  ];

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["allServices", selectedTab],
    queryFn: ({ pageParam }) =>
      selectedTab === 0
        ? USER?.fetchAllUsers({
            pageParam,
          })
        : SERVICE?.fetchAllServices({
            pageParam,
            status: "ACTIVE",
          }),
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
    // Stop any ongoing speech
    Speech.stop();

    return () => {
      // Cleanup function to ensure speech stops when component unmounts or before effect re-runs
      Speech.stop();
    };
  }, [selectedTab]);

  useFocusEffect(
    React.useCallback(() => {
      refetch(); // <-- Trigger API call when tab is selected
    }, [selectedTab])
  );

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

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <TabSwitcher
        tabs={TABS}
        actvieTab={selectedTab}
        setActiveTab={setSelectedTab}
      />

      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "flex-start", gap: 20 }}>
          {selectedTab === 0 && (
            <AllWorkers
              isLoading={isLoading}
              isRefetching={isRefetching}
              isFetchingNextPage={isFetchingNextPage}
              refreshing={refreshing}
              memoizedData={memoizedData}
              onRefresh={onRefresh}
              totalData={totalData}
              loadMore={loadMore}
            />
          )}
          {selectedTab === 1 && (
            <AllServices
              isLoading={isLoading}
              isRefetching={isRefetching}
              isFetchingNextPage={isFetchingNextPage}
              refreshing={refreshing}
              memoizedData={memoizedData}
              onRefresh={onRefresh}
              totalData={totalData}
              loadMore={loadMore}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    minHeight: "100%",
    // paddingBottom: 75,
  },
  shadowBox: {
    shadowColor: "#000", // Subtle black shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.1, // Light shadow for elegance
    shadowRadius: 6, // Smooth blur effect
    elevation: 4, // Works for Android
  },
});
