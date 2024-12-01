import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { selectFromApplicant } from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import Loader from "./Loader";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import ProfilePicture from "./ProfilePicture";
import { t } from "@/utils/translationHelper";

interface ApplicantsProps {
  applicants: any;
  serviceId: string;
  refetchApplicants: any;
  refetchSelectedApplicants: any;
}

const Applicants = ({
  applicants,
  serviceId,
  refetchApplicants,
  refetchSelectedApplicants,
}: ApplicantsProps) => {
  const mutationSelectApplicant = useMutation({
    mutationKey: ["selectApplicant", { serviceId }],
    mutationFn: (userId) => selectFromApplicant({ serviceId, userId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      toast.success(t('workerSelectedSuccessfully'));
      console.log(
        "Response while seleting an applicant for service - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while seleting an applicant for service ", err);
    },
  });

  return (
    <>
      <Loader loading={mutationSelectApplicant?.isPending} />
      <View style={styles.applicantContainer}>
        <CustomHeading textAlign="left">Applicants</CustomHeading>
        {applicants?.pages[0]?.data?.map((item: any, index: number) => {
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
                      pathname: "/screens/users/[id]",
                      params: {
                        id: item._id,
                        role: "workers", 
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
                      {item.firstName} {item.lastName}
                    </CustomHeading>
                    <CustomText style={styles.caption}>
                      {item?.role === "WORKER" ? "WORKER" : "MEDIATOR"}
                    </CustomText>
                  </View>
                  <Button
                    style={{
                      width: 60,
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      marginLeft: 4,
                      backgroundColor: "#fa6400",
                      borderColor: "#fa6400",
                    }}
                    textStyle={{
                      fontSize: 10,
                    }}
                    isPrimary={true}
                    title="Select"
                    onPress={() => mutationSelectApplicant?.mutate(item?._id)}
                  />
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
                    {item.skills.join(", ")}
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
    padding: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    borderColor: "gray",
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
    alignItems: "flex-start",
    gap: 5,
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

export default Applicants;
