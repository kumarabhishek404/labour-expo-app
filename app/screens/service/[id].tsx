import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import SERVICE from "../../api/services";
import Loader from "@/components/commons/Loaders/Loader";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import Button from "@/components/inputs/Button";
import moment from "moment";
import Applicants from "@/components/commons/Applicants";
import SelectedApplicants from "@/components/commons/SelectedApplicants";
import Requirements from "@/components/commons/Requirements";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import ServiceActionButtons from "./actionButtons";
import MEDIATOR from "@/app/api/mediator";
import { handleCall } from "@/constants/functions";
import ProfilePicture from "@/components/commons/ProfilePicture";
import ButtonComp from "@/components/inputs/Button";
import ShowSkills from "@/components/commons/ShowSkills";
import DateDisplay from "@/components/commons/ShowDate";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ServiceDetails = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const setAddService = useSetAtom(Atoms?.AddServiceAtom);
  const firstTimeRef = React.useRef(true);
  const { id } = useLocalSearchParams();
  const [service, setService]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isServiceLiked, setIsServiceLiked] = useState(
    service?.likedBy?.find((id: any) => id === userDetails?._id)
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    service?.appliedUsers?.find(
      (user: any) =>
        (user?.status === "PENDING" && user?.user === userDetails?._id) ||
        user?.workers?.includes(userDetails?._id)
    ) || false
  );
  const [isSelected, setIsSelected] = useState(
    service?.selectedUsers?.find(
      (user: any) =>
        (user?.status === "SELECTED" && user?.user === userDetails?._id) ||
        user?.workers.includes(userDetails?._id)
    ) || false
  );
  const [isWorkerBooked, setIsWorkerBooked] = useState(
    service?.bookedWorker === userDetails?._id
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const [isWorkerSelectModal, setIsWorkerSelectModal] = useState(false);
  const [workers, setWorkers]: any = useState([]);
  const [selectedWorkersIds, setSelectedWorkersIds]: any = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const { refreshUser, isLoading: isRefreshLoading } =
    REFRESH_USER.useRefreshUser();

  const [isAdmin] = useState(userDetails?.isAdmin);
  const {
    isLoading,
    data: response,
    refetch,
  } = useQuery({
    queryKey: ["serviceDetails", id],
    queryFn: async () => await SERVICE?.getServiceById(id),
    retry: false,
    enabled: !!id,
  });

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
    enabled: userDetails?._id === service?.employer,
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
          (user?.status === "PENDING" && user?.user === userDetails?._id) ||
          user?.workers?.includes(userDetails?._id)
      ) || false
    );
    setIsServiceLiked(
      service?.likedBy?.find((id: any) => id === userDetails?._id)
    );
    setIsSelected(
      service?.selectedUsers?.find(
        (user: any) =>
          (user?.status === "SELECTED" && user?.user === userDetails?._id) ||
          user?.workers?.includes(userDetails?._id)
      ) || false
    );
    setIsWorkerBooked(service?.bookedWorker === userDetails?._id);
  }, [service]);

  useFocusEffect(
    React.useCallback(() => {
      // Filter appliedUsers to find the logged-in user's entry
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
    const workers = selectedUsers?.pages[0]?.data || [];
    setSelectedApplicants([...workers]);
  }, [selectedUsers?.pages]);

  useEffect(() => {
    const workers = appliedUsers?.pages[0]?.data || [];
    setApplicants([...workers]);
  }, [appliedUsers?.pages]);

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

      <Loader loading={isLoading} />

      <ScrollView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <ImageSlider images={service?.images} />

          <View style={styles.contentWrapper}>
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

            <CustomHeading baseFont={18} textAlign="left">
              {t(service?.type)} - {t(service?.subType)}
            </CustomHeading>
            <CustomHeading baseFont={18} textAlign="left">
              {t("serviceType")}
              {" - "}
              <CustomText
                color={Colors?.tertieryButton}
                fontWeight="600"
                baseFont={20}
              >
                {t(service?.bookingType)}
              </CustomText>
            </CustomHeading>
            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText textAlign="left">{service?.address}</CustomText>
            </View>

            <View style={styles.listingLocationWrapper}>
              <Entypo
                name="calendar"
                size={14}
                color={Colors.primary}
                style={{ alignSelf: "center" }}
              />
              <DateDisplay date={service?.startDate} />
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
              <Requirements type="full" requirements={service?.requirements} />
            )}

            {service?.bookedWorker && (
              <View style={styles.workerCard}>
                <View style={styles.productCard}>
                  <ProfilePicture uri={service?.bookedWorker?.profilePicture} />
                  <View style={styles.productInfo}>
                    <View style={styles?.titleContainer}>
                      <CustomHeading baseFont={14}>
                        {service?.bookedWorker?.name}
                      </CustomHeading>
                    </View>
                    <ShowSkills
                      userSkills={service?.bookedWorker?.skills}
                      tagStyle={{ backgroundColor: Colors?.darkGray }}
                    />
                    <View style={styles.recommendationContainer}>
                      <Ionicons name="location" size={14} color="gray" />
                      <CustomText textAlign="left">
                        {service?.bookedWorker?.address || "Not Available"}
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
                            id: service?.bookedWorker?._id,
                            role: "workers",
                            type: "applicant",
                          },
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Selected Applicants */}
          {(service?.employer === userDetails?._id || isAdmin) && (
            <View style={styles.applicantContainer}>
              <CustomHeading textAlign="left">
                {t("whoHaveSelected")}
              </CustomHeading>
              {selectedApplicants.length > 0 ? (
                <SelectedApplicants
                  selectedApplicants={selectedApplicants}
                  serviceId={service?._id}
                  refetchSelectedApplicants={() => {
                    refetchSelectedWorkers();
                  }}
                  refetch={refetch}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  {isSelectedWorkerLoading ||
                  isSelectedWorkerFetchingNextPage ? (
                    <ActivityIndicator
                      style={{ marginLeft: 10, paddingVertical: 60 }}
                      color={Colors?.primary}
                      animating={true}
                    />
                  ) : (
                    <EmptyDatePlaceholder
                      parentHeight={450}
                      title="selectedApplicants"
                    />
                  )}
                </View>
              )}
            </View>
          )}

          {/* Applicants */}
          {(service?.employer === userDetails?._id || isAdmin) && (
            <View style={styles.applicantContainer}>
              <CustomHeading textAlign="left">
                {t("whoHaveApplied")}
              </CustomHeading>
              {applicants.length > 0 ? (
                <Applicants
                  applicants={applicants}
                  serviceId={service?._id}
                  refetchApplicants={() => {
                    refetchAppliedWorkers();
                  }}
                  refetchSelectedApplicants={() => {
                    refetchSelectedWorkers();
                  }}
                  refetch={refetch}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  {isAppliedWorkersLoading ||
                  isAppliedWorkersFetchingNextPage ? (
                    <ActivityIndicator
                      style={{ marginLeft: 10, paddingVertical: 60 }}
                      color={Colors?.primary}
                      animating={true}
                    />
                  ) : (
                    <EmptyDatePlaceholder
                      parentHeight={450}
                      title="applicants"
                    />
                  )}
                </View>
              )}
            </View>
          )}

          {/* First Make Google Maps API Key Then Uncomment It */}
          {/* {service?.location && service?.location?.latitude && (
            <Map
              data={{
                ...service?.location,
                latitudeDelta: 2,
                longitudeDelta: 2,
              }}
            />
          )} */}

          {service?.employer?._id &&
            service?.employer?._id !== userDetails?._id && (
              <EmployerCard employer={service?.employer} />
            )}
        </Animated.ScrollView>
      </ScrollView>

      <ServiceActionButtons
        service={service}
        members={workers}
        isMemberLoading={isMemberLoading}
        isMemberFetchingNextPage={isMemberFetchingNextPage}
        userDetails={userDetails}
        isAdmin={isAdmin}
        isSelected={isSelected}
        isWorkerBooked={isWorkerBooked}
        isServiceApplied={isServiceApplied}
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
  applicantContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    gap: 5,
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
  workerCard: {
    borderRadius: 8,
    marginBottom: 5,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    // borderColor: Colors?.secondary,
    // borderWidth: 1,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: Colors?.white,
    padding: 8,
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
});
