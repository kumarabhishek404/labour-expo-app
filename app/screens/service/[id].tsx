import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import SERVICE from "../../api/services";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import Requirements from "@/components/commons/Requirements";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import ServiceActionButtons from "./actionButtons";
import MEDIATOR from "@/app/api/mediator";
import {
  generateServiceSummary,
  handleCall,
  speakText,
} from "@/constants/functions";
import ProfilePicture from "@/components/commons/ProfilePicture";
import ButtonComp from "@/components/inputs/Button";
import DateDisplay from "@/components/commons/ShowDate";
import ShowAddress from "@/components/commons/ShowAddress";
import ApplicantsTabScreen from "./showApplicationsAndSelections";
import ApplicantSummary from "./applicantsSummary";
import BookingActionButtons from "../bookings/actionButtons";
import ServicePlaceholder from "@/components/commons/LoadingPlaceholders/ServiceDetailsPlaceholder";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ServiceDetails = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const navigation = useNavigation();
  const locale = useAtomValue(Atoms?.LocaleAtom);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const setAddService = useSetAtom(Atoms?.AddServiceAtom);
  const firstTimeRef = React.useRef(true);
  const { id, showApplicationDetails } = useLocalSearchParams();
  const [service, setService]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isServiceLiked, setIsServiceLiked] = useState(
    service?.likedBy?.find((id: any) => id === userDetails?._id)
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    service?.appliedUsers?.find(
      (user: any) =>
        user?.status === "PENDING" && user?.user === userDetails?._id
    ) || false
  );
  const [isServiceAppliedByMediator, setIsServiceAppliedByMediator] = useState(
    service?.appliedUsers?.find((user: any) =>
      user?.workers?.some(
        (worker: any) =>
          worker?.worker?.toString() === userDetails?._id &&
          worker?.status === "PENDING"
      )
    ) || false
  );
  const [isSelected, setIsSelected] = useState(
    service?.selectedUsers?.find(
      (user: any) =>
        (user?.status === "SELECTED" && user?.user === userDetails?._id) ||
        user?.workers?.some(
          (worker: any) =>
            worker?.worker?.toString() === userDetails?._id &&
            worker?.status === "SELECTED"
        )
    ) || false
  );

  const [isMediatorOrSingleWorker, setIsMediatorOrSingleWorker] = useState(
    service?.selectedUsers?.find(
      (user: any) =>
        user?.status === "SELECTED" && user?.user === userDetails?._id
    ) || false
  );

  const [isWorkerBooked, setIsWorkerBooked] = useState(
    service?.bookedWorker === userDetails?._id
  );

  const [mediatorMobile, setMediatorMobile] = useState(() => {
    const matchedMediator = selectedApplicants?.find((selectedUser: any) =>
      selectedUser?.workers?.some(
        (workerObj: any) => workerObj?._id === userDetails?._id
      )
    );

    return matchedMediator?.user?.mobile;
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [isWorkerSelectModal, setIsWorkerSelectModal] = useState(false);
  const [workers, setWorkers]: any = useState([]);
  const [selectedWorkersIds, setSelectedWorkersIds]: any = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const { refreshUser, isLoading: isRefreshLoading } =
    REFRESH_USER.useRefreshUser();

  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);

  const [isAdmin] = useState(userDetails?.isAdmin);
  const {
    isLoading,
    data: response,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["serviceDetails", id],
    queryFn: async () => await SERVICE?.getServiceById(id),
    retry: false,
    enabled: !!id,
  });

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      Speech.stop();
    });

    const unsubscribeBack = navigation.addListener("beforeRemove", () => {
      Speech.stop();
    });

    return () => {
      unsubscribeBlur();
      unsubscribeBack();
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  const {
    data: appliedUsers,
    isLoading: isAppliedWorkersLoading,
    isRefetching: isAppliedWorkersRefetching,
    isFetchingNextPage: isAppliedWorkersFetchingNextPage,
    fetchNextPage: appliedWorkersFetchPage,
    hasNextPage: hasAppliedWorkersNextPage,
    refetch: refetchAppliedWorkers,
  } = useInfiniteQuery({
    queryKey: ["appliedUsers", service],
    queryFn: ({ pageParam }) => {
      return SERVICE?.fetchMyAppliedWorkers({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id === service?.employer,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: members,
    isLoading: isMemberLoading,
    isFetchingNextPage: isMemberFetchingNextPage,
    fetchNextPage: memberFetchPage,
    hasNextPage: hasMemberNextPage,
  } = useInfiniteQuery({
    queryKey: ["members"],
    queryFn: ({ pageParam }) =>
      MEDIATOR?.fetchAllMembers({
        mediatorId: userDetails?._id,
        pageParam,
        category: "",
      }),
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id !== service?.employer,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: selectedUsers,
    isLoading: isSelectedWorkerLoading,
    isRefetching: isSelectedWorkerRefetching,
    isFetchingNextPage: isSelectedWorkerFetchingNextPage,
    fetchNextPage: selectedWorkersFetchPage,
    hasNextPage: hasSelectedWorkersNextPage,
    refetch: refetchSelectedWorkers,
  } = useInfiniteQuery({
    queryKey: ["selectedUsers", service],
    queryFn: ({ pageParam }) => {
      return SERVICE?.fetchSelectedWorkers({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    // enabled: userDetails?._id === service?.employer,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setWorkers(
        members?.pages.flatMap((page: any) => page.data || [])[0]?.workers
      );
      return () => unsubscribe;
    }, [members])
  );

  useEffect(() => {
    setIsServiceApplied(
      service?.appliedUsers?.find(
        (user: any) =>
          user?.status === "PENDING" && user?.user === userDetails?._id
      ) || false
    );
    setIsServiceAppliedByMediator(
      service?.appliedUsers?.find((user: any) =>
        user?.workers?.some(
          (worker: any) =>
            worker?.worker?.toString() === userDetails?._id &&
            worker?.status === "PENDING"
        )
      ) || false
    );
    setIsServiceLiked(
      service?.likedBy?.find((id: any) => id === userDetails?._id)
    );
    setIsSelected(
      service?.selectedUsers?.find(
        (user: any) =>
          (user?.status === "SELECTED" && user?.user === userDetails?._id) ||
          user?.workers?.some(
            (worker: any) =>
              worker?.worker?.toString() === userDetails?._id &&
              worker?.status === "SELECTED"
          )
      ) || false
    );

    setIsMediatorOrSingleWorker(
      service?.selectedUsers?.find(
        (user: any) =>
          user?.status === "SELECTED" && user?.user === userDetails?._id
      ) || false
    );
    setIsWorkerBooked(service?.bookedWorker === userDetails?._id);

    const matchedMediator = selectedApplicants?.find((selectedUser: any) =>
      selectedUser?.workers?.some(
        (workerObj: any) => workerObj?._id === userDetails?._id
      )
    );

    setMediatorMobile(matchedMediator?.user?.mobile);
  }, [service, selectedApplicants]);

  useFocusEffect(
    React.useCallback(() => {
      let appliedUsers = response?.data?.appliedUsers?.find(
        (mediator: any) => mediator?.user === userDetails?._id
      );

      // Extract worker IDs if the logged-in user is found
      const workerIds = appliedUsers?.workers?.map((id: any) => id) || [];

      setSelectedWorkersIds(workerIds);

      const unsubscribe = setService(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  useEffect(() => {
    // Ensure drawer updates dynamically
    setDrawerState((prevState: any) => ({
      ...prevState,
      content: () => (
        <ApplicantsTabScreen
          applicants={applicants}
          selectedApplicants={selectedApplicants}
          serviceId={service?._id}
          isSelectedWorkerLoading={
            isSelectedWorkerLoading || isSelectedWorkerRefetching
          }
          isSelectedWorkerFetchingNextPage={isSelectedWorkerFetchingNextPage}
          isAppliedWorkersLoading={
            isAppliedWorkersLoading || isAppliedWorkersRefetching
          }
          isAppliedWorkersFetchingNextPage={isAppliedWorkersFetchingNextPage}
          refetchAppliedWorkers={refetchAppliedWorkers}
          refetchSelectedWorkers={refetchSelectedWorkers}
          refetch={refetch}
        />
      ),
    }));
  }, [
    applicants,
    selectedApplicants,
    isSelectedWorkerLoading,
    isSelectedWorkerRefetching,
    isAppliedWorkersLoading,
    isAppliedWorkersRefetching,
  ]);

  useEffect(() => {
    const workers = selectedUsers?.pages[0]?.data || [];
    setSelectedApplicants([...workers]);
  }, [selectedUsers?.pages]);

  useEffect(() => {
    const workers = appliedUsers?.pages[0]?.data || [];
    setApplicants([...workers]);
  }, [appliedUsers?.pages]);

  const handleSpeakAboutSerivceDetails = () => {
    const textToSpeak = generateServiceSummary(
      service,
      locale?.language,
      userDetails?.location
    );

    speakText(textToSpeak, locale?.language, setIsSpeaking);
  };

  const handleCloseSpeakers = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleShowApplications = () => {
    setDrawerState((prevState: any) => ({
      ...prevState,
      visible: true,
      title: "showApplicationsDetails",
      content: () => (
        <ApplicantsTabScreen
          applicants={applicants}
          selectedApplicants={selectedApplicants}
          serviceId={service?._id}
          isSelectedWorkerLoading={
            isSelectedWorkerLoading || isSelectedWorkerRefetching
          }
          isSelectedWorkerFetchingNextPage={isSelectedWorkerFetchingNextPage}
          isAppliedWorkersLoading={
            isAppliedWorkersLoading || isAppliedWorkersRefetching
          }
          isAppliedWorkersFetchingNextPage={isAppliedWorkersFetchingNextPage}
          refetchAppliedWorkers={refetchAppliedWorkers}
          refetchSelectedWorkers={refetchSelectedWorkers}
          refetch={refetch}
        />
      ),
    }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={
                service?.bookingType === "byService"
                  ? "serviceDetails"
                  : "bookingDetails"
              }
              left="back"
              right="notification"
            />
          ),
        }}
      />

      {isLoading ? (
        <ServicePlaceholder />
      ) : (
        <>
          <ScrollView style={styles.container}>
            <Animated.ScrollView
              ref={scrollRef}
              contentContainerStyle={{ paddingBottom: 150 }}
            >
              <ImageSlider images={service?.images} />
              {(service?.employer === userDetails?._id || isAdmin) &&
                service?.bookingType === "byService" && (
                  <ApplicantSummary
                    appliedCount={applicants?.length}
                    selectedCount={selectedApplicants?.length}
                    onShowDetails={handleShowApplications}
                    isLoading={
                      isAppliedWorkersLoading ||
                      isAppliedWorkersRefetching ||
                      isSelectedWorkerLoading ||
                      isSelectedWorkerRefetching
                    }
                  />
                )}
              <View style={styles.contentWrapper}>
                {service?.bookedWorker &&
                  userDetails?._id === service?.employer && (
                    <>
                      <CustomHeading
                        textAlign="left"
                        baseFont={20}
                        color={Colors?.tertieryButton}
                        style={{ marginBottom: 10 }}
                      >
                        {t("bookedWorker")}
                      </CustomHeading>
                      <View style={styles.workerCard}>
                        <View style={styles.productCard}>
                          <ProfilePicture
                            uri={service?.bookedWorker?.profilePicture}
                            style={{ marginRight: 10 }}
                          />
                          <View style={styles.productInfo}>
                            <View style={styles?.titleContainer}>
                              <CustomHeading baseFont={22}>
                                {service?.bookedWorker?.name}
                              </CustomHeading>
                            </View>
                            <ShowAddress
                              address={service?.bookedWorker?.address}
                            />
                          </View>
                          <View
                            style={{
                              alignContent: "flex-end",
                              justifyContent: "flex-start",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                router?.push({
                                  pathname: "/screens/users/[id]",
                                  params: {
                                    id: service?.bookedWorker?._id,
                                    role: "workers",
                                    title: "workerDetails",
                                    type: "applicant",
                                  },
                                })
                              }
                            >
                              <CustomText
                                fontWeight="bold"
                                color={Colors?.link}
                              >
                                {t("workerDetails")}
                              </CustomText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </>
                  )}

                {service?.status === "CANCELLED" && (
                  <View style={styles?.cancelledService}>
                    <View style={{ width: "100%" }}>
                      <CustomHeading color={Colors?.white} textAlign="left">
                        {t("thisServiceIsCancelled")}
                      </CustomHeading>
                      <CustomText textAlign="left" color={Colors?.white}>
                        {t("apologyForInconvenience")}
                      </CustomText>
                    </View>
                  </View>
                )}

                {service?.status === "COMPLETED" && (
                  <View style={styles?.selectedWrapper}>
                    <View style={{ width: "100%" }}>
                      <CustomHeading color={Colors?.white} textAlign="left">
                        {t("thisServiceIsCompleted")}
                      </CustomHeading>
                      <CustomText textAlign="left" color={Colors?.white}>
                        {t("thankYouForUsingOurService")}
                      </CustomText>
                    </View>
                  </View>
                )}

                {isSelected && service?.status !== "CANCELLED" && (
                  <View style={styles?.selectedWrapper}>
                    <CustomHeading color={Colors?.white} textAlign="left">
                      {t("youAreSelected")}
                    </CustomHeading>
                    <CustomText
                      textAlign="left"
                      color={Colors?.white}
                      style={{ marginBottom: 10 }}
                    >
                      {t("doYourBest")}
                    </CustomText>
                    <View style={{ gap: 20 }}>
                      {isMediatorOrSingleWorker && (
                        <ButtonComp
                          isPrimary={true}
                          title={t("callEmployer")}
                          onPress={() => handleCall(service?.employer?.mobile)}
                          icon={
                            <FontAwesome5
                              name="phone-alt"
                              size={16}
                              color={Colors.white}
                              style={{ marginRight: 10 }}
                            />
                          }
                        />
                      )}
                      <ButtonComp
                        isPrimary={true}
                        title={t("showYourAttendance")}
                        onPress={() =>
                          router?.push({
                            pathname: "/screens/bookings/showAttendance",
                            params: {
                              bookingDetails: JSON.stringify(service),
                            },
                          })
                        }
                        bgColor={Colors?.tertieryButton}
                        borderColor={Colors?.tertieryButton}
                        style={{ flex: 1, paddingVertical: 6 }}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.headingWrapper}>
                  <CustomHeading
                    textAlign="left"
                    baseFont={20}
                    color={Colors?.black}
                  >
                    {t("serviceDetails")}
                  </CustomHeading>
                  <TouchableOpacity
                    onPress={
                      isSpeaking
                        ? handleCloseSpeakers
                        : handleSpeakAboutSerivceDetails
                    }
                    style={[
                      styles?.leftTag,
                      {
                        backgroundColor: isSpeaking
                          ? Colors?.danger
                          : Colors?.success,
                      },
                    ]}
                  >
                    <CustomText color={Colors?.white} fontWeight="bold">
                      📢{" "}
                      {isSpeaking
                        ? t("speakingAndClose")
                        : t("listenAboutService")}
                    </CustomText>
                  </TouchableOpacity>
                </View>

                <CustomHeading baseFont={18} textAlign="left">
                  {t(service?.type)} - {t(service?.subType)}
                </CustomHeading>
                <View style={styles.listingLocationWrapper}>
                  <ShowAddress address={service?.address} />
                </View>

                <View style={styles.listingLocationWrapper}>
                  <DateDisplay date={service?.startDate} type="startDate" />
                </View>

                <Highlights service={service} />

                {service?.description && (
                  <View style={{ marginVertical: 10 }}>
                    <CustomHeading
                      textAlign="left"
                      baseFont={18}
                      color={Colors?.inputLabel}
                    >
                      {t("description")}
                    </CustomHeading>
                    <CustomText textAlign="left" baseFont={16}>
                      {service?.description}
                    </CustomText>
                  </View>
                )}

                {service && service?.requirements?.length > 0 && (
                  <Requirements
                    type="full"
                    requirements={service?.requirements}
                  />
                )}
              </View>

              {service?.employer?._id &&
                service?.employer?._id !== userDetails?._id && (
                  <EmployerCard employer={service?.employer} />
                )}
            </Animated.ScrollView>
          </ScrollView>

          {service?.bookingType === "byService" &&
            !isFetching &&
            !isLoading && (
              <ServiceActionButtons
                service={service}
                members={workers}
                mediatorMobile={mediatorMobile}
                isSelectedWorkerLoading={isSelectedWorkerLoading}
                isMemberLoading={isMemberLoading}
                isMemberFetchingNextPage={isMemberFetchingNextPage}
                userDetails={userDetails}
                isAdmin={isAdmin}
                isSelected={isSelected}
                isMediatorOrSingleWorker={isMediatorOrSingleWorker}
                isWorkerBooked={isWorkerBooked}
                isServiceApplied={isServiceApplied}
                isServiceAppliedByMediator={isServiceAppliedByMediator}
                isServiceLiked={isServiceLiked}
                id={id as string}
                refetch={refetch}
                refreshUser={refreshUser}
                selectedWorkersIds={selectedWorkersIds}
                setSelectedWorkersIds={setSelectedWorkersIds}
                setIsWorkerSelectModal={setIsWorkerSelectModal}
                setModalVisible={setModalVisible}
                setIsCompleteModalVisible={setIsCompleteModalVisible}
                hasMemberNextPage={hasMemberNextPage}
                memberFetchPage={memberFetchPage}
                setAddService={setAddService}
                isCompleteModalVisible={isCompleteModalVisible}
                modalVisible={modalVisible}
                isWorkerSelectModal={isWorkerSelectModal}
              />
            )}

          {service?.bookingType === "direct" && (
            <BookingActionButtons
              category={"booking"}
              booking={service}
              userDetails={userDetails}
              isAdmin={isAdmin}
              id={id as string}
              refetch={refetch}
              refreshUser={refreshUser}
              setModalVisible={setModalVisible}
              setIsCompleteModalVisible={setIsCompleteModalVisible}
              isCompleteModalVisible={isCompleteModalVisible}
              modalVisible={modalVisible}
            />
          )}
        </>
      )}
    </>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  selectedWrapper: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors?.success,
  },
  cancelledService: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors?.danger,
  },
  editContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  listingLocationWrapper: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "flex-start",
    gap: 5,
  },
  listingLocationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.black,
  },

  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    borderColor: Colors.black,
    alignItems: "center",
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    marginRight: 20,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  deleteBtn: {
    width: "48%",
    backgroundColor: Colors?.danger,
    borderColor: Colors?.danger,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  completeBtn: {
    width: "48%",
    backgroundColor: Colors?.primary,
    borderColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#FFD700", // Yellow circle
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    // padding: 20,
    // width: "90%",
    // maxHeight: "80%",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
    // marginVertical: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userSkills: {
    fontSize: 14,
    color: "#555",
  },
  userAddress: {
    fontSize: 12,
    color: "#888",
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  workerCard: {
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: Colors?.white,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 8,
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
  leftTag: {
    backgroundColor: Colors?.tertiery,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
