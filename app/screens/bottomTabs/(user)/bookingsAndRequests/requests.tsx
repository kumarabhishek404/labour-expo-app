import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import WORKER from "@/app/api/workers";
import EMPLOYER from "@/app/api/employer";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import ListingsVerticalBookings from "@/components/commons/ListingVerticalBookings";
import TopHeaderLinks from "@/components/commons/TopHeaderLinks";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomSegmentedButton from "./customTabs";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsBookingsPlaceholder from "@/components/commons/LoadingPlaceholders/ListingBookingPlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import { getToken } from "@/utils/authStorage";

const Requests = () => {
  const [totalData, setTotalData] = useState(0);
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("recievedRequests");

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      category === "recievedRequests" ? "recievedRequests" : "sentRequests",
      userDetails?._id,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      if (!token || !userDetails?._id) {
        throw new Error("Unauthorized: Missing token or user information");
      }

      return category === "recievedRequests"
        ? await WORKER?.fetchAllBookingReceivedInvitations({ pageParam, token })
        : await EMPLOYER?.fetchAllBookingSentRequests({ pageParam, token });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
    enabled: !!userDetails?._id,
    retry: false,
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
      const unsubscribe = setFilteredData(
        response?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const onCatChanged = (category: string) => {
    setCategory(category);
    refetch();
  };

  const { refreshing, onRefresh } = PULL_TO_REFRESH.usePullToRefresh(
    async () => {
      await refetch();
    }
  );

  const ShowAllSentRequests = () => {
    if (category === "sentRequests") {
      setCategory("recievedRequests");
    } else {
      setCategory("sentRequests");
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors?.primary,
            padding: 10,
            paddingBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomHeading
            baseFont={24}
            textAlign="left"
            color={Colors?.white}
            style={{ width: "65%" }}
          >
            {category === "sentRequests"
              ? t("sentRequestsUpper")
              : t("receivedRequestsUpper")}
          </CustomHeading>
          <TouchableOpacity
            onPress={ShowAllSentRequests}
            style={styles?.applicationText}
          >
            {category === "sentRequests" ? (
              <AntDesign
                name="rocket1"
                size={20}
                color={Colors?.fourthButton}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            ) : (
              <AntDesign
                name="rocket1"
                size={20}
                color={Colors?.fourthButton}
              />
            )}
            <CustomText
              baseFont={16}
              color={Colors?.fourthButton}
              fontWeight="600"
            >
              {category === "sentRequests"
                ? t("receivedRequests")
                : t("sentRequests")}
            </CustomText>
          </TouchableOpacity>
        </View>
        <GradientWrapper height={Dimensions.get("window").height - 180}>
          {isLoading ? (
            <ListingsBookingsPlaceholder />
          ) : (
            <View style={styles.container}>
              {memoizedData && memoizedData?.length > 0 ? (
                <>
                  <ListingsVerticalBookings
                    listings={memoizedData || []}
                    category={category}
                    loadMore={loadMore}
                    refreshControl={
                      <RefreshControl
                        refreshing={!isRefetching && refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    isFetchingNextPage={isFetchingNextPage}
                  />
                </>
              ) : (
                <EmptyDataPlaceholder
                  title={
                    category === "sentRequests"
                      ? "sentBookingRequests"
                      : "receivedBookingRequests"
                  }
                  leftHeight={200}
                  buttonTitle={
                    category === "sentRequests"
                      ? "backToRecievedRequests"
                      : "showSentRequests"
                  }
                  onPress={ShowAllSentRequests}
                  type="gradient"
                />
              )}
            </View>
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

export default Requests;
