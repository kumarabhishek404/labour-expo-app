import React from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import Colors from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import EMPLOYER from "@/app/api/employer";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import ProfilePicture from "@/components/commons/ProfilePicture";
import CustomText from "@/components/commons/CustomText";
import ShowAddress from "@/components/commons/ShowAddress";
import ShowSkills from "@/components/commons/ShowSkills";
import ButtonComp from "@/components/inputs/Button";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";

const ApplicantsList = ({
  applicants,
  serviceId,
  refetchApplicants,
  refetchSelectedApplicants,
  refetch,
  isLoading,
}: any) => {
  const mutationSelectWorker = useMutation({
    mutationKey: ["selectWorker", { serviceId }],
    mutationFn: (userId) => EMPLOYER?.selectWorker({ serviceId, userId }),
    onSuccess: () => {
      refetchApplicants();
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("workerSelectedSuccessfully"));
    },
    onError: (err) => console.error("Error selecting worker: ", err),
  });

  const mutationRejectWorker = useMutation({
    mutationKey: ["rejectWorker", { serviceId }],
    mutationFn: (userId) => EMPLOYER?.rejectWorker({ serviceId, userId }),
    onSuccess: () => {
      refetchApplicants();
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("workerRejectedSuccessfully"));
    },
    onError: (err) => console.error("Error rejecting worker: ", err),
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : applicants?.length > 0 ? (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.user._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ProfilePicture uri={item.user.profilePicture} />
              <View style={styles.infoContainer}>
                <CustomText fontWeight="600" style={styles.name}>
                  {item.user.name}
                </CustomText>
                <ShowAddress address={item.user.address} />
                <ShowSkills userSkills={item.user.skills} />
              </View>
              <View style={styles.buttonContainer}>
                <ButtonComp
                  isPrimary
                  bgColor={Colors.danger}
                  title={t("Reject")}
                  onPress={() => mutationRejectWorker.mutate(item.user._id)}
                />
                <ButtonComp
                  isPrimary
                  bgColor={Colors.success}
                  title={t("Select")}
                  onPress={() => mutationSelectWorker.mutate(item.user._id)}
                />
              </View>
            </View>
          )}
        />
      ) : (
        <EmptyDataPlaceholder title={t("No Applicants Found")} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.background,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

export default ApplicantsList;
