import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import CustomSegmentedButton from "./customTabs";
import WORKER from "@/app/api/workers";
import EMPLOYER from "@/app/api/employer";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";

const Requests = () => {
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("recievedRequests");

  const TABS = [
    { value: "recievedRequests", label: "received" },
    { value: "sentRequests", label: "sent" },
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
    queryKey: [
      category === "recievedRequests" ? "recievedRequests" : "sentRequests",
    ],
    queryFn: ({ pageParam }) =>
      category === "recievedRequests"
        ? WORKER?.fetchAllBookingReceivedInvitations({ pageParam })
        : EMPLOYER?.fetchAllBookingSentRequests({ pageParam }),
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
        response?.pages?.flatMap((page: any) => page.data || [])
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

  const onCatChanged = (category: string) => {
    setCategory(category);
    refetch();
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  if (isLoading) {
    return <OnPageLoader parentStyle={{ flex: 1 }} />;
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <CustomSegmentedButton
            buttons={TABS}
            selectedTab={category}
            onValueChange={onCatChanged}
          />
          {memoizedData && memoizedData?.length > 0 ? (
            <>
              <View style={styles?.paginationTabs}>
                <PaginationString
                  type={category}
                  isLoading={isLoading || isRefetching}
                  totalFetchedData={memoizedData?.length}
                  totalData={totalData}
                />
              </View>
              <ListingsVerticalBookings
                listings={memoizedData || []}
                category={category}
                loadMore={loadMore}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
                isFetchingNextPage={isFetchingNextPage}
              />
            </>
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
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  paginationTabs: {
    width: "100%",
    paddingBottom: 6,
  },
});

export default Requests;
