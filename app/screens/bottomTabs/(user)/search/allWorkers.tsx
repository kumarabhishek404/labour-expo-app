import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl, Dimensions } from "react-native";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import FiltersWorkers from "./filterWorkers";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import WorkersLoadingPlaceholder from "@/components/commons/LoadingPlaceholders/ListingVerticalWorkerPlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";

const AllWorkers = ({
  isLoading,
  isRefetching,
  isFetchingNextPage,
  refreshing,
  memoizedData,
  onRefresh,
  loadMore,
  totalData = 0,
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
    <GradientWrapper>
      {isLoading ? (
        <WorkersLoadingPlaceholder />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.headingContainer}>
              <CustomText
                baseFont={14}
                color={Colors?.white}
                style={styles.subHeading}
              >
                {t("workersListSubHeading")}
              </CustomText>
            </View>
            {Array.isArray(memoizedData) && memoizedData.length > 0 ? (
              <View style={styles.contentCard}>
                <View style={styles.listFill}>
                  <ListingsVerticalWorkers
                    availableInterest={WORKERTYPES}
                    listings={memoizedData || []}
                    loadMore={loadMore}
                    type={"worker"}
                    isFetchingNextPage={isFetchingNextPage}
                    refreshControl={
                      <RefreshControl
                        refreshing={!isRefetching && refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors?.primary}
                        colors={[Colors.primary]}
                      />
                    }
                  />
                </View>
              </View>
            ) : (
              <EmptyDataPlaceholder title="worker" type="gradient" />
            )}
          </View>
        </>
      )}

      <FiltersWorkers
        filterVisible={isAddFilters}
        setFilterVisible={setIsAddFilters}
        onApply={onSearchWorkers}
      />
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 8,
    paddingTop: 4,
  },
  headingContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingTop: 2,
  },
  subHeading: {
    opacity: 0.98,
    lineHeight: 19,
  },
  contentCard: {
    flex: 1,
  },
  listFill: {
    flex: 1,
    minHeight: 0,
  },
});

export default AllWorkers;
