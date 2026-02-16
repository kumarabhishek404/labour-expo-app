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
import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
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

  return (
    <GradientWrapper height={Dimensions.get("window").height - 180}>
      {isLoading ? (
        <WorkersLoadingPlaceholder />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.headingContainer}>
              {/* <CustomText
                baseFont={30}
                fontWeight="700"
                color={Colors?.white}
                style={styles.heading}
              >
                {t("allWorkers")}
              </CustomText> */}
              <CustomText
                baseFont={14}
                color={Colors?.white}
                style={styles.subHeading}
              >
                {t("workersListSubHeading")}
              </CustomText>
            </View>
            {/* <View style={styles?.paginationHeader}>
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
            </View> */}
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
    paddingHorizontal: 15,
    paddingBottom: 150,
    paddingTop: 10,
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
  headingContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  heading: {
    paddingLeft: 5,
  },
  subHeading: {
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default AllWorkers;
