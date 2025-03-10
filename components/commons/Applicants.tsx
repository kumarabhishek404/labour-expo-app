import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "./Loaders/Loader";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import ProfilePicture from "./ProfilePicture";
import { t } from "@/utils/translationHelper";
import EMPLOYER from "@/app/api/employer";
import ShowSkills from "./ShowSkills";

interface ApplicantsProps {
  applicants: any;
  serviceId: string;
  refetchApplicants: any;
  refetchSelectedApplicants: any;
  refetch: any;
}

const Applicants = ({
  applicants,
  serviceId,
  refetchApplicants,
  refetchSelectedApplicants,
  refetch,
}: ApplicantsProps) => {
  console.log("applicants --", applicants[0]?.user?.skills);

  const mutationSelectWorker = useMutation({
    mutationKey: ["selectWorker", { serviceId }],
    mutationFn: (userId) =>
      EMPLOYER?.selectWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("workerSelectedSuccessfully"));
      console.log("Response while seleting an worker for service - ", response);
    },
    onError: (err) => {
      console.error("error while seleting an worker for service ", err);
    },
  });

  const mutationRejectWorker = useMutation({
    mutationKey: ["rejectWorker", { serviceId }],
    mutationFn: (userId) =>
      EMPLOYER?.rejectWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchApplicants();
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("workerRejectedSuccessfully"));
      console.log("Response while rejecting an selected worker - ", response);
    },
    onError: (err) => {
      console.error("error while rejecting an selected worker ", err);
    },
  });

  const animatedHeights = React.useRef<{ [key: string]: Animated.Value }>({});

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleAccordion = (itemId: string) => {
    const isExpanded = expandedItem === itemId;
    setExpandedItem(isExpanded ? null : itemId);

    Animated.timing(animatedHeights.current[itemId], {
      toValue: isExpanded ? 0 : 1,
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

  return (
    <>
      <Loader
        loading={
          mutationSelectWorker?.isPending || mutationRejectWorker?.isPending
        }
      />
      <View style={styles.applicantContainer}>
        {applicants?.map((item: any, index: number) => {
          const appliedUser = item?.user;
          const workers = item?.workers;
          return (
            <View key={index} style={styles.mediatorCard}>
              <View style={styles.productCard}>
                <ProfilePicture uri={appliedUser?.profilePicture} />
                <View style={styles.productInfo}>
                  <View style={styles?.titleContainer}>
                    <CustomHeading baseFont={14}>
                      {appliedUser?.name}
                    </CustomHeading>
                  </View>

                  <ShowSkills type="small" userSkills={appliedUser?.skills} />
                  <View style={styles.recommendationContainer}>
                    <Ionicons name="location" size={14} color="gray" />
                    <CustomText textAlign="left">
                      {appliedUser?.address || "Not provided"}
                    </CustomText>
                  </View>
                </View>
                <View
                  style={{
                    alignContent: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  <Button
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      marginTop: 6,
                      minHeight: 30,
                    }}
                    textStyle={{
                      fontSize: 14,
                    }}
                    isPrimary={false}
                    title="Details"
                    onPress={() =>
                      router?.push({
                        pathname: "/screens/users/[id]",
                        params: {
                          id: appliedUser?._id,
                          role: "workers",
                          type: "applicant",
                        },
                      })
                    }
                  />
                </View>
              </View>
              {/* Add workers section */}
              {workers?.length > 0 && (
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
                        Associated Workers ({workers?.length})
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

                  {expandedItem === item._id && (
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
                      {workers?.map((worker: any, workerIndex: number) => (
                        <View key={workerIndex} style={styles.workerItem}>
                          <ProfilePicture uri={worker?.profilePicture} />
                          <View style={styles.workerInfo}>
                            <CustomText style={styles.workerName}>
                              {worker?.name}
                            </CustomText>
                            <ShowSkills
                              type="small"
                              userSkills={worker?.skills}
                            />
                          </View>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </View>
              )}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <Button
                  style={{
                    minHeight: 30,
                    width: "30%",
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                  }}
                  bgColor={Colors?.danger}
                  borderColor={Colors?.danger}
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
                  title={t("reject")}
                  onPress={() => mutationRejectWorker?.mutate(appliedUser?._id)}
                />
                <Button
                  style={{
                    minHeight: 30,
                    width: "40%",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                  }}
                  bgColor={Colors?.success}
                  borderColor={Colors?.success}
                  textStyle={{
                    fontSize: 14,
                  }}
                  icon={
                    <Entypo
                      name="check"
                      size={14}
                      color="white"
                      style={{ marginRight: 4 }}
                    />
                  }
                  isPrimary={true}
                  title="Select"
                  onPress={() => mutationSelectWorker?.mutate(appliedUser?._id)}
                />
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
    flex: 1,
  },
  applicantContainer: {
    gap: 5,
  },
  mediatorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
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
    backgroundColor: Colors?.fourth,
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
});

export default Applicants;
