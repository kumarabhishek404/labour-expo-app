import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { UserAtom } from "../../AtomStore/user";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllLikedServices } from "../../api/services";
import Loader from "@/components/commons/Loader";
import { fetchAllLikedWorkers } from "../../api/workers";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";
import {  SERVICES, WORKERS, WORKERTYPES } from "@/constants";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";

const Favourite = (props: any) => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("All");

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["favourites"],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? fetchAllLikedWorkers({ pageParam })
        : fetchAllLikedServices({ pageParam });
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
          header: () => (
            <CustomHeader title="Favourite" left="back" right="notification" />
          ),
        }}
      />

      <Loader loading={isLoading || isRefetching} />
      <View style={styles.container}>
        <SearchFilter data={response} setFilteredData={setFilteredData} />

        <CategoryButtons
          options={
            userDetails?.role === "EMPLOYER"
              ? WORKERS
              : SERVICES
          }
          onCagtegoryChanged={onCatChanged}
        />

        <PaginationString
          type="services"
          isLoading={isLoading}
          totalFetchedData={memoizedData?.length}
          totalData={totalData}
        />

        {userDetails?.role === "EMPLOYER" ? (
          <ListingsVerticalWorkers
            type="employer"
            availableInterest={WORKERTYPES}
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
  },
});

export default Favourite;
