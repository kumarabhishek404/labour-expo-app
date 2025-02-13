import Colors from "@/constants/Colors";
import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl, StatusBar } from "react-native";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import { Stack, useGlobalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import CustomHeader from "@/components/commons/Header";
import { WORKERTYPES } from "@/constants";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import EMPLOYER from "@/app/api/employer";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";

const Bookings = () => {
  const [totalBookingsData, setTotalBookingsData] = useState(0);
  const [filteredBookedWorkers, setFilteredBookedWorkers]: any = useState([]);
  const [filteredReceivedRequests]: any = useState([]);
  const { type, title, searchCategory } = useGlobalSearchParams();
  const [category] = useState("booking");

  const {
    data: responseBookings,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchBookings,
  } = useInfiniteQuery({
    queryKey: ["bookings"],
    queryFn: ({ pageParam }) =>
      EMPLOYER?.fetchAllBookedWorkers({
        pageParam,
        skill: JSON?.parse(searchCategory as string)?.skill,
      }),
    initialPageParam: 1,
    enabled: category === "booking",
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
    retry: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const totalData = responseBookings?.pages[0]?.pagination?.total;
      setTotalBookingsData(totalData);
      const unsubscribe = setFilteredBookedWorkers(
        responseBookings?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [responseBookings])
  );

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker"],
    mutationFn: (id: string) => EMPLOYER?.removeBookedWorker({ userId: id }),
    onSuccess: (response) => {
      refetchBookings();
      TOAST?.showToast?.success(t("removeBookedWorkerOrMediatorSuccessfully"));
    },
  });

  const mutationCancelBooking = useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: (id: string) => EMPLOYER?.cancelBooking({ bookingId: id }),
    onSuccess: () => {
      refetchBookings();
      TOAST?.showToast?.success(t("bookingCancelledSuccessfully"));
    },
    onError: (err) => {
      console.error("error while cancelling request to worker ", err);
    },
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedBookedWorkers = useMemo(
    () => filteredBookedWorkers?.flatMap((data: any) => data),
    [filteredBookedWorkers]
  );

  const memoizedReceivedRequests = useMemo(
    () => filteredReceivedRequests?.flatMap((data: any) => data),
    [filteredReceivedRequests]
  );

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetchBookings();
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
        <Loader
          loading={
            isLoading ||
            mutationCancelBooking?.isPending ||
            mutationRemoveBookedWorker?.isPending
          }
        />
        <View style={styles.container}>
          {memoizedBookedWorkers && memoizedBookedWorkers?.length > 0 ? (
            <>
              <View style={styles?.paginationTabs}>
                <PaginationString
                  type="request"
                  isLoading={isLoading || isRefetching}
                  totalFetchedData={memoizedBookedWorkers?.length}
                  totalData={totalBookingsData}
                />
              </View>

              <ListingsVerticalBookings
                style={{ flexGrow: 1 }}
                listings={memoizedBookedWorkers || []}
                loadMore={loadMore}
                type="booking"
                isFetchingNextPage={isFetchingNextPage}
                onRemoveBookedWorker={mutationRemoveBookedWorker?.mutate}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </>
          ) : (
            <EmptyDatePlaceholder title={"Booked Worker"} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 10,
  },
  paginationTabs: {
    width: "100%",
    paddingBottom: 10,
  },
});

export default Bookings;
