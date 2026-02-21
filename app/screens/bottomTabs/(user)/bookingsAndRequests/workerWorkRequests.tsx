import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import WORKER from "@/app/api/workers";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsBookingsPlaceholder from "@/components/commons/LoadingPlaceholders/ListingBookingPlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import Colors from "@/constants/Colors";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import { getToken } from "@/utils/authStorage";
import Atoms from "@/app/AtomStore";
import { t } from "@/utils/translationHelper";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";

const WorkerWorkRequests = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const [activeTab, setActiveTab] = useState("received"); // received | applied
  const [filteredData, setFilteredData]: any = useState([]);

  /* ---------------- API ---------------- */

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myWorkRequests", activeTab, userDetails?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();

      if (!token || !userDetails?._id) {
        throw new Error("Unauthorized");
      }

      // TAB 1 → Received requests from employer
      if (activeTab === "received") {
        return await WORKER.fetchAllBookingReceivedInvitations({
          pageParam,
          token,
        });
      }

      // TAB 2 → Services where worker applied
      return await WORKER.fetchMyAppliedServices({ pageParam });
    },
    initialPageParam: 1,
    enabled: !!userDetails?._id,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  /* ---------- Merge pages ---------- */

  useFocusEffect(
    React.useCallback(() => {
      const merged =
        response?.pages?.flatMap((page: any) => page.data || []) || [];
      setFilteredData(merged);
    }, [response]),
  );

  const memoizedData = useMemo(
    () => filteredData?.flatMap((d: any) => d) || [],
    [filteredData],
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(refetch);

  /* ---------------- UI ---------------- */

  const TabButton = ({ id, title, subtitle }: any) => {
    const active = activeTab === id;
    return (
      <TouchableOpacity
        style={[styles.tab, active && styles.activeTab]}
        onPress={() => setActiveTab(id)}
      >
        <CustomText
          baseFont={16}
          fontWeight="700"
          color={active ? Colors.white : Colors.primary}
        >
          {title}
        </CustomText>
        <CustomText baseFont={12} color={active ? Colors.white : "#666"}>
          {subtitle}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const EmptyGuidedState = () => {
    const isReceived = activeTab === "received";

    const steps = isReceived
      ? [
          t("ctaCompleteProfileStep1"),
          t("ctaCompleteProfileStep2"),
          t("ctaCompleteProfileStep3"),
        ]
      : [t("ctaFindWorkStep1"), t("ctaFindWorkStep2"), t("ctaFindWorkStep3")];

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomHeading textAlign="center" color={Colors?.white}>
          {isReceived
            ? t("noReceivedRequestsTitle")
            : t("noAppliedServicesTitle")}
        </CustomHeading>

        <CustomText
          textAlign="center"
          style={{ marginTop: 10 }}
          color={Colors?.white}
        >
          {isReceived
            ? t("noReceivedRequestsSubtitle")
            : t("noAppliedServicesSubtitle")}
        </CustomText>

        {/* Steps */}
        <View style={{ marginTop: 20, width: 140 }}>
          {steps.map((step: string, index: number) => (
            <CustomText
              key={index}
              baseFont={15}
              textAlign="left"
              color={Colors?.white}
            >
              {`👉 ${step}`}
            </CustomText>
          ))}
        </View>

        {/* CTA Button */}
        {!isReceived && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() =>
              router?.push({
                pathname: "/(tabs)",
              })
            }
          >
            <CustomText color="white" fontWeight="700">
              {t("noAppliedServicesCTA")}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🌟 Guided Header */}
      <View style={styles.header}>
        <CustomHeading baseFont={26} textAlign="center" color={Colors?.white}>
          🧰 {t("myActivityHeading")}
        </CustomHeading>

        <CustomText color={Colors.white} baseFont={14}>
          {t("myWorkHeaderGuide")}
        </CustomText>
      </View>

      {/* 🌟 Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          id="received"
          title={t("tabReceivedWorkTitle")}
          subtitle={t("tabReceivedWorkSubtitle")}
        />

        <TabButton
          id="applied"
          title={t("tabAppliedWorkTitle")}
          subtitle={t("tabAppliedWorkSubtitle")}
        />
      </View>

      <GradientWrapper height={Dimensions.get("window").height - 210}>
        {isLoading ? (
          <ListingsBookingsPlaceholder />
        ) : memoizedData?.length > 0 ? (
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            {activeTab === "received" ? (
              <ListingsVerticalBookings
                category="recievedRequests"
                listings={memoizedData}
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
              <ListingsVerticalServices
                listings={memoizedData}
                loadMore={loadMore}
                isFetchingNextPage={isFetchingNextPage}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
          </View>
        ) : (
          <EmptyGuidedState />
        )}
      </GradientWrapper>
    </View>
  );
};

export default WorkerWorkRequests;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingBottom: 0,
    gap: 5,
  },

  tabsContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: Colors.primary,
  },

  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },

  activeTab: {
    backgroundColor: "#2e7d32",
  },
  ctaButton: {
    marginTop: 25,
    backgroundColor: "#2e7d32",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
