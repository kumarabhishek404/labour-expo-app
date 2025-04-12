import Colors from "@/constants/Colors";
import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import { Stack, useGlobalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import CustomHeader from "@/components/commons/Header";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings"; // ✅ Fixed component
import EMPLOYER from "@/app/api/employer";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsBookingsPlaceholder from "@/components/commons/LoadingPlaceholders/ListingBookingPlaceholder";

const Bookings = () => {
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const { title, searchCategory } = useGlobalSearchParams();

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["bookedWorkers"],
    queryFn: ({ pageParam }) =>
      EMPLOYER?.fetchAllBookedWorkers({
        pageParam,
        skill: searchCategory
          ? JSON.parse(searchCategory as string)?.skill
          : undefined,
      }),
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.pagination?.page < lastPage?.pagination?.pages
        ? lastPage?.pagination?.page + 1
        : undefined;
    },
  });

  // ✅ Ensure refetch happens when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Ensure fresh data is fetched when navigating back

      if (response) {
        setTotalData(response?.pages[0]?.pagination?.total || 0);
        setFilteredData(
          response?.pages.flatMap((page: any) => page.data || [])
        );
      }
    }, [response, refetch]) // Dependencies added for correct reactivity
  );

  // ✅ Handle loading more data
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // ✅ Memoize booked workers data
  const memoizedBookedWorkers = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  // ✅ Handle pull-to-refresh properly
  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={title as string}
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        {/* <Loader loading={isLoading} /> */}
        {isLoading ? (
          <ListingsBookingsPlaceholder />
        ) : (
          <View style={styles.container}>
            {/* <PaginationString
              type="bookedWorker"
              isLoading={isLoading || isRefetching}
              totalFetchedData={memoizedBookedWorkers?.length}
              totalData={totalData}
            /> */}

            {memoizedBookedWorkers?.length > 0 ? (
              <ListingsVerticalBookings // ✅ Fixed component
                listings={memoizedBookedWorkers}
                loadMore={loadMore}
                isFetchingNextPage={isFetchingNextPage}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <EmptyDataPlaceholder title="bookedWorker" />
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 10,
    gap: 10,
  },
});

export default Bookings;
