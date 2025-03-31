import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import Atoms from "@/app/AtomStore";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { Stack, useGlobalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import CustomHeader from "@/components/commons/Header";
import { handleQueryKey } from "@/constants/functions";
import USER from "@/app/api/user";
import EMPLOYER from "@/app/api/employer";
import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import AppliedFilters from "@/components/commons/AppliedFilters";
import ListingsWorkersPlaceholder from "@/components/commons/LoadingPlaceholders/ListingVerticalWorkerPlaceholder";

const Users = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("");
  const { title, type, searchCategory } = useGlobalSearchParams();
  const [appliedFilters, setAppliedFilters] = useState(() => {
    try {
      return searchCategory ? JSON.parse(searchCategory as string) : {};
    } catch (error) {
      return {};
    }
  });

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [handleQueryKey(type), category, appliedFilters],
    queryFn: async ({ pageParam }) =>
      type === "booked"
        ? EMPLOYER?.fetchAllBookedWorkers({
            pageParam,
            skill: appliedFilters?.skill,
          })
        : type === "saved"
        ? USER?.fetchAllLikedUsers({
            pageParam,
            skill: appliedFilters?.skill,
          })
        : USER?.fetchAllUsers({
            pageParam,
            payload: {
              completedServices: appliedFilters?.completedServices,
              rating: appliedFilters?.rating,
              distance: appliedFilters?.distance,
              skills: appliedFilters?.skills,
            },
          }),
    retry: false,
    initialPageParam: 1,
    enabled: !!userDetails?._id && userDetails?.status === "ACTIVE",
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const totalData = (response?.pages[0] as any)?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page?.data || [])
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

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={title as string}
              left="back"
              right="notification"
            />
          ),
        }}
      />
      {isLoading ? (
        <ListingsWorkersPlaceholder />
      ) : (
        <View style={styles.container}>
          {appliedFilters &&
            (appliedFilters?.completedServices ||
              appliedFilters?.distance ||
              appliedFilters?.rating > 0 ||
              appliedFilters?.skills?.length > 0) && (
              <View style={{ marginTop: 10 }}>
                <AppliedFilters
                  appliedFilters={appliedFilters}
                  setAppliedFilters={setAppliedFilters}
                  fetchUsers={() => {}}
                />
              </View>
            )}
          <View style={{ marginVertical: 10 }}>
            <PaginationString
              type="workers"
              isLoading={isLoading || isRefetching}
              totalFetchedData={memoizedData?.length}
              totalData={totalData}
            />
          </View>

          {memoizedData && memoizedData?.length > 0 ? (
            <ListingsVerticalWorkers
              style={styles.listContainer}
              availableInterest={WORKERTYPES}
              listings={memoizedData || []}
              loadMore={loadMore}
              type={"worker"}
              isFetchingNextPage={isFetchingNextPage}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <EmptyDataPlaceholder title="worker" />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default Users;
