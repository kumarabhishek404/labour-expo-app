import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { handleCall } from "@/constants/functions";
import ProfilePicture from "@/components/commons/ProfilePicture";
import CustomHeading from "@/components/commons/CustomHeading";
import ShowSkills from "@/components/commons/ShowSkills";
import CustomText from "@/components/commons/CustomText";
import ButtonComp from "@/components/inputs/Button";
import { t } from "@/utils/translationHelper";
import Loader from "@/components/commons/Loaders/Loader";
import { useMutation } from "@tanstack/react-query";
import EMPLOYER from "@/app/api/employer";
import TOAST from "@/app/hooks/toast";

interface SelectedApplicantsProps {
  selectedApplicants: any;
  bookingId?: string;
  bookingType: string;
  refetch: any;
}

const SelectedUsers = ({
  selectedApplicants,
  bookingId,
  bookingType,
  refetch,
}: SelectedApplicantsProps) => {
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

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker"],
    mutationFn: (payload: any) => EMPLOYER?.removeBookedWorker(payload),
    onSuccess: (response) => {
      refetch();
      TOAST?.success(t("removedBookedWorkerSuccessfully"));
      console.log("Response while removing booked worker - ", response);
    },
  });

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
      <Loader loading={mutationRemoveBookedWorker?.isPending} />
      <View style={styles.applicantContainer}>
        {selectedApplicants?.map((mediator: any, index: number) => {
          const appliedUser = mediator?.name ? mediator : mediator?.user;
          const workers = mediator?.workers;
          return (
            <View key={index} style={styles.workerCard}>
              <View style={styles.productCard}>
                <ProfilePicture uri={appliedUser?.profilePicture} />
                <View style={styles.productInfo}>
                  <View style={styles?.titleContainer}>
                    <CustomHeading baseFont={14}>
                      {appliedUser?.name}
                    </CustomHeading>
                  </View>
                  <ShowSkills
                    userSkills={appliedUser?.skills}
                    tagStyle={{ backgroundColor: Colors?.darkGray }}
                  />
                  <View style={styles.recommendationContainer}>
                    <Ionicons name="location" size={14} color="gray" />
                    <CustomText textAlign="left">
                      {appliedUser?.address || "Not Available"}
                    </CustomText>
                  </View>
                </View>
                <View
                  style={{
                    alignContent: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  <ButtonComp
                    style={{
                      minHeight: 20,
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                      marginTop: 6,
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

              {workers?.length > 0 && (
                <View style={styles.workersContainer}>
                  <TouchableOpacity
                    style={styles.workersTitleContainer}
                    onPress={() => toggleAccordion(mediator._id)}
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
                              animatedHeights.current[mediator._id] ||
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

                  {expandedItems[mediator._id] && (
                    <Animated.View
                      style={[
                        styles.workersGrid,
                        {
                          opacity:
                            animatedHeights.current[mediator._id] ||
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
                            <ShowSkills userSkills={worker?.skills} />
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
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {bookingType === "byService" && (
                  <ButtonComp
                    style={{
                      minHeight: 35,
                      width: "60%",
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                    }}
                    bgColor={Colors?.danger}
                    borderColor={Colors?.danger}
                    textStyle={{
                      fontSize: 16,
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
                    title={t("removeBookedWorker")}
                    onPress={() =>
                      mutationRemoveBookedWorker?.mutate({
                        serviceId: bookingId,
                        userId: appliedUser?._id,
                      })
                    }
                  />
                )}
                <ButtonComp
                  style={{
                    minHeight: 35,
                    width: "25%",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                  }}
                  bgColor={Colors?.success}
                  borderColor={Colors?.success}
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
                  onPress={() => handleCall(appliedUser?.mobile)}
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
  applicantContainer: {
    gap: 5,
    backgroundColor: Colors?.background,
  },
  workerCard: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    borderColor: Colors?.secondary,
    borderWidth: 1,
  },
  productCard: {
    flexDirection: "row",
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
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

export default SelectedUsers;
