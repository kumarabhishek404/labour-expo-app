import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl, Dimensions } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router, Stack, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";

import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import Colors from "@/constants/Colors";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import { getToken } from "@/utils/authStorage";
import Atoms from "@/app/AtomStore";
import { t } from "@/utils/translationHelper";
import MEDIATOR from "@/app/api/mediator";

const MediatorDashboard = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData] = useState([]);
  const firstTimeRef = React.useRef(true);

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["mediatorServices", userDetails?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      if (!token || !userDetails?._id) throw new Error("Unauthorized");

      // API to fetch services where user applied as mediator
      return await MEDIATOR.fetchMyBookingsAsMediator({ pageParam });
    },
    retry: false,
    initialPageParam: 1,
    enabled: !!userDetails?._id,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const merged: any =
        response?.pages?.flatMap((page: any) => page.data || []) || [];
      setFilteredData(merged);
    }, [response]),
  );

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data) || [],
    [filteredData],
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const onCreateGuideClick = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(refetch);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <CustomHeading baseFont={26} textAlign="center" color={Colors.white}>
            🧑‍🔧 {t("myMediatorDashboard")}
          </CustomHeading>

          <CustomText
            baseFont={15}
            color={Colors.white}
            style={{ opacity: 0.95, lineHeight: 18 }}
          >
            {t("mediatorDashboardGuide")}
          </CustomText>

          {/* <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: 10,
              borderRadius: 10,
              marginTop: 6,
            }}
          >
            <CustomText baseFont={14} color={Colors.white}>
              💡 {t("mediatorTip")}
            </CustomText>
          </View> */}
        </View>

        <GradientWrapper height={Dimensions.get("window").height - 180}>
          {isLoading ? (
            <ListingsServicesPlaceholder />
          ) : memoizedData?.length > 0 ? (
            <View style={styles.container}>
              <ListingsVerticalServices
                listings={memoizedData}
                isFetchingNextPage={isFetchingNextPage}
                loadMore={loadMore}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          ) : (
            <EmptyDataPlaceholder
              title="noMediatorServicesTitle"
              leftHeight={300}
              buttonTitle="exploreServices"
              onPress={onCreateGuideClick}
              type="gradient"
            />
          )}
        </GradientWrapper>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    gap: 5,
    backgroundColor: Colors.primary,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
});

export default MediatorDashboard;
