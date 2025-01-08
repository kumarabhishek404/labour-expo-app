import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { UserAtom } from "../../../AtomStore/user";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { usePullToRefresh } from "../../../hooks/usePullToRefresh";
import { WORKERS, WORKERTYPES } from "@/constants";
import * as Location from "expo-location";
import Filters from "@/components/commons/Filters";
import SearchFilter from "@/components/commons/SearchFilter";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { fetchAllWorkers } from "@/app/api/workers";
import { fetchAllServices } from "@/app/api/services";

const UserWorkers = () => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({}); // Store applied filters here

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["services", category, filters], // Add filters to queryKey to refetch when they change
    queryFn: ({ pageParam }) => {
      const payload = {
        pageParam,
        ...filters, // Add filters to the API request payload
      };
      return userDetails?.role === "EMPLOYER"
        ? fetchAllWorkers({ ...payload, skill: category })
        : fetchAllServices({ ...payload, status: "HIRING", skill: category });
    },
    retry: false,
    initialPageParam: 1,
    enabled: !!userDetails?._id,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current position
      let currentLocation = await Location.getCurrentPositionAsync({});
      // setLocation(currentLocation);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
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

  const handleApply = (appliedFilters: React.SetStateAction<any>) => {
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

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={
                userDetails?.role === "EMPLOYER" ? t("workers") : t("services")
              }
              right="notification"
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <SearchFilter
            type="users"
            data={response?.pages}
            setFilteredData={setFilteredData}
          />

          <CategoryButtons
            options={WORKERS}
            onCagtegoryChanged={onCatChanged}
          />

          <PaginationString
            type="services"
            isLoading={isLoading || isRefetching}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
            <>
              {userDetails?.role === "EMPLOYER" ? (
                <ListingsVerticalWorkers
                  type="worker"
                  availableInterest={WORKERTYPES}
                  listings={memoizedData || []}
                  loadMore={loadMore}
                  isFetchingNextPage={isFetchingNextPage}
                  refreshControl={
                    <RefreshControl
                      refreshing={!isRefetching && refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              ) : (
                <ListingsVerticalServices
                  listings={memoizedData || []}
                  loadMore={loadMore}
                  isFetchingNextPage={isFetchingNextPage}
                  refreshControl={
                    <RefreshControl
                      refreshing={!isRefetching && refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              )}
            </>
          ) : (
            <EmptyDatePlaceholder
              title={userDetails?.role === "EMPLOYER" ? "Worker" : "Service"}
            />
          )}
        </View>

        <Filters
          filterVisible={isFilterVisible}
          setFilterVisible={setFilterVisible}
          onApply={handleApply}
        />
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
});

export default UserWorkers;
