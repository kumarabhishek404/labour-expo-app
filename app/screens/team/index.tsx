import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { fetchAllMembers } from "@/app/api/mediator";
import { UserAtom } from "@/app/AtomStore/user";
import { router, Stack } from "expo-router";
import PaginationString from "@/components/commons/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import { MEMBERS } from "@/constants";


const Members = () => {
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData]: any = useState([]);
  const [category, setCategory] = useState("All");

  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["members"],
    queryFn: ({ pageParam }) => fetchAllMembers({ pageParam }),
    retry: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

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
            <CustomHeader title="Team" left="back" right="notification" />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <SearchFilter data={response} setFilteredData={setFilteredData} />

          <CategoryButtons options={MEMBERS} onCagtegoryChanged={onCatChanged} />

          <PaginationString
            type="members"
            isLoading={isLoading}
            totalFetchedData={memoizedData?.length}
            totalData={totalData}
          />

          <ListingsVerticalWorkers
            listings={memoizedData || []}
            category="workers"
            loadMore={loadMore}
            isFetchingNextPage={isFetchingNextPage}
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

export default Members;
