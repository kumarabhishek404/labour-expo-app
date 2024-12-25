import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/commons/Loader";
import CategoryButtons from "@/components/inputs/CategoryButtons";
import { UserAtom } from "@/app/AtomStore/user";
import { router, Stack } from "expo-router";
import PaginationString from "@/components/commons/Pagination/PaginationString";
import SearchFilter from "@/components/commons/SearchFilter";
import CustomHeader from "@/components/commons/Header";
import { MEDIATORREQUEST, WORKERREQUEST } from "@/constants";
import { toast } from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import CustomText from "@/components/commons/CustomText";
import Requirements from "@/components/commons/Requirements";
import CustomHeading from "@/components/commons/CustomHeading";

const Experience = () => {
  const userDetails = useAtomValue(UserAtom);
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
      onPress={() => handleServicePress(work.serviceId)}
    >
      <View style={styles.headerRow}>
        <CustomHeading
          fontSize={16}
          textAlign="left"
          style={styles.serviceName}
        >
          {work.serviceName}
        </CustomHeading>
        <CustomText style={styles.date}>
          {new Date(work.startDate).toLocaleDateString()}
        </CustomText>
      </View>

      <Requirements type="small" requirements={work?.requirements} />

      <View>
        <View style={styles.detailRow}>
          <CustomText style={styles.description}>{work.description}</CustomText>
        </View>

        <View style={styles.footerRow}>
          <CustomText style={styles.address}>📍 {work.address}</CustomText>
          <CustomText style={styles.duration}>
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

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title="Work Experience"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <View style={styles.container}>
          <SearchFilter data={filteredData} setFilteredData={setFilteredData} />

          <PaginationString
            type="requests"
            isLoading={isLoading}
            totalFetchedData={filteredData?.length}
            totalData={filteredData?.length}
          />
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
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                {t("noWorkHistory")}
              </CustomText>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 10,
  },
  workItem: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
  },
  address: {
    fontSize: 12,
    color: Colors.white,
  },
  duration: {
    fontSize: 12,
    color: Colors.white,
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