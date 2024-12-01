import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Stack, useFocusEffect } from "expo-router";
import Colors from "@/constants/Colors";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "../AtomStore/user";
import { fetchAllWorkers } from "../api/workers";
import { fetchAllServices } from "../api/services";
import Loader from "@/components/commons/Loader";
import { fetchAllEmployers } from "../api/employer";
import GroupWorkersListing from "@/components/commons/GroupWorkersListing";
import GroupEmployersListing from "@/components/commons/GroupEmployersListing";
import ListingHorizontalServices from "@/components/commons/ListingHorizontalServices";
import ListingHorizontalWorkers from "@/components/commons/ListingHorizontalWorkers";
import HomePageLinks from "@/components/commons/HomePageLinks";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { fetchCurrentLocation } from "@/constants/functions";
import BannerSlider from "@/components/commons/BannerSlider";
import { SERVICES, WORKERTYPES } from "@/constants";
import QuickContact from "@/components/commons/QuickContact";
import TestimonialSlider from "@/components/commons/Testimonials";
import PublicationsScreen from "@/components/commons/Publications";
import AboutCompany from "@/components/commons/AboutCompany";
import CompanySuccess from "@/components/commons/CompanySuccessStats";
import ScrollHint from "@/components/commons/ScrollToRight";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomHeader from "@/components/commons/Header";
// import SpeechToText from "@/components/commons/VoiceToText";
// import AudioRecorder from "@/components/commons/AudioRecord";
import { t } from "@/utils/translationHelper";

const Page = () => {
  const userDetails = useAtomValue(UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState(
    userDetails?.role === "EMPLOYER" ? "" : "Hiring"
  );

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
        ? fetchAllWorkers({ pageParam, skill: category })
        : fetchAllServices({ pageParam, type: category });
    },
    initialPageParam: 1,
    retry: false,
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
        ? fetchAllWorkers({ pageParam, skill: category })
        : fetchAllEmployers({ pageParam, type: category });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    fetchLocation();
  }, []);

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

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
    await secondRefetch();
  });

  const fetchLocation = async () => {
    await fetchCurrentLocation();
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="" left="profile" right="notification" />
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
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            <CustomHeading
              textAlign="left"
              fontSize={24}
              style={{ marginBottom: 10 }}
            >
              {t("welcome")} {userDetails?.firstName}
            </CustomHeading>
            {/* <AudioRecorder /> */}
            <BannerSlider />
            <HomePageLinks />

            <CustomHeading textAlign="left">
              {userDetails?.role === "EMPLOYER" ? t("workers") : t("services")}
            </CustomHeading>
            <View style={styles.divider}></View>

            <CategoryButtons
              options={
                userDetails?.role === "EMPLOYER" ? WORKERTYPES : SERVICES
              }
              onCagtegoryChanged={onCatChanged}
              stylesProp={styles.categoryContainer}
            />

            <View style={{ paddingBottom: 30 }}>
              {userDetails?.role === "EMPLOYER" ? (
                <ListingHorizontalWorkers
                  availableInterest={WORKERTYPES}
                  category={category}
                  listings={memoizedData || []}
                  loadMore={loadMore}
                  isFetchingNextPage={isFetchingNextPage}
                />
              ) : (
                <ListingHorizontalServices
                  category={category}
                  listings={memoizedData || []}
                  loadMore={loadMore}
                  isFetchingNextPage={isFetchingNextPage}
                />
              )}
              <ScrollHint />
            </View>

            <View style={{ marginBottom: 40 }}>
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
            </View>
          </View>

          <AboutCompany />
          <PublicationsScreen />
          <CompanySuccess />
          <TestimonialSlider />
          <QuickContact />
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

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
