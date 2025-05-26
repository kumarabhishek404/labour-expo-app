import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
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
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import ListingsServices from "@/components/commons/ListingServices";
import { debounce } from "lodash";

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
      setFilteredData(response?.pages.flatMap((page: any) => page.data || []));
      return () => {}; // nothing to clean up
    }, [response])
  );

  // ✅ Ensure refetch happens when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Ensure fresh data is fetched when navigating back

      if (response) {
        setTotalData(response?.pages[0]?.pagination?.total || 0);
        setFilteredData(
          response?.pages.flatMap((page: any) => page.data || [])
        );
      }
    }, [response, refetch]) // Dependencies added for correct reactivity
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

  console.log("category---", category);

  const onCatChanged = (category: any) => {
    console.log("Category changed", category);

    setCategory(category?.value);
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  const RenderItem = React?.memo(({ item }: any) => {
    return <ListingsServices item={item} />;
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => <RenderItem item={item} />;

  const debouncedLoadMore = useMemo(() => debounce(loadMore, 300), [loadMore]);
  
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

      <View style={{ flex: 1 }}>
        {type === "myServices" && (
          <View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
            <CategoryButtons
              type="workerType"
              options={MYSERVICES}
              onCategoryChanged={onCatChanged}
            />
          </View>
        )}
        {isLoading ? (
          <ListingsServicesPlaceholder />
        ) : (
          <View style={styles.container}>
            {appliedFilters &&
              (appliedFilters?.distance ||
                appliedFilters?.duration ||
                appliedFilters?.serviceStartIn ||
                appliedFilters?.skills?.length > 0) && (
                <View style={{ marginVertical: 10 }}>
                  <AppliedFilters
                    appliedFilters={appliedFilters}
                    setAppliedFilters={setAppliedFilters}
                    fetchUsers={() => {}}
                  />
                </View>
              )}

            {memoizedData && memoizedData?.length > 0 ? (
              <FlatList
                data={memoizedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index?.toString()}
                onEndReached={debouncedLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={() =>
                  isFetchingNextPage ? (
                    <ActivityIndicator
                      size="large"
                      color={Colors?.primary}
                      style={styles.loaderStyle}
                    />
                  ) : null
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={3}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: 230 }}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <EmptyDataPlaceholder title="service" />
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

export default Services;
