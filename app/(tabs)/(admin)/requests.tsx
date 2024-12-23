import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { UserAtom } from "@/app/AtomStore/user";
import { router, Stack } from "expo-router";
import {
  acceptJoiningRequest,
  cancelJoiningRequest,
  fetchAllRequests,
  fetchRecievedRequests,
  fetchSentRequests,
  rejectJoiningRequest,
} from "@/app/api/requests";
import ListingVerticalRequests from "@/components/commons/ListingVerticalRequests";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { ADMINREQUEST, MEDIATORREQUEST, WORKERREQUEST } from "@/constants";
import { toast } from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import { fetchAllRequestsForAdmin } from "@/app/api/admin";

const Requests = () => {
  const userDetails = useAtomValue(UserAtom);
  const { refreshUser } = useRefreshUser();
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("recievedRequests");

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["requests", category],
    queryFn: ({ pageParam }) =>
      fetchAllRequestsForAdmin({ pageParam, type: category }),
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
      const totalData = response?.pages[0]?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredData(
        response?.pages?.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  const mutationAcceptRequest = useMutation({
    mutationKey: ["acceptRequest"],
    mutationFn: (id) => acceptJoiningRequest({ requestId: id }),
    onSuccess: (response) => {
      refetch();
      refreshUser();
      toast.success(t("requestAcceptedSuccessfully"));
    },
  });

  const mutationRejectRequest = useMutation({
    mutationKey: ["rejectRequest"],
    mutationFn: (id) => rejectJoiningRequest({ requestId: id }),
    onSuccess: (response) => {
      refetch();
    },
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
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title="Requests" left="back" right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader
          loading={
            isLoading ||
            mutationAcceptRequest?.isPending ||
            mutationRejectRequest?.isPending
          }
        />
        <View style={styles.container}>
          <SearchFilter data={response} setFilteredData={setFilteredData} />

          <CategoryButtons
            options={ADMINREQUEST}
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
            category={category}
            loadMore={loadMore}
            isFetchingNextPage={isFetchingNextPage}
            onAcceptRequest={mutationAcceptRequest?.mutate}
            onRejectRequest={mutationRejectRequest?.mutate}
          />
        </View>
      </View>
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
