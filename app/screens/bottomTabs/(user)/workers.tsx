import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Atoms from "@/app/AtomStore";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { WORKERS } from "@/constants";
import SearchFilter from "@/components/commons/SearchFilter";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import SERVICE from "@/app/api/services";
import FetchLocationNote from "@/components/commons/FetchLocationNote";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";

const UserWorkers = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({}); // Store applied filters here

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["services", category, filters], // Add filters to queryKey to refetch when they change
    queryFn: ({ pageParam }) => {
      const payload = {
        pageParam,
        ...filters, // Add filters to the API request payload
      };
      return SERVICE?.fetchAllServices({
        ...payload,
        status: "HIRING",
        skill: category,
      });
    },
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

  const handleApply = (appliedFilters: React.SetStateAction<any>) => {
    // Apply filters to API call and close modal
    setFilters(appliedFilters);
    setFilterVisible(false); // Close the modal
  };

  const handleClear = () => {
    // Clear all filters and refetch data
    setFilters({});
    setFilterVisible(false);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const onCatChanged = (category: React.SetStateAction<string>) => {
    setCategory(category);
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          header: () => (
            <CustomHeader
              title="services"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <FetchLocationNote motiveItem="workers" />
          <SearchFilter
            type="users"
            data={response?.pages}
            setFilteredData={setFilteredData}
          />

          <CategoryButtons
            type="workerType"
            options={WORKERS}
            onCategoryChanged={onCatChanged}
          />

          <PaginationString
            type="services"
            isLoading={isLoading || isRefetching}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
            <ListingsVerticalServices
              listings={memoizedData || []}
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            // </>
            <EmptyDataPlaceholder title="service" />
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

export default UserWorkers;
