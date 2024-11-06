import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Entypo, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown, useAnimatedRef } from "react-native-reanimated";
import Map from "@/components/commons/ViewMap";
import {
  applyService,
  completeService,
  deleteServiceById,
  fetchMyApplicants,
  fetchSelectedCandidates,
  getServiceById,
  likeService,
  unApplyService,
  unLikeService,
} from "../../api/services";
import Loader from "@/components/commons/Loader";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { AddServiceAtom, UserAtom } from "../../AtomStore/user";
import { toast } from "../../hooks/toast";
import Button from "@/components/inputs/Button";
import ModalComponent from "@/components/commons/Modal";
import moment from "moment";
import Applicants from "@/components/commons/Applicants";
import SelectedApplicants from "@/components/commons/SelectedApplicants";
import Requirements from "@/components/commons/Requirements";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Header from "@/components/commons/Header";
import CustomHeader from "@/components/commons/Header";

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
    service?.likedBy?.includes(userDetails?._id) || false
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    service?.appliedBy?.includes(userDetails?._id) || false
  );
  const [isSelected, setIsSelected] = useState(
    service?.selected?.includes(userDetails?._id) || false
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

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
    data: applicants,
    isLoading: isApplicantLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchApplicants,
  } = useInfiniteQuery({
    queryKey: ["applicants"],
    queryFn: ({ pageParam }) => {
      return fetchMyApplicants({ pageParam, serviceId: id });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const {
    data: selectedApplicants,
    isLoading: isSelectedApplicantLoading,
    // isFetchingNextPage,
    // fetchNextPage,
    // hasNextPage,
    refetch: refetchSelectedApplicants,
  } = useInfiniteQuery({
    queryKey: ["selectedApplicants"],
    queryFn: ({ pageParam }) => {
      return fetchSelectedCandidates({ pageParam, serviceId: id });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  const mutationLikeService = useMutation({
    mutationKey: ["likeService", { id }],
    mutationFn: () => likeService({ serviceID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Service added in favourites");
      console.log("Response while liking a service - ", response);
    },
    onError: (err) => {
      console.error("error while liking the service ", err);
    },
  });

  const mutationUnLikeService = useMutation({
    mutationKey: ["unlikeService", { id }],
    mutationFn: () => unLikeService({ serviceID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Service removed from favourites");
      console.log("Response while unliking a service - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the service ", err);
    },
  });

  const mutationApplyService = useMutation({
    mutationKey: ["applyService", { id }],
    mutationFn: () => applyService({ serviceID: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while applying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationUnApplyService = useMutation({
    mutationKey: ["unapplyService", { id }],
    mutationFn: () => unApplyService({ serviceID: id }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while unapplying the service - ", response);
    },
    onError: (err) => {
      console.error("error while unapplying the service ", err);
    },
  });

  const mutationCompleteService = useMutation({
    mutationKey: ["completeService", { id }],
    mutationFn: () => completeService({ serviceID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Service completed successfully");
      console.log("Response while completing a service - ", response);
    },
    onError: (err) => {
      console.error("error while completing the service ", err);
    },
  });

  useEffect(() => {
    setIsServiceApplied(
      service?.appliedBy?.includes(userDetails?._id) || false
    );
    setIsServiceLiked(service?.likedBy?.includes(userDetails?._id) || false);
    setIsSelected(service?.selected?.includes(userDetails?._id) || false);
  }, [service]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setService(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  const mutationDeleteService = useMutation({
    mutationKey: ["deleteService", { id }],
    mutationFn: () => deleteServiceById(id),
    onSuccess: (response) => {
      setModalVisible(false);
      console.log("Response while deleting a service - ", response);
    },
    onError: (err) => {
      console.error("error while deleting a service ", err);
    },
  });

  const handleDelete = () => {
    mutationDeleteService.mutate();
  };

  const deleteModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>Are you sure?</CustomHeading>
        <CustomHeading fontSize={14}>
          You want to delete this service.
        </CustomHeading>
        <CustomText>
          This action is irreversible and will lead to a loss of all your
          created service.
        </CustomText>
      </View>
    );
  };

  const completeServiceModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>Are you sure?</CustomHeading>
        <CustomHeading fontSize={14}>
          You want to mark this service as completed.
        </CustomHeading>
        <CustomText>
          You can restore your service again and start hiring.
        </CustomText>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title="Service Details"
              left="back"
              right="notification"
            />
          ),
        }}
      />

      <Loader
        loading={
          isLoading ||
          isRefetching ||
          mutationLikeService?.isPending ||
          mutationUnLikeService?.isPending ||
          mutationApplyService?.isPending ||
          mutationUnApplyService?.isPending ||
          mutationCompleteService?.isPending ||
          mutationDeleteService?.isPending
        }
      />

      <ScrollView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {service && service?.images?.length > 0 && (
            <ImageSlider images={service?.images} />
          )}

          <View style={styles.contentWrapper}>
            {service?.status === "Cancelled" && (
              <View style={styles?.selectedWrapper}>
                <View style={{ width: "100%" }}>
                  <CustomHeading color={Colors?.white} textAlign="left">
                    This Service Is Cancelled
                  </CustomHeading>
                  <CustomText textAlign="left" color={Colors?.white}>
                    (We apologize for the inconvenience, but due to unforeseen
                    circumstances, we need to cancel this service. Thank you for
                    your understanding)
                  </CustomText>
                </View>
              </View>
            )}

            {isSelected && service?.status !== "Cancelled" && (
              <View style={styles?.selectedWrapper}>
                <CustomHeading color={Colors?.white} textAlign="left">
                  You are Selected
                </CustomHeading>
                <CustomText
                  textAlign="left"
                  color={Colors?.white}
                  style={{ marginBottom: 10 }}
                >
                  (Do your best work and get best rating. It will help you to
                  get more work)
                </CustomText>
                <Button
                  isPrimary={true}
                  title="Call Employer"
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
              {service?.name}
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
                Start from {moment(service?.startDate).format("LL")}
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

          {service?.employer?._id === userDetails?._id &&
            selectedApplicants?.pages[0]?.data &&
            selectedApplicants?.pages[0]?.data?.length > 0 && (
              <SelectedApplicants
                selectedApplicants={selectedApplicants?.pages[0]?.data}
                serviceId={service?._id}
                refetchSelectedApplicants={refetchSelectedApplicants}
              />
            )}

          {service?.employer?._id === userDetails?._id &&
            applicants?.pages[0]?.data &&
            applicants?.pages[0]?.data?.length > 0 && (
              <Applicants
                applicants={applicants}
                serviceId={service?._id}
                refetchApplicants={refetchApplicants}
                refetchSelectedApplicants={refetchSelectedApplicants}
              />
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

      {service?.employer?._id !== userDetails?._id &&
        service?.status === "Hiring" && (
          <Animated.View
            style={styles.footer}
            entering={SlideInDown.delay(200)}
          >
            {service?.isSelected ? (
              <Button
                isPrimary={true}
                title="Remove from Service"
                onPress={() =>
                  isServiceApplied
                    ? mutationUnApplyService.mutate()
                    : mutationApplyService.mutate()
                }
              />
            ) : (
              <Button
                isPrimary={true}
                title={isServiceApplied ? "Cancel Apply" : "Apply Now"}
                onPress={() =>
                  isServiceApplied
                    ? mutationUnApplyService.mutate()
                    : mutationApplyService.mutate()
                }
              />
            )}

            <Button
              isPrimary={false}
              title={isServiceLiked ? "Unlike" : "Like"}
              onPress={() =>
                isServiceLiked
                  ? mutationUnLikeService.mutate()
                  : mutationLikeService.mutate()
              }
              style={styles?.footerBtn}
              textStyle={{
                color: Colors?.white,
              }}
            />
          </Animated.View>
        )}

      {service?.employer?._id === userDetails?._id &&
        service?.status !== "Cancelled" && (
          <Animated.View
            style={styles.footer}
            entering={SlideInDown.delay(200)}
          >
            <Button
              isPrimary={true}
              title="Delete Service"
              onPress={() => setModalVisible(true)}
              style={styles?.deleteBtn}
            />
            {applicants &&
            applicants?.pages[0]?.data &&
            applicants?.pages[0]?.data?.length > 0 ? (
              <Button
                isPrimary={false}
                title="Complete Service"
                onPress={() => setIsCompleteModalVisible(true)}
                style={styles?.completeBtn}
                textStyle={{
                  color: Colors?.white,
                }}
              />
            ) : (
              <Button
                isPrimary={false}
                title="Edit"
                onPress={() => {
                  router.push("/(tabs)/addService/");
                  setAddService(service);
                }}
                style={styles?.footerBtn}
                textStyle={{
                  color: Colors?.white,
                }}
              />
            )}
          </Animated.View>
        )}

      {service?.employer?._id === userDetails?._id &&
        service?.status === "Cancelled" && (
          <Animated.View
            style={styles.footer}
            entering={SlideInDown.delay(200)}
          >
            <Button
              isPrimary={false}
              title="Restore Service"
              onPress={() => mutationCompleteService?.mutate()}
              style={styles?.footerBtn}
              bgColor={Colors?.tertiery}
              textStyle={{
                color: Colors?.white,
              }}
            />
          </Animated.View>
        )}

      <ModalComponent
        title="Complete Service"
        visible={isCompleteModalVisible}
        content={completeServiceModalContent}
        onClose={() => setIsCompleteModalVisible(false)}
        primaryButton={{
          title: "Complete",
          action: mutationCompleteService?.mutate,
        }}
        secondaryButton={{
          title: "Cancel",
          styles: "",
          action: () => setIsCompleteModalVisible(false),
        }}
      />

      <ModalComponent
        title="Delete Service"
        visible={modalVisible}
        content={deleteModalContent}
        onClose={() => setModalVisible(false)}
        primaryButton={{
          title: "Delete",
          styles: {
            backgroundColor: "red",
            borderColor: "red",
          },
          action: handleDelete,
        }}
        secondaryButton={{
          title: "Cancel",
          styles: "",
          action: () => setModalVisible(false),
        }}
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
});
