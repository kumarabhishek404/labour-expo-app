import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router, Stack, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import CustomSegmentedButton from "./customTabs";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import WORKER from "@/app/api/workers";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";
import { getToken } from "@/utils/authStorage";
import Atoms from "@/app/AtomStore";

const WorkerBookings = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
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
    queryKey: ["myServices", userDetails?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();

      if (!token || !userDetails?._id) {
        throw new Error("Unauthorized: Missing token or user details");
      }

      return await WORKER?.fetchAllMyBookings({ pageParam });
    },
    retry: false,
    initialPageParam: 1,
    enabled: !!userDetails?._id,
    getNextPageParam: (lastPage: any, pages) => {
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
      const totalData = response?.pages[0]?.pagination?.total;
      setTotalData(totalData);

      // For employers, keep existing behavior
      // setFilteredData(
      //   response?.pages.flatMap((page: any) => page.data || [])
      // );
      // For mediators and workers, combine both responses
      const appliedServices =
        response?.pages?.flatMap((page: any) => page.data || []) || [];

      setFilteredData([...appliedServices]);
    }, [response, userDetails?.role]),
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data) || [],
    [filteredData],
  );

  const ClickAppliedInService = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    },
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors?.primary,
            paddingHorizontal: 16,
            paddingTop: 10,
            // paddingBottom: 25,
          }}
        >
          {/* Main Heading */}
          <CustomHeading baseFont={26} textAlign="center" color={Colors?.white}>
            💼 {t("myWorkDashboard")}
          </CustomHeading>

          {/* Guided subtitle */}
          <CustomText
            baseFont={15}
            color={Colors?.white}
            style={{ opacity: 0.95, lineHeight: 18 }}
          >
            {t("myWorkDashboardSub")}
          </CustomText>

          {/* Small helper tip */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
          >
            <CustomText baseFont={14} color={Colors.white}>
              💡 {t("workTip")}
            </CustomText>
          </View>
        </View>
        <GradientWrapper height={Dimensions.get("window").height - 180}>
          {isLoading ? (
            <ListingsServicesPlaceholder />
          ) : (
            <>
              <View style={styles.container}>
                {memoizedData && memoizedData?.length > 0 ? (
                  <View style={{ marginTop: 15 }}>
                    <ListingsVerticalServices
                      listings={memoizedData || []}
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
                    title="noWorkYet"
                    leftHeight={300}
                    buttonTitle="findWork"
                    onPress={ClickAppliedInService}
                    type="gradient"
                  />
                )}
              </View>
            </>
          )}
        </GradientWrapper>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  applicationText: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
});

export default WorkerBookings;
