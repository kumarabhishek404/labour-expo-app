import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import Atoms from "@/app/AtomStore";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { Stack, useGlobalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import { StatusBar } from "react-native";
import CustomHeader from "@/components/commons/Header";
import { handleQueryKey } from "@/constants/functions";
import { t } from "@/utils/translationHelper";
import USER from "@/app/api/user";
import EMPLOYER from "@/app/api/employer";
import { WORKERTYPES } from "@/constants";

const Users = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const { title, type, searchCategory } = useGlobalSearchParams();

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [handleQueryKey(type), category],
    queryFn: async ({ pageParam }) =>
      (await type) === "booked"
        ? EMPLOYER?.fetchAllBookedWorkers({
            pageParam,
            skill: JSON?.parse(searchCategory as string)?.skill,
          })
        : (await type) === "saved"
        ? USER?.fetchAllLikedUsers({
            pageParam,
            skill: JSON?.parse(searchCategory as string)?.skill,
          })
        : USER?.fetchAllUsers({
            pageParam,
            name: JSON?.parse(searchCategory as string)?.name,
            skill: JSON?.parse(searchCategory as string)?.skill,
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

  // console.log("filteredData--", filteredData);

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const onCatChanged = (category: string) => {
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
          header: () => (
            <CustomHeader title={`${title}`} left="back" right="notification" />
          ),
        }}
      />
      <StatusBar backgroundColor={"#EAF0FF"} />
      <Loader loading={isLoading} />
      <View style={styles.container}>
        {/* <SearchFilter
          type="users"
          data={response?.pages}
          setFilteredData={setFilteredData}
        /> */}

        {/* <CategoryButtons
          options={WORKERTYPES}
          onCagtegoryChanged={onCatChanged}
        /> */}

        <PaginationString
          type="workers"
          isLoading={isLoading || isRefetching}
          totalFetchedData={memoizedData?.length}
          totalData={totalData}
        />

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
          <EmptyDatePlaceholder title={t("worker")} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default Users;
