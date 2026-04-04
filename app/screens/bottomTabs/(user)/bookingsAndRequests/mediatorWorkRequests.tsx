import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import MEDIATOR from "@/app/api/mediator";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
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
import WORKER from "@/app/api/workers";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";

const MediatorWorkRequests = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [activeTab, setActiveTab] = useState("teamRequests"); // teamRequests | appliedMediator
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
    queryKey: ["mediatorWorkRequests", activeTab, userDetails?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      if (!token || !userDetails?._id) throw new Error("Unauthorized");

      if (activeTab === "teamRequests") {
        return await MEDIATOR.fetchSentTeamRequests({ pageParam });
      }

      return await MEDIATOR.fetchMyAppliedServicesAsMediator({
        pageParam,
      });
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

  const mutationCancelRequest = useMutation({
    mutationFn: (id) => MEDIATOR.cancelTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
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
    () => filteredData?.flatMap((data: any) => data) || [],
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
    const isTeamRequests = activeTab === "teamRequests";

    const steps = isTeamRequests
      ? [
          t("mediatorStepCompleteProfile"),
          t("mediatorStepInviteTeam"),
          t("mediatorStepTrackRequests"),
        ]
      : [
          t("mediatorStepFindService"),
          t("mediatorStepApplyService"),
          t("mediatorStepTrackService"),
        ];

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomHeading textAlign="center" color={Colors?.white}>
          {isTeamRequests
            ? t("noTeamJoiningRequestsTitle")
            : t("noAppliedServicesMediatorTitle")}
        </CustomHeading>

        <CustomText
          textAlign="center"
          style={{ marginTop: 10 }}
          color={Colors?.white}
        >
          {isTeamRequests
            ? t("noTeamJoiningRequestsSubtitle")
            : t("noAppliedServicesMediatorSubtitle")}
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
        {!isTeamRequests && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() =>
              router?.push({
                pathname: "/(tabs)",
              })
            }
          >
            <CustomText color="white" fontWeight="700">
              {t("mediatorCTAApplyService")}
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
          🤝 {t("mediatorActivityTitle")}
        </CustomHeading>
      </View>

      {/* 🌟 Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          id="teamRequests"
          title={t("tabTeamJoiningRequestsTitle")}
          subtitle={t("tabTeamJoiningRequestsSubtitle")}
        />

        <TabButton
          id="appliedMediator"
          title={t("tabAppliedServiceMediatorTitle")}
          subtitle={t("tabAppliedServiceMediatorSubtitle")}
        />
      </View>

      <GradientWrapper height={Dimensions.get("window").height - 210}>
        {isLoading ? (
          <ListingsBookingsPlaceholder />
        ) : memoizedData?.length > 0 ? (
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            {activeTab === "teamRequests" ? (
              <ListingVerticalRequests
                listings={filteredData || []}
                requestType="teamJoiningRequest"
                isLoading={mutationCancelRequest?.isPending}
                loadMore={loadMore}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
                isFetchingNextPage={isFetchingNextPage}
                onCancelRequest={mutationCancelRequest.mutate}
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

export default MediatorWorkRequests;

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
    backgroundColor: "#1E88E5",
  },

  ctaButton: {
    marginTop: 25,
    backgroundColor: "#1E88E5",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
