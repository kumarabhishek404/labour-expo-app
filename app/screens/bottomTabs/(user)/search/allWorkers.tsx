import React, { useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ListingsVerticalWorkers from "@/components/commons/ListingsVerticalWorkers";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import { extractWorkerSkills, WORKERTYPES, WORKTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import FloatingButton from "@/components/inputs/FloatingButton";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import FiltersWorkers from "./filterWorkers";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { Entypo } from "@expo/vector-icons";
import WorkersLoadingPlaceholder from "@/components/commons/LoadingPlaceholders/ListingVerticalWorkerPlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";

const AllWorkers = ({
  isLoading,
  isRefetching,
  isFetchingNextPage,
  refreshing,
  memoizedData,
  onRefresh,
  totalData,
  loadMore,
}: any) => {
  const [isAddFilters, setIsAddFilters] = useState(false);

  const onSearchWorkers = (data: any) => {
    setIsAddFilters(false);
    const searchCategory = {
      distance: data?.distance,
      completedServices: data?.completedServices,
      rating: data?.rating,
      skills: data?.skills,
    };

    router?.push({
      pathname: "/screens/users",
      params: {
        title: "allWorkers",
        type: "all",
        searchCategory: JSON.stringify(searchCategory),
      },
    });
  };

  console.log("extractWorkerSkills(WORKTYPES)---", extractWorkerSkills(WORKTYPES));
  
  return (
    <GradientWrapper height={Dimensions.get("window").height - 180}>
      {isLoading ? (
        <WorkersLoadingPlaceholder />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles?.paginationHeader}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
                onPress={() => setIsAddFilters(true)}
              >
                <Entypo name="plus" size={20} color={Colors?.fourthButton} />
                <CustomText
                  baseFont={17}
                  color={Colors?.fourthButton}
                  fontWeight="600"
                >
                  {t("applyFilters")}
                </CustomText>
              </TouchableOpacity>
            </View>
            {Array.isArray(memoizedData) && memoizedData.length > 0 ? (
              <ListingsVerticalWorkers
                style={styles.listContainer}
                availableInterest={WORKERTYPES}
                listings={memoizedData || []}
                loadMore={loadMore}
                type={"worker"}
                isFetchingNextPage={isFetchingNextPage}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <EmptyDataPlaceholder title="worker" type="gradient" />
            )}
          </View>
        </>
      )}

      <FiltersWorkers
        filterVisible={isAddFilters}
        setFilterVisible={setIsAddFilters}
        onApply={onSearchWorkers}
      />
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors?.fourth,
    paddingHorizontal: 15,
    // paddingVertical: 10,
  },
  paginationHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default AllWorkers;
