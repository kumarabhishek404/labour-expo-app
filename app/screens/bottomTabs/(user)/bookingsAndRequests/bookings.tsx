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
import { useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import CustomSegmentedButton from "./customTabs";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import WORKER from "@/app/api/workers";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";

const Bookings = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [category, setCategory] = useState("selected");

  const TABS: any = [
    { value: "selected", label: "selected" },
    { value: "applied", label: "applied" },
  ];

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myServices", category],
    queryFn: ({ pageParam }) => {
      return category === "selected"
        ? WORKER?.fetchAllMyBookings({
            pageParam,
          })
        : WORKER?.fetchMyAppliedServices({
            pageParam,
          });
    },
    retry: false,
    initialPageParam: 1,
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
    }, [refetch])
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
    }, [response, userDetails?.role])
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data) || [],
    [filteredData]
  );

  const onCatChanged = (category: string) => {
    setCategory(category);
    // refetch();
  };

  const ClickAppliedInService = () => {
    if (category === "applied") {
      setCategory("selected");
    } else {
      setCategory("applied");
    }
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors?.primary,
            padding: 10,
            // paddingBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomHeading
            baseFont={22}
            textAlign="left"
            color={Colors?.white}
            style={{ width: "65%" }}
          >
            {category === "applied" ? t("allApplications") : t("allBookings")}
          </CustomHeading>
          <TouchableOpacity
            onPress={ClickAppliedInService}
            style={styles?.applicationText}
          >
            <MaterialIcons
              name="pending-actions"
              size={20}
              color={Colors?.fourthButton}
            />
            <CustomText
              baseFont={16}
              color={Colors?.fourthButton}
              fontWeight="600"
            >
              {category === "applied"
                ? t("yourBookings")
                : t("yourApplications")}
            </CustomText>
          </TouchableOpacity>
        </View>
        <GradientWrapper height={Dimensions.get("window").height - 180}>
          {isLoading ? (
            <ListingsServicesPlaceholder />
          ) : (
            <>
              <View style={styles.container}>
                {memoizedData && memoizedData?.length > 0 ? (
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
                ) : (
                  <EmptyDataPlaceholder
                    title={category === "applied" ? "applications" : "booking"}
                    leftHeight={200}
                    buttonTitle={category === "applied" ? "backToBookings" : "showApplications"}
                    onPress={ClickAppliedInService}
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
    paddingVertical: 20,
    // backgroundColor: Colors?.fourth,
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

export default Bookings;
