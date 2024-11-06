import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { cancelSeletedApplicant } from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import Loader from "./Loader";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import ProfilePicture from "./ProfilePicture";

interface SelectedApplicantsProps {
  selectedApplicants: any;
  serviceId: String;
  refetchSelectedApplicants: any;
}

const SelectedApplicants = ({
  selectedApplicants,
  serviceId,
  refetchSelectedApplicants,
}: SelectedApplicantsProps) => {
  const mutationCancelSelectedApplicant = useMutation({
    mutationKey: ["rejectCandidate", { serviceId }],
    mutationFn: (userId) => cancelSeletedApplicant({ serviceId, userId }),
    onSuccess: (response) => {
      refetchSelectedApplicants();
      toast.success("Cancel selected applicant successfully");
      console.log(
        "Response while cancelling an selected applicant - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while cancelling an selected applicant ", err);
    },
  });

  return (
    <>
      <Loader loading={mutationCancelSelectedApplicant?.isPending} />
      <View style={styles.applicantContainer}>
        <CustomHeading textAlign="left">Selected Worker</CustomHeading>
        {selectedApplicants?.map((item: any, index: number) => {
          return (
            <View key={index} style={styles.productCard}>
              <View style={{ flexDirection: "column" }}>
                <ProfilePicture uri={item?.profilePicture} />
                <Button
                  style={{
                    width: 60,
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                    marginTop: 6,
                  }}
                  textStyle={{
                    fontSize: 11,
                  }}
                  isPrimary={false}
                  title="Details"
                  onPress={() =>
                    router?.push({
                      pathname: `/screens/users/${item._id}`,
                      params: {
                        role: 'workers',
                        type: "applicant",
                      },
                    })
                  }
                />
              </View>
              <View style={styles.productInfo}>
                <View style={styles?.titleContainer}>
                  <View style={{ gap: 2, marginBottom: 4 }}>
                    <CustomHeading fontSize={14}>
                      {item?.firstName} {item?.lastName}
                    </CustomHeading>
                    <CustomText style={styles.caption}>
                      {item?.role === "WORKER" ? "WORKER" : "MEDIATOR"}
                    </CustomText>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <Button
                      style={{
                        paddingVertical: 3,
                        paddingHorizontal: 6,
                        marginLeft: 4,
                        backgroundColor: Colors?.primary,
                        borderColor: Colors?.primary,
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      icon={
                        <FontAwesome
                          name="phone"
                          size={16}
                          color="white"
                          style={{ marginRight: 6 }}
                        />
                      }
                      isPrimary={true}
                      title="Call"
                      onPress={() => {}}
                    />
                    <Button
                      style={{
                        paddingVertical: 3,
                        paddingHorizontal: 6,
                        marginLeft: 4,
                        backgroundColor: Colors?.danger,
                        borderColor: Colors?.danger,
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      icon={
                        <FontAwesome
                          name="remove"
                          size={14}
                          color="white"
                          style={{ marginRight: 4 }}
                        />
                      }
                      isPrimary={true}
                      title="Remove"
                      onPress={() =>
                        mutationCancelSelectedApplicant?.mutate(item?._id)
                      }
                    />
                  </View>
                </View>

                <View style={styles.recommendationContainer}>
                  <MaterialCommunityIcons
                    name="hammer-sickle"
                    size={14}
                    color="gray"
                  />
                  <CustomText
                    textAlign="left"
                    style={{ textTransform: "capitalize" }}
                  >
                    {item?.skills?.join(", ")}
                  </CustomText>
                </View>
                <View style={styles.recommendationContainer}>
                  <Ionicons name="location" size={14} color="gray" />
                  <CustomText textAlign="left">{item.address}</CustomText>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  applicantList: {
    display: "flex",
  },
  applicantContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    gap: 5,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignItems: "flex-start",
    borderColor: Colors?.primary,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2,
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  caption: {
    fontWeight: "600",
    letterSpacing: 0,
    width: 90,
    padding: 2,
    borderRadius: 30,
    textAlign: "center",
    backgroundColor: "#d6ecdd",
  },
});

export default SelectedApplicants;
