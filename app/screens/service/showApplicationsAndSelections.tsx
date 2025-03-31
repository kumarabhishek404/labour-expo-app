import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Colors from "@/constants/Colors";
import CustomText from "@/components/commons/CustomText";
import ApplicantsList from "./applicants";
import SelectedApplicantsList from "./selectedApplicants";
import ProfileTabs from "@/components/inputs/TabsSwitcher";
import Applicants from "@/components/commons/Applicants";
import CustomSegmentedButton from "../bottomTabs/(user)/bookingsAndRequests/customTabs";

const ApplicantsTabScreen = ({
  applicants,
  selectedApplicants,
  serviceId,
  isSelectedWorkerLoading,
  isSelectedWorkerFetchingNextPage,
  isAppliedWorkersLoading,
  isAppliedWorkersFetchingNextPage,
  refetchAppliedWorkers,
  refetchSelectedWorkers,
  refetch,
}: any) => {
  const [activeTab, setActiveTab] = useState("applicants");

  const TABS: any = [
    { value: "applicants", label: "applicants" },
    { value: "selectedApplicants", label: "selectedApplicants" },
  ];

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 5 }}>
        <CustomSegmentedButton
          buttons={TABS}
          tabCounts={[applicants?.length, selectedApplicants?.length]}
          selectedTab={activeTab}
          onValueChange={setActiveTab}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === "applicants" ? (
          <Applicants
            title="whoHaveApplied"
            applicants={applicants}
            serviceId={serviceId}
            isAppliedWorkersLoading={isAppliedWorkersLoading}
            isAppliedWorkersFetchingNextPage={isAppliedWorkersFetchingNextPage}
            refetchApplicants={() => {
              refetchAppliedWorkers();
            }}
            refetchSelectedApplicants={() => {
              refetchSelectedWorkers();
            }}
            refetch={refetch}
          />
        ) : (
          <Applicants
            title="whoHaveSelected"
            type="selectedApplicants"
            applicants={selectedApplicants}
            serviceId={serviceId}
            isAppliedWorkersLoading={isSelectedWorkerLoading}
            isAppliedWorkersFetchingNextPage={isSelectedWorkerFetchingNextPage}
            refetchApplicants={() => {
              refetchAppliedWorkers();
            }}
            refetchSelectedApplicants={() => {
              refetchSelectedWorkers();
            }}
            refetch={refetch}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ApplicantsTabScreen;
