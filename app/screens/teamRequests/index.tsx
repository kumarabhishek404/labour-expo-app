import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { View, StyleSheet, RefreshControl, StatusBar } from "react-native";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import Atoms from "@/app/AtomStore";
import { Stack, useLocalSearchParams } from "expo-router";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { ALLREQUEST } from "@/constants";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import CustomSegmentedButton from "../bottomTabs/(user)/bookingsAndRequests/customTabs";
import WORKER from "@/app/api/workers";
import EMPLOYER from "@/app/api/employer";
import MEDIATOR from "@/app/api/mediator";

const Requests = () => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState("RECEIVED");
  const { title } = useLocalSearchParams();

  const fetchRequests =
    category === "RECEIVED"
      ? WORKER.fetchAllRecievedTeamRequests
      : MEDIATOR.fetchSentTeamRequests;

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [category],
    queryFn: ({ pageParam }) => fetchRequests({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.page < lastPage?.pagination?.pages
        ? lastPage?.pagination?.page + 1
        : undefined;
    },
    retry: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [category])
  );

  useFocusEffect(
    React.useCallback(() => {
      const totalData = response?.pages[0]?.pagination?.total || 0;
      setTotalData(totalData);
      setFilteredData(response?.pages?.flatMap((page) => page.data || []));
    }, [response])
  );

  const mutationAcceptRequest = useMutation({
    mutationFn: (id) => WORKER.acceptTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      refreshUser();
      TOAST?.success(t("requestAcceptedSuccessfully"));
    },
  });

  const mutationRejectRequest = useMutation({
    mutationFn: (id) => WORKER.rejectTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
    },
  });

  const mutationCancelRequest = useMutation({
    mutationFn: (id) => MEDIATOR.cancelTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
    },
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onCategoryChanged = (selectedCategory: any) => {
    setCategory(selectedCategory);
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(() =>
    refetch()
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
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <View style={styles?.paginationTabs}>
            <CustomSegmentedButton
              buttons={ALLREQUEST}
              selectedTab={category}
              onValueChange={onCategoryChanged}
            />
          </View>
          <PaginationString
            type="requests"
            isLoading={isLoading || isRefetching}
            totalFetchedData={filteredData?.length}
            totalData={totalData}
          />
          {filteredData && filteredData?.length > 0 ? (
            <ListingVerticalRequests
              listings={filteredData || []}
              requestType="teamJoiningRequest"
              isLoading={
                mutationCancelRequest?.isPending ||
                mutationAcceptRequest?.isPending ||
                mutationRejectRequest?.isPending
              }
              loadMore={loadMore}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
              isFetchingNextPage={isFetchingNextPage}
              onCancelRequest={mutationCancelRequest.mutate}
              onAcceptRequest={mutationAcceptRequest.mutate}
              onRejectRequest={mutationRejectRequest.mutate}
            />
          ) : (
            <EmptyDatePlaceholder title="requests" leftHeight={300} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 10,
  },
  paginationTabs: {
    width: "100%",
    flexDirection: "column",
    paddingBottom: 10,
  },
});

export default Requests;
