import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import Atoms from "@/app/AtomStore";
import { router, Stack } from "expo-router";
import REQUEST from "@/app/api/requests";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { MEDIATORREQUEST, WORKERREQUEST } from "@/constants";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import FloatingButton from "@/components/inputs/FloatingButton";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import { RefreshControl } from "react-native-gesture-handler";

const Requests = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState(
    userDetails?.role === "MEDIATOR" ? "sentRequests" : "recievedRequests"
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
    queryKey: ["requests"],
    queryFn: ({ pageParam }) =>
      userDetails?.role === "MEDIATOR"
        ? REQUEST?.fetchSentRequests({ pageParam })
        : REQUEST?.fetchRecievedRequests({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
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

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelRequest"],
    mutationFn: (id) => REQUEST?.cancelJoiningRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while liking a worker - ", response);
    },
    // onError: (err) => {
    //   console.error("error while liking the worker ", err);
    // },
  });

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptRequest"],
    mutationFn: (id) => REQUEST?.acceptJoiningRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      refreshUser();
      TOAST?.showToast?.success(t("requestAcceptedSuccessfully"));
      console.log("Response while accepting a request - ", response);
    },
    onError: (err) => {
      console.error("error while accepting team joining request ", err);
    },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectRequest"],
    mutationFn: (id) => REQUEST?.rejectJoiningRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while rejecting request - ", response);
    },
    // onError: (err) => {
    //   console.error("error while liking the worker ", err);
    // },
  });

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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Requests" left="menu" right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader
          loading={
            isLoading ||
            isRefetching ||
            mutationCancelRequest?.isPending ||
            mutationAcceptRequest?.isPending ||
            mutationRejectRequest?.isPending
          }
        />
        <View style={styles.container}>
          <SearchFilter
            type="users"
            data={response?.pages}
            setFilteredData={setFilteredData}
          />

          <CategoryButtons
            options={
              userDetails?.role === "MEDIATOR" ? MEDIATORREQUEST : WORKERREQUEST
            }
            onCagtegoryChanged={onCatChanged}
          />

          <PaginationString
            type="requests"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          <ListingVerticalRequests
            listings={memoizedData || []}
            requestType={category}
            loadMore={loadMore}
            refreshControl={
              <RefreshControl
                refreshing={!isRefetching && refreshing}
                onRefresh={onRefresh}
              />
            }
            isFetchingNextPage={isFetchingNextPage}
            onCancelRequest={mutationCancelRequest?.mutate}
            onAcceptRequest={mutationAcceptRequest?.mutate}
            onRejectRequest={mutationRejectRequest?.mutate}
          />
        </View>
      </View>
      {userDetails?.isAuth &&
        (userDetails?.role === "EMPLOYER" ||
          userDetails?.role === "MEDIATOR") &&
        userDetails?._id &&
        userDetails?.status === "ACTIVE" && (
          <FloatingButton style={{ bottom: 10 }} />
        )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
  },
});

export default Requests;
