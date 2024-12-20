import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  cancelSelectedMediator,
  cancelSelectedWorker,
} from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import Loader from "./Loader";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import ProfilePicture from "./ProfilePicture";
import { t } from "@/utils/translationHelper";

interface SelectedApplicantsProps {
  selectedApplicants: any;
  serviceId: string;
  refetchSelectedApplicants: any;
}

const SelectedApplicants = ({
  selectedApplicants,
  serviceId,
  refetchSelectedApplicants,
}: SelectedApplicantsProps) => {
  const mutationCancelSelectedWorker = useMutation({
    mutationKey: ["cancelSelectedWorker", { serviceId }],
    mutationFn: (userId) =>
      cancelSelectedWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchSelectedApplicants();
      toast.success(t("cancelSelectedWorkerSuccess"));
      console.log("Response while cancelling an selected worker - ", response);
    },
    onError: (err) => {
      console.error("error while cancelling an selected worker ", err);
    },
  });

  const mutationCancelSelectedMediator = useMutation({
    mutationKey: ["cancelSelectedMediator", { serviceId }],
    mutationFn: (mediatorId) =>
      cancelSelectedMediator({ serviceId: serviceId, mediatorId: mediatorId }),
    onSuccess: (response) => {
      refetchSelectedApplicants();
      toast.success(t("cancelSelectedMediatorSuccess"));
      console.log(
        "Response while cancelling an selected mediator - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while cancelling an selected mediator ", err);
    },
  });

  const [expandedItems, setExpandedItems] = React.useState<{
    [key: string]: boolean;
  }>({});

  React.useEffect(() => {
    selectedApplicants?.forEach((item: any) => {
      if (!animatedHeights.current[item._id]) {
        animatedHeights.current[item._id] = new Animated.Value(0);
      }
    });
  }, [selectedApplicants]);

  const animatedHeights = React.useRef<{ [key: string]: Animated.Value }>({});

  const toggleAccordion = (itemId: string) => {
    if (!animatedHeights.current[itemId]) {
      animatedHeights.current[itemId] = new Animated.Value(0);
    }

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

  return (
    <>
      <Loader
        loading={
          mutationCancelSelectedWorker?.isPending ||
          mutationCancelSelectedMediator?.isPending
        }
      />
      <View style={styles.applicantContainer}>
        {selectedApplicants?.map((item: any, index: number) => {
          return (
            <View key={index} style={styles.workerCard}>
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
                          item?.role === "WORKER"
                            ? mutationCancelSelectedWorker?.mutate(item?._id)
                            : mutationCancelSelectedMediator?.mutate(item?._id)
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.recommendationContainer}>
                    {item?.skills?.length > 0 && (
                      <>
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
                      </>
                    )}
                  </View>
                  <View style={styles.recommendationContainer}>
                    <Ionicons name="location" size={14} color="gray" />
                    <CustomText textAlign="left">
                      {item?.address || "Not Available"}
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
    backgroundColor: Colors.white,
    gap: 5,
  },
  workerCard: {
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
    gap: 4,
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

export default SelectedApplicants;
