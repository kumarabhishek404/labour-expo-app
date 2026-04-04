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
import AnimatedGradientWrapper from "@/components/commons/AnimatedGradientWrapper";

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

  const loadedCount = Array.isArray(memoizedData) ? memoizedData.length : 0;
  const countForBadge =
    typeof totalData === "number" && totalData > 0 ? totalData : loadedCount;

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <CustomText
          baseFont={13}
          fontWeight="800"
          color={Colors.primary}
          style={styles.countBadge}
        >
          {t("workersListCountBadge", { count: countForBadge })}
        </CustomText>
        <CustomText
          baseFont={12}
          color={Colors.subHeading}
          style={styles.pullHint}
          numberOfLines={2}
        >
          {t("serviceListPullHint")}
        </CustomText>
      </View>
    ),
    [countForBadge],
  );

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
    <AnimatedGradientWrapper height={Dimensions.get("window").height - 180}>
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
                    ListHeaderComponent={listHeader}
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
    </AnimatedGradientWrapper>
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
    backgroundColor: "#FAFBFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.08)",
    paddingTop: 6,
    paddingHorizontal: 8,
    paddingBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  listHeader: {
    paddingBottom: 12,
    paddingTop: 4,
    paddingHorizontal: 2,
    gap: 6,
  },
  countBadge: {
    lineHeight: 18,
  },
  pullHint: {
    lineHeight: 18,
  },
  listFill: {
    flex: 1,
    minHeight: 0,
  },
});

export default AllWorkers;
