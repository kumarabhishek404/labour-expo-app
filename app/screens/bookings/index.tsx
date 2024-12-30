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
import { UserAtom } from "@/app/AtomStore/user";
import { router, Stack } from "expo-router";
import {
  acceptJoiningRequest,
  cancelJoiningRequest,
  rejectJoiningRequest,
} from "@/app/api/requests";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { EMPLOYERBOOKINGS, WORKERBOOKINGS, WORKERTYPES } from "@/constants";
import { toast } from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import {
  acceptBookingRequest,
  cancelBookingRequest,
  fetchAllBookedWorkers,
  fetchAllBookingReceivedRequests,
  fetchAllBookingSentRequests,
  rejectBookingRequest,
} from "@/app/api/booking";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";

const Bookings = () => {
  const userDetails = useAtomValue(UserAtom);
  const { refreshUser } = useRefreshUser();
  const [totalData, setTotalData] = useState(0);
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
    refetch,
  } = useInfiniteQuery({
    queryKey: ["bookings"],
    queryFn: ({ pageParam }) =>
      userDetails?.role === "EMPLOYER"
        ? fetchAllBookedWorkers({ pageParam })
        : fetchAllBookedWorkers({ pageParam }),
    initialPageParam: 1,
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
        ? fetchAllBookingSentRequests({ pageParam })
        : fetchAllBookingReceivedRequests({ pageParam }),
    initialPageParam: 1,
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
      setTotalData(totalData);
      const unsubscribe = setFilteredBookedWorkers(
        responseBookings?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [responseBookings])
  );

  useFocusEffect(
    React.useCallback(() => {
      const totalData = responseRequests?.pages[0]?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredReceivedRequests(
        responseRequests?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [responseRequests])
  );

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: (id) => cancelBookingRequest({ bookingId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while liking a worker - ", response);
    },
  });

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptBookingRequest"],
    mutationFn: (id) => acceptBookingRequest({ bookingId: id }),
    onSuccess: (response) => {
      refetch();
      refreshUser();
      toast.success(t("requestAcceptedSuccessfully"));
      console.log("Response while accepting a request - ", response);
    },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectBookingRequest"],
    mutationFn: (id) => rejectBookingRequest({ requestId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while rejecting request - ", response);
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
    refetch();
  };

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="Requests" left="back" right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader
          loading={
            isLoading ||
            isLoadingRequests ||
            mutationCancelRequest?.isPending ||
            mutationAcceptRequest?.isPending ||
            mutationRejectRequest?.isPending
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
              userDetails?.role === "EMPLOYER"
                ? EMPLOYERBOOKINGS
                : WORKERBOOKINGS
            }
            onCagtegoryChanged={onCatChanged}
          />

          <PaginationString
            type="requests"
            isLoading={isLoading || isRefetching || isRefetchingRequests}
            totalFetchedData={
              userDetails?.role === "EMPLOYER"
                ? memoizedBookedWorkers?.length
                : memoizedReceivedRequests?.length
            }
            totalData={totalData}
          />
          {category === "booking" ? (
            <ListingsVerticalWorkers
              style={{ flexGrow: 1 }}
              availableInterest={WORKERTYPES}
              listings={memoizedBookedWorkers || []}
              loadMore={loadMore}
              type="worker"
              isFetchingNextPage={isFetchingNextPage}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <ListingVerticalRequests
              listings={memoizedReceivedRequests || []}
              requestType={category}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPageRequests}
              onCancelRequest={mutationCancelRequest?.mutate}
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
