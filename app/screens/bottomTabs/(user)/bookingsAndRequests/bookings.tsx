import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Stack, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import Loader from "@/components/commons/Loaders/Loader";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { MYSERVICES } from "@/constants";
import { t } from "@/utils/translationHelper";
import SERVICE from "@/app/api/services";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import Colors from "@/constants/Colors";
import CustomTabs from "./customTabs";
import SegmantedButton from "./customTabs";
import CustomSegmentedButton from "./customTabs";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";

const Bookings = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [category, setCategory] = useState("selected");

  const TABS: any = [
    { value: "selected", label: "selected", count: 31 },
    { value: "applied", label: "applied", count: 20 },
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
      return SERVICE?.fetchMyAppliedServicesMediator({
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

  if (isLoading || isFetchingNextPage) {
    return <OnPageLoader />;
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {memoizedData && memoizedData?.length > 0 ? (
            <>
              <View style={styles?.paginationTabs}>
                <CustomSegmentedButton
                  buttons={TABS}
                  selectedTab={category}
                  onValueChange={onCatChanged}
                />
                {/* <View style={{ width: "40%" }}> */}
                <PaginationString
                  type="services"
                  isLoading={isLoading || isRefetching}
                  totalFetchedData={memoizedData?.length}
                  totalData={totalData}
                />
                {/* </View>
                <View style={{ width: "60%" }}>
                  
                </View> */}
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
            <EmptyDatePlaceholder title={"Booking"} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  paginationTabs: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});

export default Bookings;
