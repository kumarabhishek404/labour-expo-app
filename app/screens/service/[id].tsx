import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Map from "@/components/commons/ViewMap";
import {
  fetchMyAppliedWorkers,
  fetchMyAppliedMediators,
  getServiceById,
  fetchSelectedWorkers,
  fetchSelectedMediators,
} from "../../api/services";
import Loader from "@/components/commons/Loader";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { AddServiceAtom, UserAtom } from "../../AtomStore/user";
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
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import ServiceActionButtons from "./actionButtons";
import { fetchAllMembers } from "@/app/api/mediator";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

interface ImageAsset {
  uri: string;
}

const ServiceDetails = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const setAddService = useSetAtom(AddServiceAtom);
  const { id } = useLocalSearchParams();
  const [service, setService]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isServiceLiked, setIsServiceLiked] = useState(
    service?.likedBy?.find((liked: any) => liked?._id === userDetails?._id)
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    userDetails?.role === "MEDIATOR"
      ? service?.appliedMediators?.find(
          (mediator: any) => mediator?.mediator?._id === userDetails?._id
        )
      : service?.appliedWorkers?.find(
          (worker: any) => worker?._id === userDetails?._id
        ) || false
  );
  const [isSelected, setIsSelected] = useState(
    userDetails?.role === "MEDIATOR"
      ? service?.selectedMediators?.find(
          (mediator: any) => mediator?.mediator?._id === userDetails?._id
        )
      : service?.selectedWorkers?.find(
          (worker: any) => worker?._id === userDetails?._id
        ) || false
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const [isWorkerSelectModal, setIsWorkerSelectModal] = useState(false);
  const [workers, setWorkers]: any = useState([]);
  const [selectedWorkersIds, setSelectedWorkersIds]: any = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const { refreshUser, isLoading: isRefreshLoading } = useRefreshUser();

  const [isAdmin] = useState(userDetails?.role === "ADMIN");

  // console.log("User ID --", userDetails?._id, service?.employer);
  const {
    isLoading,
    isError,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["serviceDetails"],
    queryFn: async () => await getServiceById(id),
    retry: false,
    enabled: !!id,
  });

  const {
    data: appliedWorkers,
    isLoading: isAppliedWorkersLoading,
    isFetchingNextPage: isAppliedWorkersFetchingNextPage,
    fetchNextPage: appliedWorkersFetchPage,
    hasNextPage: hasAppliedWorkersNextPage,
    refetch: refetchAppliedWorkers,
  } = useInfiniteQuery({
    queryKey: ["appliedWorkers", service],
    queryFn: ({ pageParam }) => {
      return fetchMyAppliedWorkers({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id === service?.employer?._id || isAdmin,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: appliedMediators,
    isLoading: isAppliedMediatorsLoading,
    isFetchingNextPage: isAppliedMediatorsFetchingNextPage,
    fetchNextPage: appliedMediatorsFetchPage,
    hasNextPage: hasAppliedMediatorsNextPage,
    refetch: refetchAppliedMediators,
  } = useInfiniteQuery({
    queryKey: ["appliedMediators", service],
    queryFn: ({ pageParam }) => {
      return fetchMyAppliedMediators({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id === service?.employer?._id || isAdmin,
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
      fetchAllMembers({
        mediatorID: userDetails?._id,
        pageParam,
      }),
    retry: false,
    initialPageParam: 1,
    enabled:
      userDetails?.role === "MEDIATOR" &&
      userDetails?._id !== service?.employer?._id,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: selectedWorkers,
    isLoading: isSelectedWorkerLoading,
    isFetchingNextPage: isSelectedWorkerFetchingNextPage,
    fetchNextPage: selectedWorkersFetchPage,
    hasNextPage: hasSelectedWorkersNextPage,
    refetch: refetchSelectedWorkers,
  } = useInfiniteQuery({
    queryKey: ["selectedWorkers", service],
    queryFn: ({ pageParam }) => {
      return fetchSelectedWorkers({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id === service?.employer?._id || isAdmin,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: selectedMediators,
    isLoading: isSelectedMediatorLoading,
    isFetchingNextPage: isSelectedMediatorFetchingNextPage,
    fetchNextPage: selectedMediatorsFetchPage,
    hasNextPage: hasSelectedMediatorsNextPage,
    refetch: refetchSelectedMediators,
  } = useInfiniteQuery({
    queryKey: ["selectedMediators", service],
    queryFn: ({ pageParam }) => {
      return fetchSelectedMediators({ pageParam, serviceId: id });
    },
    retry: false,
    initialPageParam: 1,
    enabled: userDetails?._id === service?.employer?._id || isAdmin,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      // const totalData = members?.pages[0]?.pagination?.total;
      // setTotalData(totalData);
      const unsubscribe = setWorkers(
        members?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [members])
  );

  useEffect(() => {
    setIsServiceApplied(
      userDetails?.role === "MEDIATOR"
        ? service?.appliedMediators?.find(
            (mediator: any) => mediator?.mediator?._id === userDetails?._id
          )
        : service?.appliedWorkers?.find(
            (worker: any) => worker?._id === userDetails?._id
          ) || false
    );
    setIsServiceLiked(
      service?.likedBy?.find((liked: any) => liked?._id === userDetails?._id)
    );
    setIsSelected(
      userDetails?.role === "MEDIATOR"
        ? service?.selectedMediators?.find(
            (mediator: any) => mediator?.mediator?._id === userDetails?._id
          )
        : service?.selectedWorkers?.find(
            (worker: any) => worker?._id === userDetails?._id
          ) || false
    );
  }, [service]);

  useFocusEffect(
    React.useCallback(() => {
      let appliedWorkers = response?.data?.appliedMediators?.filter(
        (mediator: any) => {
          if (mediator?.mediator?._id === userDetails?._id) {
            return mediator?.workers;
          }
        }
      );

      // Extract just the worker IDs if workers are objects, otherwise use as-is
      const workerIds =
        appliedWorkers?.[0]?.workers?.map((worker: any) =>
          typeof worker === "object" ? worker._id : worker
        ) || [];

      setSelectedWorkersIds(workerIds);
      const unsubscribe = setService(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  useEffect(() => {
    const workers = selectedWorkers?.pages[0]?.data || [];
    const mediators = selectedMediators?.pages[0]?.data || [];
    setSelectedApplicants([...workers, ...mediators]);
  }, [selectedWorkers?.pages, selectedMediators?.pages]);

  useEffect(() => {
    const workers = appliedWorkers?.pages[0]?.data || [];
    const mediators = appliedMediators?.pages[0]?.data || [];
    setApplicants([...workers, ...mediators]);
  }, [appliedWorkers?.pages, appliedMediators?.pages]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={t("serviceDetails")}
              left="back"
              right="notification"
            />
          ),
        }}
      />

      <Loader loading={isLoading || isRefetching} />

      <ScrollView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {service && service?.images?.length > 0 && (
            <ImageSlider images={service?.images} />
          )}

          <View style={styles.contentWrapper}>
            {service?.status === "CANCELLED" && (
              <View style={styles?.selectedWrapper}>
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
                <Button
                  isPrimary={true}
                  title={t("callEmployer")}
                  onPress={() => {}}
                  icon={
                    <FontAwesome5
                      name="phone-alt"
                      size={16}
                      color={Colors.white}
                      style={{ marginRight: 10 }}
                    />
                  }
                />
              </View>
            )}

            <CustomHeading fontSize={18} textAlign="left">
              {t(service?.type)} - {t(service?.subType)}
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
              <CustomText textAlign="left">
                {t("startFrom")} {moment(service?.startDate).format("LL")}
              </CustomText>
            </View>

            <Highlights service={service} />

            <CustomText textAlign="left" fontSize={13}>
              {service?.description}
            </CustomText>

            {service && service?.requirements?.length > 0 && (
              <Requirements type="full" requirements={service?.requirements} />
            )}
          </View>

          {/* Selected Applicants */}
          {(service?.employer?._id === userDetails?._id || isAdmin) && (
            <View style={styles.applicantContainer}>
              <CustomHeading textAlign="left">
                Selected Applicants
              </CustomHeading>
              {selectedApplicants.length > 0 ? (
                <SelectedApplicants
                  selectedApplicants={selectedApplicants}
                  serviceId={service?._id}
                  refetchSelectedApplicants={() => {
                    refetchSelectedWorkers();
                    refetchSelectedMediators();
                  }}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  {isSelectedWorkerLoading ||
                  isSelectedMediatorLoading ||
                  isSelectedWorkerFetchingNextPage ||
                  isSelectedMediatorFetchingNextPage ? (
                    <ActivityIndicator
                      style={{ marginLeft: 10, paddingVertical: 60 }}
                      color={Colors?.primary}
                      animating={true}
                    />
                  ) : (
                    <EmptyDatePlaceholder title="Selected Applicants" />
                  )}
                </View>
              )}
            </View>
          )}

          {/* Applicants */}
          {(service?.employer?._id === userDetails?._id || isAdmin) && (
            <View style={styles.applicantContainer}>
              <CustomHeading textAlign="left">Applicants</CustomHeading>
              {applicants.length > 0 ? (
                <Applicants
                  applicants={applicants}
                  serviceId={service?._id}
                  refetchApplicants={() => {
                    refetchAppliedWorkers();
                    refetchAppliedMediators();
                  }}
                  refetchSelectedApplicants={() => {
                    refetchSelectedWorkers();
                    refetchSelectedMediators();
                  }}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  {isAppliedWorkersLoading ||
                  isAppliedMediatorsLoading ||
                  isAppliedWorkersFetchingNextPage ||
                  isAppliedMediatorsFetchingNextPage ? (
                    <ActivityIndicator
                      style={{ marginLeft: 10, paddingVertical: 60 }}
                      color={Colors?.primary}
                      animating={true}
                    />
                  ) : (
                    <EmptyDatePlaceholder title="Applicants" />
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

          {service && service?.employer?._id !== userDetails?._id && (
            <EmployerCard service={service} />
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
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  selectedWrapper: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors?.tertiery,
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
    backgroundColor: Colors.white,
    gap: 5,
  },
  emptyContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});
