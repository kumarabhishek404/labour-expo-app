import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { UserAtom } from "../../../AtomStore/user";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { usePullToRefresh } from "../../../hooks/usePullToRefresh";
import { ROLES, USERS, WORKERTYPES } from "@/constants";
import * as Location from "expo-location";
import Filters from "@/components/commons/Filters";
import SearchFilter from "@/components/commons/SearchFilter";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { activateUser, fetchAllUsers, suspendUser } from "@/app/api/admin";
import ListingsVerticalUsersAdmin from "@/components/commons/ListingsVerticalUsersAdmin";
import { toast } from "@/app/hooks/toast";

const AdminUsers = () => {
  const userDetails = useAtomValue(UserAtom);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [status, setStatus] = useState("ACTIVE");
  const [role, setRole] = useState("WORKER");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({}); // Store applied filters here

  const {
    data: response,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["users", status, role, filters], // Add filters to queryKey to refetch when they change
    queryFn: ({ pageParam }) => {
      const payload = {
        pageParam,
        ...filters, // Add filters to the API request payload
      };
      return fetchAllUsers({ ...payload, role: role, status: status });
    },
    retry: false,
    initialPageParam: 1,
    refetchOnMount: true,
    enabled: !!userDetails?._id,
    getNextPageParam: (lastPage: any, pages) => {
      // console.log("Last--", lastPage?.pagination);

      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
    // refetchInterval: 5000
  });

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current position
      let currentLocation = await Location.getCurrentPositionAsync({});
      // setLocation(currentLocation);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const totalData = response?.pages[0]?.pagination?.total;
      setTotalData(totalData);
      const unsubscribe = setFilteredData(
        response?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [response])
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const mutationSuspendUser = useMutation({
    mutationKey: ["suspendUser"],
    mutationFn: (payload: any) => suspendUser(payload),
    onSuccess: () => {
      toast.success("User suspended successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while suspending user");
    },
  });

  const mutationActivateUser = useMutation({
    mutationKey: ["activateUser"],
    mutationFn: (payload: any) => activateUser(payload),
    onSuccess: () => {
      toast.success("User activated successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while activating user");
    },
  });

  const handleApply = (appliedFilters: React.SetStateAction<any>) => {
    // Apply filters to API call and close modal
    setFilters(appliedFilters);
    setFilterVisible(false); // Close the modal
  };

  const handleClear = () => {
    // Clear all filters and refetch data
    setFilters({});
    setFilterVisible(false);
  };

  const loadMore = () => {
    console.log("Load more--", hasNextPage, isFetchingNextPage);

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const memoizedData = useMemo(
    () => filteredData?.flatMap((data: any) => data),
    [filteredData]
  );

  const onStatusChanged = (status: React.SetStateAction<string>) => {
    setStatus(status);
  };

  const onRoleChanged = (role: React.SetStateAction<string>) => {
    setRole(role);
  };

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={t("users")} right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader
          loading={
            isLoading ||
            mutationActivateUser?.isPending ||
            mutationSuspendUser?.isPending
          }
        />
        <View style={styles.container}>
          <SearchFilter type="users" data={response?.pages} setFilteredData={setFilteredData} />

          <CategoryButtons
            options={USERS}
            onCagtegoryChanged={onStatusChanged}
          />

          <CategoryButtons options={ROLES} onCagtegoryChanged={onRoleChanged} />

          <PaginationString
            type="services"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          {memoizedData && memoizedData?.length > 0 ? (
            <ListingsVerticalUsersAdmin
              type="worker"
              availableInterest={WORKERTYPES}
              listings={memoizedData || []}
              loadMore={loadMore}
              onSuspendUser={mutationSuspendUser.mutate}
              onActivateUser={mutationActivateUser.mutate}
              isFetchingNextPage={isFetchingNextPage}
              refreshControl={
                <RefreshControl
                  refreshing={!isRefetching && refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <EmptyDatePlaceholder title="Worker" />
          )}
        </View>

        <Filters
          filterVisible={isFilterVisible}
          setFilterVisible={setFilterVisible}
          onApply={handleApply}
        />
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

export default AdminUsers;
