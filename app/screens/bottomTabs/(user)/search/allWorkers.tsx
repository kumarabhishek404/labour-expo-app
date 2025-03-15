import React, { useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import FloatingButton from "@/components/inputs/FloatingButton";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import FiltersWorkers from "./filterWorkers";

const AllWorkers = ({
  isLoading,
  isRefetching,
  isFetchingNextPage,
  refreshing,
  memoizedData,
  onRefresh,
  totalData,
  loadMore,
}: any) => {
  const [isAddFilters, setIsAddFilters] = useState(false);

  const onSearchWorkers = (data: any) => {
    setIsAddFilters(false);
    const searchCategory = {
      distance: data?.distance,
      completedServices: data?.completedServices,
      rating: data?.rating,
      skills: data?.skills,
    };

    router?.push({
      pathname: "/screens/users",
      params: {
        title: "allWorkers",
        type: "all",
        searchCategory: JSON.stringify(searchCategory),
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <OnPageLoader />
      ) : (
        <View style={styles.container}>
          <View style={styles?.paginationHeader}>
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
            <EmptyDatePlaceholder title="worker" />
          )}

          <FiltersWorkers
            filterVisible={isAddFilters}
            setFilterVisible={setIsAddFilters}
            onApply={onSearchWorkers}
          />

          <FloatingButton
            title="applyFilters"
            onPress={() => setIsAddFilters(true)}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  paginationHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default AllWorkers;
