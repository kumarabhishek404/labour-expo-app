import Colors from "@/constants/Colors";
import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "./Loaders/Loader";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import ProfilePicture from "./ProfilePicture";
import { t } from "@/utils/translationHelper";
import { handleCall } from "@/constants/functions";
import EMPLOYER from "@/app/api/employer";
import ShowSkills from "./ShowSkills";
import EmptyDataPlaceholder from "./EmptyDataPlaceholder";
import ShowAddress from "./ShowAddress";

interface SelectedApplicantsProps {
  title: string;
  selectedApplicants: any;
  serviceId: string;
  isSelectedWorkerLoading: boolean;
  isSelectedWorkerFetchingNextPage: boolean;
  refetchSelectedApplicants: any;
  refetch: any;
}

const SelectedApplicants = ({
  title,
  selectedApplicants,
  serviceId,
  isSelectedWorkerLoading,
  isSelectedWorkerFetchingNextPage,
  refetchSelectedApplicants,
  refetch,
}: SelectedApplicantsProps) => {
  const mutationCancelSelectedWorker = useMutation({
    mutationKey: ["cancelSelectedWorker", { serviceId }],
    mutationFn: (userId) =>
      EMPLOYER?.cancelSelectedWorker({ serviceId: serviceId, userId: userId }),
    onSuccess: (response) => {
      refetchSelectedApplicants();
      refetch();
      TOAST?.success(t("cancelSelectedWorkerSuccess"));
      console.log("Response while cancelling an selected worker - ", response);
    },
    onError: (err) => {
      console.error("error while cancelling an selected worker ", err);
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
      <Loader loading={mutationCancelSelectedWorker?.isPending} />
      <View style={styles.applicantWrapper}>
        <CustomHeading textAlign="left">{t(title)}</CustomHeading>
        {selectedApplicants && selectedApplicants?.length > 0 ? (
          <View style={styles.applicantContainer}>
            {selectedApplicants?.map((item: any, index: number) => {
              const appliedUser = item?.user;
              const workers = item?.workers;
              return (
                <View key={index} style={styles.workerCard}>
                  <View style={styles.productCard}>
                    <ProfilePicture uri={appliedUser?.profilePicture} />
                    <View style={styles.productInfo}>
                      <View style={styles?.titleContainer}>
                        <CustomHeading baseFont={18}>
                          {appliedUser?.name}
                        </CustomHeading>
                      </View>
                      <ShowSkills
                        type="small"
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
                      <Button
                        style={{
                          minHeight: 20,
                          paddingVertical: 4,
                          paddingHorizontal: 10,
                        }}
                        textStyle={{
                          fontSize: 14,
                        }}
                        isPrimary={false}
                        title={t("details")}
                        onPress={() =>
                          router?.push({
                            pathname: "/screens/users/[id]",
                            params: {
                              id: appliedUser?._id,
                              title: "workerDetails",
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
                            {t("associatedWorkers", { count: workers?.length })}
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
                          {workers?.map((worker: any, workerIndex: number) => (
                            <View key={workerIndex} style={styles.workerItem}>
                              <View style={styles.workerInfo}>
                                <ProfilePicture uri={worker?.profilePicture} />
                                <View style={{ flex: 1 }}>
                                  <CustomText
                                    style={styles.workerName}
                                    fontWeight="bold"
                                    textAlign="left"
                                    baseFont={18}
                                  >
                                    {worker?.name}
                                  </CustomText>
                                  <ShowAddress address={worker?.address} />
                                </View>
                              </View>
                              <ShowSkills
                                type="small"
                                userSkills={worker?.skills}
                              />
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
                    <Button
                      style={{
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
                      title="Remove"
                      onPress={() =>
                        mutationCancelSelectedWorker?.mutate(appliedUser?._id)
                      }
                    />
                    <Button
                      style={{
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
                        <FontAwesome
                          name="phone"
                          size={16}
                          color="white"
                          style={{ marginRight: 6 }}
                        />
                      }
                      isPrimary={true}
                      title={
                        workers && workers?.length > 0
                          ? t("callMediator")
                          : t("callWorker")
                      }
                      onPress={() => handleCall(appliedUser?.mobile)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            {isSelectedWorkerLoading || isSelectedWorkerFetchingNextPage ? (
              <ActivityIndicator
                style={{ marginLeft: 10, paddingVertical: 60 }}
                color={Colors?.primary}
                animating={true}
              />
            ) : (
              <EmptyDataPlaceholder
                parentHeight={450}
                title="selectedApplicants"
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  applicantWrapper: {
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    gap: 5,
    marginBottom: 20,
  },
  applicantList: {
    display: "flex",
  },
  applicantContainer: {
    gap: 5,
  },
  workerCard: {
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
    flexDirection: "column",
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  workerName: {
    color: "#2c3e50",
  },
  emptyContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
  },
});

export default SelectedApplicants;
