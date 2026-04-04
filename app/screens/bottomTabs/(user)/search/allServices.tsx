import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import FiltersServices from "./filterServices";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import AnimatedGradientWrapper from "@/components/commons/AnimatedGradientWrapper";
import APP_CONTEXT from "@/app/context/locale";

const AllServices = ({
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
  const { role } = APP_CONTEXT.useApp();

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
          {t("serviceListCountBadge", { count: countForBadge })}
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
    <AnimatedGradientWrapper height={Dimensions.get("window").height - 180}>
      {isLoading ? (
        <ListingsServicesPlaceholder />
      ) : (
        <>
          <View
            style={[
              styles.container,
              role !== "WORKER" && { paddingBottom: 24 },
            ]}
          >
            <View style={styles.headingContainer}>
              {role === "WORKER" && (
                <CustomText
                  baseFont={28}
                  fontWeight="800"
                  color={Colors?.white}
                  style={styles.heading}
                >
                  {t("allServices")}
                </CustomText>
              )}
              <CustomText baseFont={14} color={Colors?.white} style={styles.subHeading}>
                {t("allServicesSubHeading")}
              </CustomText>
            </View>

            {Array.isArray(memoizedData) && memoizedData.length > 0 ? (
              <View style={styles.contentCard}>
                <View style={styles.listFill}>
                  <ListingsVerticalServices
                    listings={memoizedData || []}
                    loadMore={loadMore}
                    isFetchingNextPage={isFetchingNextPage}
                    ListHeaderComponent={listHeader}
                    refreshControl={
                      <RefreshControl
                        refreshing={!isRefetching && refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                      />
                    }
                  />
                </View>
              </View>
            ) : (
              <EmptyDataPlaceholder
                title="service"
                type="gradient"
                buttonTitle="refresh"
                onPress={onRefresh}
              />
            )}
          </View>
        </>
      )}

      <FiltersServices
        filterVisible={isAddFilters}
        setFilterVisible={setIsAddFilters}
        onApply={onSearchService}
      />
    </AnimatedGradientWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  headingContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  heading: {
    paddingLeft: 5,
  },
  subHeading: {
    opacity: 0.98,
    lineHeight: 20,
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
  /** Light panel behind the list (matches service-list spec / workers pattern). */
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
  /** Lets FlatList take remaining height so footer + bottom inset scroll correctly. */
  listFill: {
    flex: 1,
    minHeight: 0,
  },
});

export default AllServices;
