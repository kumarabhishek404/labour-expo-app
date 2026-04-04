import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import USER from "@/app/api/user";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";

import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import WorkersLoadingPlaceholder from "@/components/commons/LoadingPlaceholders/ListingVerticalWorkerPlaceholder";
import CustomText from "@/components/commons/CustomText";
import Colors from "@/constants/Colors";
import { WORKERTYPES } from "@/constants";
import { t } from "@/utils/translationHelper";

const AllTopWorkers = () => {
  const [filteredData, setFilteredData]: any = useState([]);

  /* ---------------- API FETCH (Infinite Scroll) ---------------- */

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["allTopWorkers"],
    queryFn: ({ pageParam }) =>
      USER?.fetchAllUsers({
        pageParam,
      }),
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  /* ---------------- Merge + Deduplicate Workers ---------------- */

  React.useEffect(() => {
    const mergedData = response?.pages?.flatMap((page: any) => page.data || []);

    const uniqueData: any = Object.values(
      (mergedData || []).reduce((acc: any, item: any) => {
        acc[item._id] = item;
        return acc;
      }, {}),
    );

    setFilteredData(uniqueData);
  }, [response]);

  /* ---------------- Load More ---------------- */

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /* ---------------- Pull To Refresh ---------------- */

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    },
  );

  /* ---------------- Memoized Data ---------------- */

  const memoizedData = useMemo(() => {
    const unique = Object.values(
      (filteredData || []).reduce((acc: any, item: any) => {
        acc[item._id] = item;
        return acc;
      }, {}),
    );
    return unique;
  }, [filteredData]);

  /* ---------------- Loading State ---------------- */

  if (isLoading) {
    return <WorkersLoadingPlaceholder />;
  }

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      {/* ⭐ Friendly Guided Heading */}
      <View style={styles.headingContainer}>
        <CustomText
          baseFont={28}
          fontWeight="800"
          color={Colors.white}
          style={styles.heading}
          textAlign="left"
        >
          👷 {t("discoverWorkers")}
        </CustomText>

        {/* <CustomText
          baseFont={15}
          color={Colors.white}
          style={styles.subHeading}
        >
          {t("discoverWorkersSubHeading")}
        </CustomText> */}
      </View>

      {/* Worker List */}
      {Array.isArray(memoizedData) && memoizedData.length > 0 ? (
        <ListingsVerticalWorkers
          style={styles.listContainer}
          availableInterest={WORKERTYPES}
          listings={memoizedData}
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
        <EmptyDataPlaceholder title="worker" type="gradient" />
      )}
    </View>
  );
};

export default AllTopWorkers;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingBottom: 140,
    paddingTop: 10,
  },

  headingContainer: {
    marginBottom: 12,
  },

  heading: {
    paddingLeft: 4,
  },

  subHeading: {
    opacity: 0.95,
    lineHeight: 22,
    marginTop: 6,
  },

  listContainer: {
    flexGrow: 1,
  },
});
