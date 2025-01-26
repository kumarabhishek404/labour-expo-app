import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Stack, useFocusEffect } from "expo-router";
import Colors from "@/constants/Colors";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import WORKER from "@/app/api/workers";
import SERVICE from "../../../api/services";
import Loader from "@/components/commons/Loader";
import EMPLOYER from "../../../api/employer";
import GroupWorkersListing from "@/components/commons/GroupWorkersListing";
import GroupEmployersListing from "@/components/commons/GroupEmployersListing";
import ListingHorizontalServices from "@/components/commons/ListingHorizontalServices";
import ListingHorizontalWorkers from "@/components/commons/ListingHorizontalWorkers";
import HomePageLinks from "@/components/commons/HomePageLinks";
import BannerSlider from "@/components/commons/BannerSlider";
import { SERVICES, WORKERS, WORKERTYPES } from "@/constants";
import QuickContact from "@/components/commons/QuickContact";
import TestimonialSlider from "@/components/commons/Testimonials";
import PublicationsScreen from "@/components/commons/Publications";
import AboutCompany from "@/components/commons/AboutCompany";
import CompanySuccess from "@/components/commons/CompanySuccessStats";
import ScrollHint from "@/components/commons/ScrollToRight";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import HowAppWorks from "@/components/commons/HowAppWorks";
import OurMission from "@/components/commons/OurMission";
import OurVision from "@/components/commons/OurVision";
import { Platform } from "react-native";
import * as DeviceInfo from "expo-device";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";

const UserHome = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("");
  // let data = AI4Bharat?.getTransliterationLanguages()

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["homepage", category],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? WORKER?.fetchAllWorkers({ pageParam, skill: category })
        : SERVICE?.fetchAllServices({
            pageParam,
            status: "HIRING",
            skill: category,
          });
    },
    initialPageParam: 1,
    retry: false,
    enabled: !!userDetails?._id && userDetails?.status === "ACTIVE",
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: secondResponse,
    isLoading: isSecondLoading,
    isRefetching: isSecondRefetching,
    isFetchingNextPage: isSecondFetchingNextPage,
    fetchNextPage: fetchSecondNextPage,
    hasNextPage: hasSecondsNextPage,
    refetch: secondRefetch,
  } = useInfiniteQuery({
    queryKey: ["tops", category],
    queryFn: ({ pageParam }) => {
      return userDetails?.role === "EMPLOYER"
        ? WORKER?.fetchAllWorkers({ pageParam, skill: category, top: true })
        : EMPLOYER?.fetchAllEmployers({ pageParam, type: category, top: true });
    },
    initialPageParam: 1,
    retry: false,
    enabled: !!userDetails?._id && userDetails?.status === "ACTIVE",
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadSecondMore = () => {
    if (hasSecondsNextPage && !isSecondFetchingNextPage) {
      fetchSecondNextPage();
    }
  };

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  const memoizedData = useMemo(
    () => response?.pages?.flatMap((data: any) => data?.data),
    [response]
  );

  const secondMemoizedData = useMemo(
    () =>
      secondResponse?.pages
        .flatMap((page: any) => page.data || [])
        ?.flatMap((data: any) => data),
    [secondResponse]
  );

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
      await secondRefetch();
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="" left="menu" right="notification" />
          ),
        }}
      />

      <Loader
        loading={
          isLoading || isRefetching || isSecondLoading || isSecondRefetching
        }
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={!isRefetching && !isSecondRefetching && refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
            {/* <CustomHeading
              textAlign="left"
              fontSize={24}
              style={{ marginBottom: 10 }}
            >
              {t("welcome")} {userDetails?.name}
            </CustomHeading> */}
            {/* <AudioRecorder /> */}
            <BannerSlider />
            <HomePageLinks />

            <CustomHeading textAlign="left">
              {userDetails?.role === "EMPLOYER" ? t("workers") : t("services")}
            </CustomHeading>
            <View style={styles.divider}></View>

            <CategoryButtons
              options={WORKERS}
              onCagtegoryChanged={onCatChanged}
              stylesProp={styles.categoryContainer}
            />

            <View style={{ paddingBottom: 30, paddingTop: 5 }}>
              {memoizedData && memoizedData?.length > 0 ? (
                userDetails?.role === "EMPLOYER" ? (
                  <>
                    <ListingHorizontalWorkers
                      availableInterest={WORKERTYPES}
                      category={category}
                      listings={memoizedData || []}
                      loadMore={loadMore}
                      isFetchingNextPage={isFetchingNextPage}
                    />
                    <ScrollHint />
                  </>
                ) : (
                  <>
                    <ListingHorizontalServices
                      category={category}
                      listings={memoizedData || []}
                      loadMore={loadMore}
                      isFetchingNextPage={isFetchingNextPage}
                    />
                    <ScrollHint />
                  </>
                )
              ) : (
                <EmptyDatePlaceholder
                  title={
                    userDetails?.role === "EMPLOYER" ? "Worker" : "Service"
                  }
                />
              )}
            </View>

            {/* <View style={{ marginBottom: 40 }}>
              {userDetails?.role === "EMPLOYER" ? (
                <GroupWorkersListing
                  category={category}
                  listings={secondMemoizedData || []}
                  loadMore={loadSecondMore}
                  isFetchingNextPage={isSecondFetchingNextPage}
                />
              ) : (
                <GroupEmployersListing
                  category={category}
                  listings={secondMemoizedData || []}
                  loadMore={loadSecondMore}
                  isFetchingNextPage={isSecondFetchingNextPage}
                />
              )}
              <ScrollHint />
            </View> */}
          </View>

          <AboutCompany />
          <CompanySuccess />
          <HowAppWorks />
          <OurMission />
          <OurVision />
          {/* <PublicationsScreen /> */}
          <TestimonialSlider />
          <QuickContact />
        </ScrollView>
      </View>
    </>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
    backgroundColor: Colors.bgColor,
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.9,
  },
  image: {
    width: 120,
    height: 150,
  },
  secondImage: {
    width: 70,
    height: 75,
  },
  singleBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
    marginBottom: 10,
  },
  categoryContainer: {},
  scrollToRight: {
    textAlign: "right",
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  alertDot: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 12,
    height: 12,
    backgroundColor: "red",
    borderRadius: 30,
  },
});
