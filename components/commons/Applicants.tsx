import Colors from "@/constants/Colors";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
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
import EmptyDataPlaceholder from "./EmptyDataPlaceholder";
import ShowAddress from "./ShowAddress";
import { handleCall } from "@/constants/functions";
import ShowDistance from "./ShowDistance";
import { useAtomValue } from "jotai";
import { getDynamicWorkerType } from "@/utils/i18n";
import Atoms from "@/app/AtomStore";

interface ApplicantsProps {
  type?: string;
  title: string;
  applicants: any;
  serviceId: string;
  isAppliedWorkersLoading: boolean;
  isAppliedWorkersFetchingNextPage: boolean;
  refetchApplicants: any;
  refetchSelectedApplicants: any;
  refetch: any;
}

const Applicants = ({
  type,
  title,
  applicants,
  serviceId,
  isAppliedWorkersLoading,
  isAppliedWorkersFetchingNextPage,
  refetchApplicants,
  refetchSelectedApplicants,
  refetch,
}: ApplicantsProps) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

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
          mutationSelectWorker?.isPending ||
          mutationRejectWorker?.isPending ||
          mutationCancelSelectedWorker?.isPending
        }
      />
      <View style={styles.applicantWrapper}>
        {applicants && applicants?.length > 0 ? (
          <View style={styles.applicantContainer}>
            {applicants?.map((item: any, index: number) => {
              const appliedUser = item?.user;
              const workers = item?.workers;
              return (
                <View key={index} style={styles.mediatorCard}>
                  <View style={styles.productCard}>
                    <ProfilePicture uri={appliedUser?.profilePicture} />

                    <View style={styles.productInfo}>
                      <View style={styles.titleContainer}>
                        <CustomHeading baseFont={18} textAlign="left">
                          {appliedUser?.name}
                        </CustomHeading>
                        <CustomHeading
                          textAlign="left"
                          color={Colors?.tertieryButton}
                          style={{ textTransform: "uppercase" }}
                        >
                          {workers && workers?.length > 0
                            ? t("mediator")
                            : getDynamicWorkerType(
                                appliedUser?.appliedSkill,
                                1
                              ) ?? t("worker")}
                        </CustomHeading>
                        <ShowDistance
                          loggedInUserLocation={userDetails?.location}
                          targetLocation={userDetails?.location}
                          align="left"
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() =>
                        router?.push({
                          pathname: "/screens/users/[id]",
                          params: {
                            id: appliedUser?._id,
                            title:
                              workers?.length > 0
                                ? "mediatorDetails"
                                : "workerDetails",
                          },
                        })
                      }
                    >
                      <CustomText fontWeight="600" color={Colors?.link}>
                        {t(
                          workers?.length > 0
                            ? "mediatorDetails"
                            : "workerDetails"
                        )}
                      </CustomText>
                    </TouchableOpacity>
                  </View>

                  {workers?.length > 0 && (
                    <View style={styles.workersContainer}>
                      <TouchableOpacity
                        style={[
                          styles.workersTitleContainer,
                          expandedItem !== item._id && {
                            borderBottomWidth: 1,
                            borderBottomColor: "#ddd",
                          },
                        ]}
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
                              <View style={styles.productCard}>
                                <ProfilePicture uri={worker?.profilePicture} />
                                <View style={styles.productInfo}>
                                  <View style={styles.titleContainer}>
                                    <CustomHeading
                                      baseFont={18}
                                      textAlign="left"
                                    >
                                      {worker?.name}
                                    </CustomHeading>
                                    <CustomHeading
                                      textAlign="left"
                                      color={Colors?.tertieryButton}
                                      style={{ textTransform: "uppercase" }}
                                    >
                                      {getDynamicWorkerType(
                                        worker?.appliedSkill,
                                        1
                                      ) ?? t("worker")}
                                    </CustomHeading>
                                    <ShowDistance
                                      loggedInUserLocation={
                                        userDetails?.location
                                      }
                                      targetLocation={userDetails?.location}
                                      align="left"
                                    />
                                  </View>
                                </View>
                                <TouchableOpacity
                                  style={styles.detailsButton}
                                  onPress={() =>
                                    router?.push({
                                      pathname: "/screens/users/[id]",
                                      params: {
                                        id: worker?._id,
                                        title:
                                          workers?.length > 0
                                            ? "mediatorDetails"
                                            : "workerDetails",
                                      },
                                    })
                                  }
                                >
                                  <CustomText
                                    fontWeight="600"
                                    color={Colors?.link}
                                  >
                                    {t("workerDetails")}
                                  </CustomText>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </Animated.View>
                      )}
                    </View>
                  )}

                  {type === "selectedApplicants" ? (
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
                        title={t("remove")}
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
                  ) : (
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
                        onPress={() =>
                          mutationRejectWorker?.mutate(appliedUser?._id)
                        }
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
                        title={t("select")}
                        onPress={() =>
                          mutationSelectWorker?.mutate(appliedUser?._id)
                        }
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            {isAppliedWorkersLoading || isAppliedWorkersFetchingNextPage ? (
              <ActivityIndicator
                style={{ marginLeft: 10, paddingVertical: 60 }}
                color={Colors?.primary}
                animating={true}
              />
            ) : (
              <EmptyDataPlaceholder
                parentHeight={450}
                title={
                  type === "selectedApplicants"
                    ? "selectedApplicants"
                    : "applicants"
                }
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  applicantWrapper: {},
  applicantContainer: {
    gap: 5,
  },

  mediatorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: Colors?.fourth,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 1,
  },
  productCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    marginBottom: 4,
  },
  detailsButton: {
    alignSelf: "flex-start",
  },
  workersContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors?.inputBorder,
    borderRadius: 8,
  },
  workersTitleContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workersTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  workersTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  workersGrid: {
    // marginTop: 8,
  },
  workerItem: {
    backgroundColor: Colors?.white,
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 4,
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  workerDetails: {
    flex: 1,
    marginLeft: 10,
  },
  workerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workerName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  rejectButton: {
    minHeight: 30,
    width: "30%",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  acceptButton: {
    minHeight: 30,
    width: "40%",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 14,
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
  emptyContainer: {
    // marginBottom: 20,
    // paddingHorizontal: 10,
    // paddingVertical: 20,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: Colors.gray,
    // backgroundColor: Colors.white,
  },
});

export default Applicants;
