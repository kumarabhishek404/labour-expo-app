import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  cancelSelectedWorker,
  rejectMediator,
  rejectWorker,
  selectMediator,
  selectWorker,
} from "@/app/api/services";
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
  const mutationSelectWorker = useMutation({
    mutationKey: ["selectWorker", { serviceId }],
    mutationFn: (userId) =>
      selectWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      toast.success(t("workerSelectedSuccessfully"));
      console.log("Response while seleting an worker for service - ", response);
    },
    onError: (err) => {
      console.error("error while seleting an worker for service ", err);
    },
  });

  const mutationSelectMediator = useMutation({
    mutationKey: ["selectMediator", { serviceId }],
    mutationFn: (mediatorId) =>
      selectMediator({ serviceId: serviceId, mediator: mediatorId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      toast.success(t("mediatorSelectedSuccessfully"));
      console.log(
        "Response while seleting an mediator for service - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while seleting an mediator for service ", err);
    },
  });

  const mutationRejectWorker = useMutation({
    mutationKey: ["rejectWorker", { serviceId }],
    mutationFn: (userId) =>
      rejectWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      toast.success(t("workerRejectedSuccessfully"));
      console.log("Response while rejecting an selected worker - ", response);
    },
    onError: (err) => {
      console.error("error while rejecting an selected worker ", err);
    },
  });

  const mutationRejectMediator = useMutation({
    mutationKey: ["rejectMediator", { serviceId }],
    mutationFn: (mediatorId) =>
      rejectMediator({ serviceId: serviceId, mediatorId: mediatorId }),
    onSuccess: (response) => {
      refetchSelectedApplicants();
      refetchApplicants();
      toast.success(t("mediatorRejectedSuccessfully"));
      console.log("Response while rejecting an applied mediator - ", response);
    },
    onError: (err) => {
      console.error("error while rejecting an applied mediator ", err);
    },
  });

  const [expandedItems, setExpandedItems] = React.useState<{
    [key: string]: boolean;
  }>({});
  const animatedHeights = React.useRef<{ [key: string]: Animated.Value }>({});

  const toggleAccordion = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));

    Animated.timing(animatedHeights.current[itemId], {
      toValue: expandedItems[itemId] ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    applicants?.forEach((item: any) => {
      if (!animatedHeights.current[item._id]) {
        animatedHeights.current[item._id] = new Animated.Value(0);
      }
    });
  }, [applicants]);

  console.log("applicants", applicants);
  return (
    <>
      <Loader
        loading={
          mutationSelectWorker?.isPending ||
          mutationSelectMediator?.isPending ||
          mutationRejectWorker?.isPending ||
          mutationRejectMediator?.isPending
        }
      />
      <View style={styles.applicantContainer}>
        {applicants?.map((item: any, index: number) => {
          console.log("item", item);
          return (
            <View key={index} style={styles.mediatorCard}>
              <View style={styles.productCard}>
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
                          id: item?._id,
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
                        {item?.firstName} {item?.lastName}
                      </CustomHeading>
                      <CustomText style={styles.caption}>
                        {item?.role === "WORKER" ? "WORKER" : "MEDIATOR"}
                      </CustomText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 5,
                      }}
                    >
                      <Button
                        style={{
                          width: 60,
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          marginLeft: 4,
                          backgroundColor: "#fa6400",
                          borderColor: "#fa6400",
                          alignSelf: "flex-end",
                        }}
                        textStyle={{
                          fontSize: 10,
                        }}
                        isPrimary={true}
                        title="Select"
                        onPress={() =>
                          item?.role === "WORKER"
                            ? mutationSelectWorker?.mutate(item?._id)
                            : mutationSelectMediator?.mutate(item?._id)
                        }
                      />
                      <Button
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 6,
                          marginLeft: 4,
                          backgroundColor: Colors?.danger,
                          borderColor: Colors?.danger,
                        }}
                        textStyle={{
                          fontSize: 10,
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
                        title="Reject"
                        onPress={() =>
                          item?.role === "WORKER"
                            ? mutationRejectWorker?.mutate(item?._id)
                            : mutationRejectMediator?.mutate(item?._id)
                        }
                      />
                    </View>
                  </View>

                  {item?.role !== "MEDIATOR" && item?.skills?.length > 0 && (
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
                  )}
                  <View style={styles.recommendationContainer}>
                    <Ionicons name="location" size={14} color="gray" />
                    <CustomText textAlign="left">
                      {item?.address || "Not provided"}
                    </CustomText>
                  </View>
                </View>
              </View>
              {/* Add workers section */}
              {item?.workers?.length > 0 && (
                <View style={styles.workersContainer}>
                  <TouchableOpacity
                    style={styles.workersTitleContainer}
                    onPress={() => toggleAccordion(item._id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.workersTitleLeft}>
                      <Ionicons
                        name="people"
                        size={14}
                        color={Colors.primary}
                      />
                      <CustomText style={styles.workersTitle}>
                        Associated Workers ({item?.workers?.length})
                      </CustomText>
                    </View>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            rotate: (
                              animatedHeights.current[item._id] ||
                              new Animated.Value(0)
                            ).interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0deg", "180deg"],
                            }),
                          },
                        ],
                      }}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={Colors.primary}
                      />
                    </Animated.View>
                  </TouchableOpacity>

                  {expandedItems[item._id] && (
                    <Animated.View
                      style={[
                        styles.workersGrid,
                        {
                          opacity:
                            animatedHeights.current[item._id] ||
                            new Animated.Value(0),
                        },
                      ]}
                    >
                      {item?.workers?.map(
                        (worker: any, workerIndex: number) => (
                          <View key={workerIndex} style={styles.workerItem}>
                            <ProfilePicture uri={worker?.profilePicture} />
                            <View style={styles.workerInfo}>
                              <CustomText style={styles.workerName}>
                                {worker?.firstName} {worker?.lastName}
                              </CustomText>
                              <View style={styles.workerSkillsContainer}>
                                <MaterialCommunityIcons
                                  name="hammer-wrench"
                                  size={12}
                                  color={Colors.primary}
                                />
                                <CustomText style={styles.workerSkills}>
                                  {worker?.skills?.join(", ")}
                                </CustomText>
                              </View>
                            </View>
                          </View>
                        )
                      )}
                    </Animated.View>
                  )}
                </View>
              )}
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
    gap: 5,
  },
  mediatorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
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
    justifyContent: "flex-start",
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
  workersContainer: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  workersTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  workersTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  workersTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
  workersGrid: {
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 10,
  },
  workerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 10,
  },
  workerInfo: {
    flex: 1,
    gap: 4,
    alignItems: "flex-start",
  },
  workerName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2c3e50",
  },
  workerSkillsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  workerSkills: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
});

export default Applicants;
