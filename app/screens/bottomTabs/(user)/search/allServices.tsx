import React, { useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import FloatingButton from "@/components/inputs/FloatingButton";
import FiltersServices from "./filterServices";
import OnPageLoader from "@/components/commons/Loaders/OnPageLoader";
import { Entypo } from "@expo/vector-icons";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";

const AllServices = ({
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

  const onSearchService = (data: any) => {
    setIsAddFilters(false);
    const searchCategory = {
      distance: data?.distance,
      duration: data?.duration,
      serviceStartIn: data?.serviceStartIn,
      skills: data?.skills,
    };

    router?.push({
      pathname: "/screens/service",
      params: {
        title: "allServices",
        type: "all",
        searchCategory: JSON.stringify(searchCategory),
      },
    });
  };

  return (
    <GradientWrapper height={Dimensions.get("window").height - 180}>
      {isLoading ? (
        <ListingsServicesPlaceholder />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles?.paginationHeader}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
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
            {memoizedData && memoizedData?.length > 0 ? (
              <ListingsVerticalServices
                listings={memoizedData || []}
                loadMore={loadMore}
                isFetchingNextPage={isFetchingNextPage}
                refreshControl={
                  <RefreshControl
                    refreshing={!isRefetching && refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <EmptyDataPlaceholder title="service" />
            )}
          </View>
        </>
      )}

      <FiltersServices
        filterVisible={isAddFilters}
        setFilterVisible={setIsAddFilters}
        onApply={onSearchService}
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
});

export default AllServices;
