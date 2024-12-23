import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import { UserAtom } from "@/app/AtomStore/user";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { Stack, useGlobalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";
import {
  EMPLOYER,
  MEDIATOR,
  MEDIATORTYPES,
  WORKERS,
  WORKERTYPES,
} from "@/constants";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { handleQueryFunction, handleQueryKey } from "@/constants/functions";
import { t } from "@/utils/translationHelper";

const Users = () => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const { role, title, type } = useGlobalSearchParams();

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [handleQueryKey(role, type), category],
    queryFn: ({ pageParam }) =>
      handleQueryFunction(role, type, pageParam, category),
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
      const totalData = (response?.pages[0] as any)?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page?.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const handleSearch = (text: any) => {
    setSearchText(text);
    let workers = response?.pages.flatMap((page: any) => page.data || []);
    const filtered: any = workers?.filter(
      (item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase())
      // item.location.toLowerCase().includes(text.toLowerCase()) ||
      // item.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
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

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={`${title}`} left="back" />,
        }}
      />
      <Loader loading={isLoading || isRefetching} />
      <View style={styles.container}>
        <SearchFilter data={response} setFilteredData={setFilteredData} />

        <CategoryButtons
          options={
            role === "workers"
              ? WORKERS
              : role === "mediators"
              ? MEDIATOR
              : EMPLOYER
          }
          onCagtegoryChanged={onCatChanged}
        />

        <PaginationString
          type={Array.isArray(role) ? role[0] : role}
          isLoading={isLoading}
          totalFetchedData={memoizedData?.length}
          totalData={totalData}
        />

        {memoizedData && memoizedData?.length > 0 ? (
          <ListingsVerticalWorkers
            style={styles.listContainer}
            availableInterest={role === "workers" ? WORKERTYPES : MEDIATORTYPES}
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
          <EmptyDatePlaceholder title={t("worker")} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default Users;
