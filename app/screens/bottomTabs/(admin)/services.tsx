import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { MYSERVICES, WORKERS } from "@/constants";
import Filters from "@/components/commons/Filters";
import SearchFilter from "@/components/commons/SearchFilter";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import SERVICE from "@/app/api/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import FetchLocationNote from "@/components/commons/FetchLocationNote";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";

const AdminServices = () => {
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("HIRING");
  const [secondaryCategory, setSecondaryCategory] = useState("");

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["services", category, secondaryCategory, filters],
    queryFn: ({ pageParam }) => {
      const payload = {
        pageParam,
        ...filters,
      };
      return SERVICE?.fetchAllServices({
        ...payload,
        status: category,
        skill: secondaryCategory,
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

  const loadMore = () => {
    console.log("Load more--", hasNextPage, isFetchingNextPage);

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

  const onSecondaryCatChanged = (category: React.SetStateAction<string>) => {
    setSecondaryCategory(category);
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
          header: () => (
            <CustomHeader
              title={t("services")}
              left="menu"
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
            type="services"
            data={response?.pages}
            setFilteredData={setFilteredData}
          />

          <CategoryButtons
            type="workerType"
            options={MYSERVICES}
            onCategoryChanged={onCatChanged}
          />

          <CategoryButtons
            type="workerType"
            options={WORKERS}
            onCategoryChanged={onSecondaryCatChanged}
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
            <EmptyDatePlaceholder title="Service" />
          )}
        </View>

        <Filters
          filterVisible={isFilterVisible}
          setFilterVisible={setFilterVisible}
          onApply={handleApply}
        />
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

export default AdminServices;
