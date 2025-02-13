import React, { useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import Atoms from "@/app/AtomStore";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import PULL_TO_REFRESH from "@/app/hooks/usePullToRefresh";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import CustomSegmentedButton from "./customTabs";
import WORKER from "@/app/api/workers";
import MEDIATOR from "@/app/api/mediator";
import EMPLOYER from "@/app/api/employer";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";

const Requests = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [totalData, setTotalData] = useState(0);
  const firstTimeRef = React.useRef(true);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("recievedRequests");

  const TABS = [
    { value: "recievedRequests", label: "received", count: 2 },
    { value: "sentRequests", label: "sent", count: 4 },
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
    queryKey: [
      category === "recievedRequests" ? "recievedRequests" : "sentRequests",
    ],
    queryFn: ({ pageParam }) =>
      category === "recievedRequests"
        ? WORKER?.fetchAllBookingReceivedInvitations({ pageParam })
        : EMPLOYER?.fetchAllBookingSentRequests({ pageParam }),
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
    mutationFn: (id) => MEDIATOR?.cancelTeamRequest({ userId: id }),
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
    mutationFn: (id) => WORKER?.acceptBookingRequest({ invitationId: id }),
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
    mutationFn: (id) => WORKER?.rejectBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetch();
      TOAST?.showToast?.success(t("requestRejectedSuccessfully"));
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

  if (isLoading) {
    return <OnPageLoader />;
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <CustomSegmentedButton
            buttons={TABS}
            selectedTab={category}
            onValueChange={onCatChanged}
          />
          {memoizedData && memoizedData?.length > 0 ? (
            <>
              <View style={styles?.paginationTabs}>
                <PaginationString
                  type="requests"
                  isLoading={isLoading || isRefetching}
                  totalFetchedData={memoizedData?.length}
                  totalData={totalData}
                />
              </View>
              <ListingVerticalRequests
                listings={memoizedData || []}
                requestType="bookingRequest"
                isLoading={
                  mutationAcceptRequest?.isPending ||
                  mutationRejectRequest?.isPending ||
                  mutationCancelRequest?.isPending
                }
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
            </>
          ) : (
            <EmptyDatePlaceholder title={"Requests"} leftHeight={300} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  paginationTabs: {
    width: "100%",
    paddingBottom: 10,
  },
});

export default Requests;
