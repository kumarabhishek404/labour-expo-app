import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { Stack, useGlobalSearchParams } from "expo-router";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SERVICE from "@/app/api/services";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { MYSERVICES, SERVICES, WORKERTYPES, WORKTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";
import USER from "@/app/api/user";
import EMPLOYER from "@/app/api/employer";

const Services = () => {
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [category, setCategory] = useState("HIRING");
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
    queryKey: [
      type === "saved"
        ? "savedServices"
        : type === "myServices"
        ? "myServices"
        : type === "booked"
        ? "booked"
        : "services",
      category,
    ],
    queryFn: ({ pageParam }) =>
      type === "saved"
        ? USER?.fetchAllLikedServices({ pageParam })
        : type === "myServices"
        ? EMPLOYER?.fetchMyServices({
            pageParam,
            status: "",
          })
        : type === "booked"
        ? EMPLOYER?.fetchAllBookedWorkers({
            pageParam,
            skill: JSON?.parse(searchCategory as string)?.skill,
          })
        : SERVICE?.fetchAllServices({
            pageParam,
            status: "ACTIVE",
            type: searchCategory && JSON?.parse(searchCategory as string)?.type,
            subType:
              searchCategory && JSON?.parse(searchCategory as string)?.subType,
            skill:
              searchCategory && JSON?.parse(searchCategory as string)?.skill,
          }),
    initialPageParam: 1,
    retry: false,
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
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          {/* <SearchFilter
            type="services"
            data={response?.pages}
            setFilteredData={setFilteredData}
          /> */}
          {/* 
          <CategoryButtons
            options={WORKTYPES}
            onCagtegoryChanged={onCatChanged}
          /> */}

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
            <EmptyDatePlaceholder title={t("mediators")} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    paddingHorizontal: 10,
  },
});

export default Services;
