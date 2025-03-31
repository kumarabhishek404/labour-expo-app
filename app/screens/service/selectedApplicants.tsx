import React from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import Colors from "@/constants/Colors";
import CustomHeading from "@/components/commons/CustomHeading";
import ProfilePicture from "@/components/commons/ProfilePicture";
import CustomText from "@/components/commons/CustomText";
import ShowAddress from "@/components/commons/ShowAddress";
import ShowSkills from "@/components/commons/ShowSkills";
import ButtonComp from "@/components/inputs/Button";
import EmptyDataPlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { handleCall } from "@/constants/functions";
import { useMutation } from "@tanstack/react-query";
import EMPLOYER from "@/app/api/employer";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";

const SelectedApplicantsList = ({
  selectedApplicants,
  serviceId,
  refetchSelectedApplicants,
  refetch,
  isLoading,
}: any) => {
  const mutationUnselectWorker = useMutation({
    mutationKey: ["unselectWorker", { serviceId }],
    // mutationFn: (userId) => EMPLOYER?.unselectWorker({ serviceId, userId }),
    onSuccess: () => {
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("workerUnselectedSuccessfully"));
    },
    onError: (err) => console.error("Error unselecting worker: ", err),
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : selectedApplicants?.length > 0 ? (
        <FlatList
          data={selectedApplicants}
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
                  title={t("Unselect")}
                  onPress={() => mutationUnselectWorker.mutate(item.user._id)}
                />
              </View>
            </View>
          )}
        />
      ) : (
        <EmptyDataPlaceholder title={t("No Selected Applicants Found")} />
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

export default SelectedApplicantsList;
