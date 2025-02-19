import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import CustomSegmentedButton from "./customTabs";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import WORKER from "@/app/api/workers";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";

const Bookings = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [category, setCategory] = useState("selected");

  const TABS: any = [
    { value: "selected", label: "selected" },
    { value: "applied", label: "applied" },
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
    queryKey: ["myServices", category],
    queryFn: ({ pageParam }) => {
      return category === "selected"
        ? WORKER?.fetchAllMyBookings({
            pageParam,
          })
        : WORKER?.fetchMyAppliedServices({
            pageParam,
          });
    },
    retry: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
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

      // For employers, keep existing behavior
      // setFilteredData(
      //   response?.pages.flatMap((page: any) => page.data || [])
      // );
      // For mediators and workers, combine both responses
      const appliedServices =
        response?.pages?.flatMap((page: any) => page.data || []) || [];

      setFilteredData([...appliedServices]);
    }, [response, userDetails?.role])
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data) || [],
    [filteredData]
  );

  const onCatChanged = (category: string) => {
    setCategory(category);
    // refetch();
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  if (isLoading) {
    return <OnPageLoader />;
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
                  type="services"
                  isLoading={isLoading || isRefetching}
                  totalFetchedData={memoizedData?.length}
                  totalData={totalData}
                />
              </View>
              <ListingsVerticalServices
                listings={memoizedData || []}
                isFetchingNextPage={isFetchingNextPage}
                loadMore={loadMore}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </>
          ) : (
            <EmptyDatePlaceholder title={"Booking"} leftHeight={300} />
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

export default Bookings;
