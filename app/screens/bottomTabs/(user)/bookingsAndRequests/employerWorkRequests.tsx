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
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
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
import EMPLOYER from "@/app/api/employer";

const EmployerWorkRequests = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const [activeTab, setActiveTab] = useState("created"); // sent | created
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
    queryKey: ["employerWorkRequests", activeTab, userDetails?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();

      if (!token || !userDetails?._id) throw new Error("Unauthorized");

      // TAB 1 → Requests sent to workers
      if (activeTab === "sent") {
        return await EMPLOYER.fetchAllBookingSentRequests({ pageParam });
      }

      // TAB 2 → Services created by employer
      return await EMPLOYER.fetchMyServices({ pageParam, status: "HIRING" });
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
    const isSent = activeTab === "sent";

    const steps = isSent
      ? [
          t("employerCtaCompleteProfileStep1"),
          t("employerCtaCompleteProfileStep2"),
          t("employerCtaCompleteProfileStep3"),
        ]
      : [
          t("employerCtaCreateServiceStep1"),
          t("employerCtaCreateServiceStep2"),
          t("employerCtaCreateServiceStep3"),
        ];

    return (
      <View style={styles.emptyContainer}>
        <CustomHeading textAlign="center" color={Colors?.white}>
          {isSent ? t("noSentRequestsTitle") : t("noCreatedServicesTitle")}
        </CustomHeading>

        <CustomText
          textAlign="center"
          style={{ marginTop: 10 }}
          color={Colors?.white}
        >
          {isSent
            ? t("noSentRequestsSubtitle")
            : t("noCreatedServicesSubtitle")}
        </CustomText>

        {/* Steps */}
        <View style={{ marginTop: 20, width: 160 }}>
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
        {!isSent && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)",
              })
            }
          >
            <CustomText color="white" fontWeight="700">
              {t("createNewService")}
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
          🏗️ {t("employerActivityTitle")}
        </CustomHeading>

        <CustomText color={Colors.white} baseFont={14}>
          {t("employerWorkHeaderGuide")}
        </CustomText>
      </View>

      {/* 🌟 Tabs */}
      <View style={styles.tabsContainer}>

        <TabButton
          id="created"
          title={t("tabCreatedServicesTitle")}
          subtitle={t("tabCreatedServicesSubtitle")}
        />

        <TabButton
          id="sent"
          title={t("tabSentRequestsTitle")}
          subtitle={t("tabSentRequestsSubtitle")}
        />
      </View>

      <GradientWrapper height={Dimensions.get("window").height - 210}>
        {isLoading ? (
          <ListingsBookingsPlaceholder />
        ) : memoizedData?.length > 0 ? (
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            {activeTab === "sent" ? (
              <ListingsVerticalBookings
                category="sentRequests"
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

export default EmployerWorkRequests;

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
    backgroundColor: "#1565c0",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  ctaButton: {
    marginTop: 25,
    backgroundColor: "#1565c0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
