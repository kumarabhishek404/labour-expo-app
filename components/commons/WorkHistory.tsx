import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import Requirements from "./Requirements";

const WorkHistory = ({ workHistory }: any) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  const handleServicePress = (serviceId: string) => {
    router.push({
      pathname: "/screens/service/[id]",
      params: { id: serviceId },
    });
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(workHistory.length / itemsPerPage);
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
    <View style={styles.container}>
      <CustomHeading baseFont={18} textAlign="left">
        {t("workHistory")}
      </CustomHeading>

      {workHistory?.length > 0 ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {workHistory
              .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
              .map((work: any) => (
                <TouchableOpacity
                  key={work?._id}
                  style={styles.workItem}
                  onPress={() => handleServicePress(work?._id)}
                >
                  <View style={styles.headerRow}>
                    <CustomHeading
                      baseFont={16}
                      textAlign="left"
                      style={styles.serviceName}
                    >
                      {t(work?.type)} - {t(work?.subType)}
                    </CustomHeading>
                    <CustomText style={styles.date}>
                      {new Date(work?.startDate).toLocaleDateString()}
                    </CustomText>
                  </View>

                  <Requirements type="small" requirements={work?.requirements} />

                  <View>
                    <View style={styles.detailRow}>
                      <CustomText style={styles.description}>
                        Service Type - {t(work?.bookingType)}
                      </CustomText>
                    </View>

                    <View style={styles.footerRow}>
                      <CustomText style={styles.address} textAlign="left">
                        📍 {work?.address}
                      </CustomText>
                      <CustomText style={styles.duration}>
                        ⏱️ {work?.duration} {t("days")}
                      </CustomText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
          {renderPagination()}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <CustomText style={styles.emptyText}>{t("noWorkHistory")}</CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  workItem: {
    backgroundColor: Colors.secondary,
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
    width: "80%",
    fontSize: 12,
    color: Colors.white,
  },
  duration: {
    fontSize: 12,
    color: Colors.white,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
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
  detailRow: {
    flexDirection: "row",
    marginTop: 5,
    flexWrap: "wrap",
  },
  emptyContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.gray,
  },
});

export default WorkHistory;