import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Stack, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import {
  fetchMyAppliedServicesMediator,
  fetchMyAppliedServicesWorker,
  fetchMyServices,
} from "../api/services";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import Loader from "@/components/commons/Loader";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import SearchFilter from "@/components/commons/SearchFilter";
import Header from "@/components/commons/Header";
import CustomHeader from "@/components/commons/Header";
import { MYSERVICES, SERVICES } from "@/constants";
import { t } from "@/utils/translationHelper";

const Services = () => {
  const userDetails = useAtomValue(UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [category, setCategory] = useState("Hiring");
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
      return userDetails?.role === "EMPLOYER"
        ? fetchMyServices({ pageParam, type: category })
        : userDetails?.role === "MEDIATOR"
          ? fetchMyAppliedServicesMediator({ pageParam })
          : fetchMyAppliedServicesWorker({ pageParam });
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
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page.data || [])
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
    // refetch();
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
                userDetails?.role === "EMPLOYER"
                  ? t("myServices")
                  : t("myBookings")
              }
              right="notification"
            />
          ),
        }}
      />

      <View style={{ flex: 1 }}>
        <Loader loading={isLoading || isRefetching} />
        <View style={styles.container}>
          <SearchFilter data={response} setFilteredData={setFilteredData} />

          <CategoryButtons
            options={MYSERVICES}
            onCagtegoryChanged={onCatChanged}
          />

          <PaginationString
            type="services"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
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
          ) : (
            <EmptyDatePlaceholder
              title={userDetails?.role === "EMPLOYER" ? "Service" : "Booking"}
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

export default Services;
