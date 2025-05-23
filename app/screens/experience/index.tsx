import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useAtomValue } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loaders/Loader";
import { router, Stack } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import CustomText from "@/components/commons/CustomText";
import Requirements from "@/components/commons/Requirements";
import CustomHeading from "@/components/commons/CustomHeading";
import Atoms from "@/app/AtomStore";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import ShowDistance from "@/components/commons/ShowDistance";
import DateDisplay from "@/components/commons/ShowDate";

const Experience = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [filteredData, setFilteredData]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Combine work and service history
  useFocusEffect(
    React.useCallback(() => {
      const combinedHistory = [
        ...(userDetails?.workHistory || []),
        ...(userDetails?.serviceHistory || []),
      ];
      setFilteredData(combinedHistory);
      setIsLoading(false);
    }, [userDetails])
  );

  const handleServicePress = (serviceId: string) => {
    router.push({
      pathname: "/screens/service/[id]",
      params: { id: serviceId },
    });
  };

  const renderWorkItem = ({ item: work }: { item: any }) => (
    <TouchableOpacity
      key={work._id}
      style={styles.workItem}
      onPress={() => handleServicePress(work._id)}
    >
      <View style={styles.headerRow}>
        <CustomHeading
          baseFont={16}
          textAlign="left"
          style={styles.serviceName}
        >
          {t(work?.type)} {" - "} {t(work?.subType)}
        </CustomHeading>
        <DateDisplay
          date={work.startDate}
          type="date"
          styles={{ color: Colors?.white }}
        />
      </View>

      <Requirements type="small" requirements={work?.requirements} />

      <View>
        {/* <View style={styles.detailRow}>
          <CustomText style={styles.description}>{work.description}</CustomText>
        </View> */}

        <View style={styles.footerRow}>
          <CustomText
            baseFont={14}
            color={Colors?.white}
            textAlign="left"
            style={styles.address}
          >
            📍 {work.address} {work.address}
          </CustomText>
          <CustomText
            textAlign="right"
            baseFont={14}
            color={Colors?.white}
            style={styles.duration}
          >
            ⏱️ {work.duration} {t("days")}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    return (
      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              currentPage === index && styles.activePageButton,
            ]}
            onPress={() => setCurrentPage(index)}
          >
            <CustomText
              style={[
                styles.pageButtonText,
                currentPage === index && styles.activePageButtonText,
              ]}
            >
              {index + 1}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  console.log("filteredData", filteredData);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title="workExperience"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        {/* <Loader loading={isLoading} /> */}
        {isLoading ? (
          <ListingsServicesPlaceholder />
        ) : (
          <View style={styles.container}>
            {/* <SearchFilter
            type="services"
            data={filteredData}
            setFilteredData={setFilteredData}
          /> */}

            {/* <PaginationString
              type="requests"
              isLoading={isLoading}
              totalFetchedData={filteredData?.length}
              totalData={filteredData?.length}
            /> */}
            {filteredData?.length > 0 ? (
              <>
                <FlatList
                  data={filteredData.slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )}
                  renderItem={renderWorkItem}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(data, index) => ({
                    length: 100,
                    offset: 100 * index,
                    index,
                  })}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={3}
                  removeClippedSubviews={true}
                  contentContainerStyle={{ paddingBottom: 110 }}
                  ListFooterComponent={renderPagination}
                />
              </>
            ) : (
              <EmptyDataPlaceholder title="workExperience" leftHeight={160} />
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors?.fourth,
    paddingTop: 10,
  },
  workItem: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    flex: 1,
    color: Colors.white,
  },
  date: {
    fontSize: 12,
    color: Colors.white,
  },
  description: {
    fontSize: 13,
    color: Colors.white,
  },
  footerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
    gap: 10,
  },
  address: {
    flex: 1,
  },
  duration: {
    width: "20%",
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 5,
    flexWrap: "wrap",
  },
  emptyContainer: {
    borderRadius: 8,
    paddingVertical: 100,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  pageButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  activePageButton: {
    backgroundColor: Colors.primary,
  },
  pageButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  activePageButtonText: {
    color: Colors.white,
  },
});

export default Experience;
