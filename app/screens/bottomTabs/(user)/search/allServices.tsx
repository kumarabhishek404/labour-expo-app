import React, { useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsVerticalServices from "@/components/commons/ListingsVerticalServices";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import FiltersServices from "./filterServices";
import { Entypo } from "@expo/vector-icons";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import GradientWrapper from "@/components/commons/GradientWrapper";
import TextButton from "@/components/inputs/TextButton";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

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
const userRole = useAtomValue(Atoms.SelectedRoleAtom)

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
          <View style={[styles.container, userRole !== "WORKER" && {paddingBottom: 150,}]}>
            <View style={styles.headingContainer}>
              {userRole === "WORKER" && <CustomText
                baseFont={30}
                fontWeight="700"
                color={Colors?.white}
                style={styles.heading}
              >
                {t("allServices")}
              </CustomText>}
              <CustomText
                baseFont={14}
                color={Colors?.white}
                style={styles.subHeading}
              >
                {t("allServicesSubHeading")}
              </CustomText>
            </View>

            {/* <View style={styles?.paginationHeader}>
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
            </View> */}
            {Array.isArray(memoizedData) && memoizedData.length > 0 ? (
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
              <EmptyDataPlaceholder
                title="service"
                type="gradient"
                buttonTitle="refresh"
                onPress={onRefresh}
              />
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
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headingContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headingBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    paddingLeft: 5,
  },
  buttonText: {
    display: "flex",
    flexDirection: "row",
  },
  subHeading: {
    opacity: 0.9,
    lineHeight: 20,
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
