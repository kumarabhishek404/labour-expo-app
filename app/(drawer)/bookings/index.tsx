import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import Atoms from "@/app/AtomStore";
import { router, Stack } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import {
  ADMIN_BOOKINGS,
  EMPLOYER_BOOKINGS,
  WORKER_BOOKINGS,
  WORKERTYPES,
} from "@/constants";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import BOOKING from "@/app/api/booking";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import ListingVerticalBookingRequests from "@/components/commons/ListingVerticalBookingRequests";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";

const Bookings = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const firstTimeRef = React.useRef(true);
  const [totalBookingsData, setTotalBookingsData] = useState(0);
  const [totalRequestsData, setTotalRequestsData] = useState(0);
  const [filteredBookedWorkers, setFilteredBookedWorkers]: any = useState([]);
  const [filteredReceivedRequests, setFilteredReceivedRequests]: any = useState(
    []
  );
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
      userDetails?.role === "EMPLOYER"
        ? BOOKING?.fetchAllBookedWorkers({ pageParam })
        : BOOKING?.fetchAllMyBookings({ pageParam }),
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
      userDetails?.role === "EMPLOYER"
        ? BOOKING?.fetchAllBookingSentRequests({ pageParam })
        : BOOKING?.fetchAllBookingReceivedRequests({ pageParam }),
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
    mutationFn: (id: string) => BOOKING?.cancelBookingRequest({ userId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorkerOrMediator"],
    mutationFn: (id: string) => BOOKING?.removeBookedWorker({ userId: id }),
    onSuccess: (response) => {
      refetchBookings();
      TOAST?.showToast?.success(t("removeBookedWorkerOrMediatorSuccessfully"));
    },
  });

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptBookingRequest"],
    mutationFn: (id) => BOOKING?.acceptBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestAcceptedSuccessfully"));
      console.log("Response while accepting a request - ", response);
    },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectBookingRequest"],
    mutationFn: (id) => BOOKING?.rejectBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetchRequests();
      TOAST?.showToast?.success(t("bookingRequestRejectedSuccessfully"));
      console.log("Response while rejecting request - ", response);
    },
  });

  const mutationCancelBooking = useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: (id: string) => BOOKING?.cancelBooking({ bookingId: id }),
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
            <CustomHeader title="Requests" left="menu" right="notification" />
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
          <SearchFilter
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
          />

          <CategoryButtons
            options={
              userDetails?.role === "ADMIN"
                ? ADMIN_BOOKINGS
                : userDetails?.role === "EMPLOYER"
                ? EMPLOYER_BOOKINGS
                : WORKER_BOOKINGS
            }
            onCagtegoryChanged={onCatChanged}
          />

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
              onCancelBooking={
                userDetails?.role === "EMPLOYER"
                  ? mutationRemoveBookedWorker?.mutate
                  : mutationCancelBooking?.mutate
              }
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
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
  },
});

export default Bookings;
