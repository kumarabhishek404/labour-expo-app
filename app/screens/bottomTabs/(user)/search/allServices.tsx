import React, { useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import FloatingButton from "@/components/inputs/FloatingButton";
import FiltersServices from "./filterServices";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";

const AllServices = ({
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

  const onSearchService = (data: any) => {
    setIsAddFilters(false);
    const searchCategory = {
      distance: data?.distance,
      duration: data?.duration,
      serviceStartIn: data?.serviceStartIn,
      skills: data?.skills,
    };

    router?.push({
      pathname: "/screens/service",
      params: {
        title: "allServices",
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
              type="services"
              isLoading={isLoading || isRefetching}
              totalFetchedData={memoizedData?.length}
              totalData={totalData}
            />
            {/* <TopHeaderLinks
          title={["searchServices"]}
          onPress={[() => setIsAddFilters(true)]}
          icon={[
            <Ionicons key={0} name="people" size={22} color={Colors.primary} />,
          ]}
        /> */}
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

          <FiltersServices
            filterVisible={isAddFilters}
            setFilterVisible={setIsAddFilters}
            onApply={onSearchService}
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
});

export default AllServices;
