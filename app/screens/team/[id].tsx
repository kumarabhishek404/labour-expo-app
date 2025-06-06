import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import MEDIATOR from "@/app/api/mediator";
import { Stack, useLocalSearchParams } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import { WORKERTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";
import { useAtom, useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Colors from "@/constants/Colors";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";

const Members = () => {
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("");
  const { id } = useLocalSearchParams();

  const {
    data: response,
    isLoading,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["members", category, id],
    queryFn: ({ pageParam }) =>
      MEDIATOR?.fetchAllMembers({
        mediatorId: id,
        pageParam,
        category,
      }),
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
      refetch();
    }, [category])
  );

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => {
          setTotalData(page?.data[0]?.workers?.length);
          return page?.data[0]?.workers || [];
        })
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
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="members" left="back" right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <PaginationString
            type="members"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
            <ListingsVerticalWorkers
              listings={memoizedData || []}
              category="workers"
              loadMore={loadMore}
              isFetchingNextPage={isFetchingNextPage}
              availableInterest={WORKERTYPES}
              type="member"
            />
          ) : (
            <EmptyDataPlaceholder title="members" />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 8,
  },
});

export default Members;
