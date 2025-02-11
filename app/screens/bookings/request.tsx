import Colors from "@/constants/Colors";
import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
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
import ListingVerticalBookingRequests from "@/components/commons/ListingVerticalBookingRequests";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import EMPLOYER from "@/app/api/employer";
import WORKER from "@/app/api/workers";

const Bookings = () => {
  const firstTimeRef = React.useRef(true);
  const [totalBookingsData, setTotalBookingsData] = useState(0);
  const [totalRequestsData, setTotalRequestsData] = useState(0);
  const [filteredBookedWorkers, setFilteredBookedWorkers]: any = useState([]);
  const [filteredReceivedRequests, setFilteredReceivedRequests]: any = useState(
    []
  );
  const { title, type, searchCategory } = useGlobalSearchParams();
  const [category, setCategory] = useState("booking");

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

  const {
    data: responseRequests,
    isLoading: isLoadingRequests,
    isRefetching: isRefetchingRequests,
    isFetchingNextPage: isFetchingNextPageRequests,
    fetchNextPage: fetchNextPageRequests,
    hasNextPage: hasNextPageRequests,
    refetch: refetchRequests,
  } = useInfiniteQuery({
    queryKey: ["myBookings"],
    queryFn: ({ pageParam }) =>
      WORKER?.fetchAllBookingReceivedInvitations({ pageParam }),
    initialPageParam: 1,
    enabled: category === "request",
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
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      if (category === "booking") refetchBookings();
      else refetchRequests();
    }, [refetchRequests])
  );

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

  useFocusEffect(
    React.useCallback(() => {
      const totalData = responseRequests?.pages[0]?.pagination?.total;
      setTotalRequestsData(totalData);
      const unsubscribe = setFilteredReceivedRequests(
        responseRequests?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [responseRequests])
  );

  const mutationCancelBookingRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: (id: string) => EMPLOYER?.cancelBookingRequest({ userId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorkerOrMediator"],
    mutationFn: (id: string) => EMPLOYER?.removeBookedWorker({ userId: id }),
    onSuccess: (response) => {
      refetchBookings();
      TOAST?.showToast?.success(t("removeBookedWorkerOrMediatorSuccessfully"));
    },
  });

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptBookingRequest"],
    mutationFn: (id) => WORKER?.acceptBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestAcceptedSuccessfully"));
      console.log("Response while accepting a request - ", response);
    },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectBookingRequest"],
    mutationFn: (id) => WORKER?.rejectBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestRejectedSuccessfully"));
      console.log("Response while rejecting request - ", response);
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

  const onCatChanged = (category: string) => {
    setCategory(category);
    // Explicitly call the refetch function for the current query
    if (category === "booking") {
      refetchBookings();
    } else if (category === "request") {
      refetchRequests();
    }
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      if (category === "booking") {
        await refetchBookings();
      } else if (category === "request") {
        await refetchRequests();
      }
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t("bookings")}
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
            isLoadingRequests ||
            mutationCancelBookingRequest?.isPending ||
            mutationAcceptRequest?.isPending ||
            mutationRejectRequest?.isPending ||
            mutationCancelBooking?.isPending ||
            mutationRemoveBookedWorker?.isPending
          }
        />
        <View style={styles.container}>
          {/* <SearchFilter
            type="users"
            data={
              category === "booking"
                ? responseBookings?.pages
                : responseRequests?.pages
            }
            setFilteredData={
              category === "booking"
                ? setFilteredBookedWorkers
                : setFilteredReceivedRequests
            }
          /> */}

          {/* <CategoryButtons
            options={userDetails?.isAdmin ? ADMIN_BOOKINGS : WORKER_BOOKINGS}
            onCagtegoryChanged={onCatChanged}
          /> */}

          <PaginationString
            type="request"
            isLoading={isLoading || isRefetching || isRefetchingRequests}
            totalFetchedData={
              category === "booking"
                ? memoizedBookedWorkers?.length
                : memoizedReceivedRequests?.length
            }
            totalData={
              category === "booking" ? totalBookingsData : totalRequestsData
            }
          />
          {category === "booking" ? (
            <ListingsVerticalBookings
              style={{ flexGrow: 1 }}
              availableInterest={WORKERTYPES}
              listings={memoizedBookedWorkers || []}
              loadMore={loadMore}
              type="booking"
              isFetchingNextPage={isFetchingNextPage}
              onCancelBooking={mutationCancelBooking?.mutate}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <ListingVerticalBookingRequests
              listings={memoizedReceivedRequests || []}
              requestType={category}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPageRequests}
              onCancelRequest={mutationCancelBookingRequest?.mutate}
              onAcceptRequest={mutationAcceptRequest?.mutate}
              onRejectRequest={mutationRejectRequest?.mutate}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetchingRequests && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
    paddingHorizontal: 10,
  },
});

export default Bookings;
