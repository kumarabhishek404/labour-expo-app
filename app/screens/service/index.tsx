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
import CustomHeader from "@/components/commons/Header";
import { MYSERVICES } from "@/constants";
import USER from "@/app/api/user";
import EMPLOYER from "@/app/api/employer";
import Colors from "@/constants/Colors";
import AppliedFilters from "@/components/commons/AppliedFilters";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";

const Services = () => {
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [category, setCategory] = useState("HIRING");
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
    queryKey: [
      type === "saved"
        ? "savedServices"
        : type === "myServices"
        ? "myServices"
        : type === "booked"
        ? "booked"
        : "services",
      category,
      appliedFilters,
    ],
    queryFn: ({ pageParam }) =>
      type === "saved"
        ? USER?.fetchAllLikedServices({ pageParam })
        : type === "myServices"
        ? EMPLOYER?.fetchMyServices({
            pageParam,
            status: category,
          })
        : type === "booked"
        ? EMPLOYER?.fetchAllBookedWorkers({
            pageParam,
            skill: appliedFilters?.skill,
          })
        : SERVICE?.fetchAllServices({
            pageParam,
            status: "ACTIVE",
            payload: {
              distance: appliedFilters?.distance,
              duration: appliedFilters?.duration,
              serviceStartIn: appliedFilters?.serviceStartIn,
              skills: appliedFilters?.skills,
            },
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

  const onCatChanged = (category: any) => {
    setCategory(category?.value);
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
              title={title as string}
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <Loader loading={isLoading || isRefetching} />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {type === "myServices" && (
            <CategoryButtons
              type="workerType"
              options={MYSERVICES}
              onCategoryChanged={onCatChanged}
            />
          )}
          {/* {appliedFilters && appliedFilters?.length > 0 && ( */}
          <AppliedFilters
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
            fetchUsers={() => {}}
          />
          {/* )} */}

          <View style={{ marginBottom: 5 }}>
            <PaginationString
              type="services"
              isLoading={isLoading || isRefetching}
              totalFetchedData={memoizedData?.length}
              totalData={totalData}
            />
          </View>

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
            <EmptyDatePlaceholder title="service" />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 10,
  },
});

export default Services;
