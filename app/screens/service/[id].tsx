import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
  mediatorApplyService,
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
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import CustomCheckbox from "@/components/commons/CustomCheckbox";
import ProfilePicture from "@/components/commons/ProfilePicture";
import { fetchAllMembers } from "@/app/api/mediator";
import { debounce } from "lodash";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

interface ImageAsset {
  uri: string;
}

const users = [
  {
    id: 1,
    name: "John Doe",
    profilePic:
      "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    skills: ["React Native", "JavaScript", "CSS"],
    address: "123, Main Street, New York",
  },
  {
    id: 2,
    name: "Jane Smith",
    profilePic:
      "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    skills: ["Python", "Django", "Data Analysis"],
    address: "456, Elm Street, Chicago",
  },
];

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

  const [isWorkerSelectModal, setIsWorkerSelectModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers]: any = useState([]);

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
    retry: false,
    initialPageParam: 1,
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
    queryFn: ({ pageParam }) => fetchAllMembers({ pageParam }),
    retry: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage?.pagination?.page + 1;
      }
      return undefined;
    },
  });

  console.log("members---", members?.pages[0]);

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
    retry: false,
    initialPageParam: 1,
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
      const unsubscribe = setSelectedWorkers(
        members?.pages.flatMap((page: any) => page.data || [])
      );
      return () => unsubscribe;
    }, [members])
  );

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

  const mutationMediatorApplyService = useMutation({
    mutationKey: ["mediatorApplyService", { id }],
    mutationFn: () =>
      mediatorApplyService({ serviceID: id, worker: selectedWorkers }),
    onSuccess: (response) => {
      refetch();
      console.log("Response while applying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
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

  const handleApply = () => {
    if (userDetails?.role === "MEDIATOR") {
      setIsWorkerSelectModal(true);
    } else {
      mutationApplyService.mutate();
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedWorkers((prev: any) =>
      prev.includes(userId)
        ? prev.filter((id: string) => id !== userId)
        : [...prev, userId]
    );
  };

  const deleteModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading fontSize={14}>{t("wantToDeleteService")}</CustomHeading>
        <CustomText>{t("irreversibleAction")}</CustomText>
      </View>
    );
  };

  const RenderMemberItem = ({ item }: any) => (
    <View style={styles.userItem}>
      <CustomCheckbox
        isChecked={selectedWorkers.includes(item?.id)}
        onToggle={() => toggleUserSelection(item?.id)}
        containerStyle={{ marginRight: 8 }}
      />
      <ProfilePicture uri={item.profilePic} />
      <View style={styles.userInfo}>
        <CustomText style={styles.userName} textAlign="left">
          {item.name}
        </CustomText>
        <CustomText style={styles.userSkills} textAlign="left">
          Skills: {item.skills.join(", ")}
        </CustomText>
        <CustomText style={styles.userAddress}>{item.address}</CustomText>
      </View>
    </View>
  );

  const memoizedData = useMemo(
    () => selectedWorkers?.flatMap((data: any) => data),
    [selectedWorkers]
  );

  const loadMore = () => {
    if (hasMemberNextPage && !isMemberFetchingNextPage) {
      memberFetchPage();
    }
  };

  RenderMemberItem.displayName = "RenderMemberItem";
  const renderItem = ({ item }: any) => <RenderMemberItem item={item} />;

  const mediatorModelContent = () => {
    return (
      <View style={styles.modalContent}>
        {memoizedData && memoizedData?.length > 0 ? (
          <FlatList
            data={memoizedData ?? []}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id?.toString()}
            onEndReached={debounce(loadMore, 300)}
            onEndReachedThreshold={0.9}
            ListFooterComponent={() =>
              isMemberFetchingNextPage ? (
                <ActivityIndicator
                  size="large"
                  color={Colors?.primary}
                  style={styles.loaderStyle}
                />
              ) : null
            }
            getItemLayout={(data, index) => ({
              length: 200,
              offset: 200 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={3}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyDatePlaceholder title="Members" />
        )}
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
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading fontSize={14}>
          {t("wantToCompleteService")}
        </CustomHeading>
        <CustomText>{t("restoreSerivceText")}</CustomText>
      </View>
    );
  };

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
                    {t("thisServiceIsCancelled")}
                  </CustomHeading>
                  <CustomText textAlign="left" color={Colors?.white}>
                    {t("apologyForInconvenience")}
                  </CustomText>
                </View>
              </View>
            )}

            {isSelected && service?.status !== "Cancelled" && (
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
                title={t("removeFromService")}
                onPress={() =>
                  isServiceApplied
                    ? mutationUnApplyService.mutate()
                    : mutationApplyService.mutate()
                }
              />
            ) : (
              <Button
                isPrimary={true}
                title={isServiceApplied ? t("cancelApply") : t("applyNow")}
                onPress={() =>
                  isServiceApplied
                    ? mutationUnApplyService.mutate()
                    : handleApply()
                }
              />
            )}

            <Button
              isPrimary={false}
              title={isServiceLiked ? t("unlike") : t("like")}
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
              title={t("deleteService")}
              onPress={() => setModalVisible(true)}
              style={styles?.deleteBtn}
            />
            {applicants &&
            applicants?.pages[0]?.data &&
            applicants?.pages[0]?.data?.length > 0 ? (
              <Button
                isPrimary={false}
                title={t("completeService")}
                onPress={() => setIsCompleteModalVisible(true)}
                style={styles?.completeBtn}
                textStyle={{
                  color: Colors?.white,
                }}
              />
            ) : (
              <Button
                isPrimary={false}
                title={t("edit")}
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
              title={t("restoreService")}
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
        title={t("completeService")}
        visible={isCompleteModalVisible}
        content={completeServiceModalContent}
        onClose={() => setIsCompleteModalVisible(false)}
        primaryButton={{
          title: t("complete"),
          action: mutationCompleteService?.mutate,
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setIsCompleteModalVisible(false),
        }}
      />

      <ModalComponent
        title={t("deleteService")}
        visible={modalVisible}
        content={deleteModalContent}
        onClose={() => setModalVisible(false)}
        primaryButton={{
          title: t("deleteService"),
          styles: {
            backgroundColor: "red",
            borderColor: "red",
          },
          action: handleDelete,
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setModalVisible(false),
        }}
      />

      <ModalComponent
        title={t("selectWorkers")}
        visible={isWorkerSelectModal}
        content={mediatorModelContent}
        onClose={() => setIsWorkerSelectModal(false)}
        primaryButton={{
          disabled: selectedWorkers?.length === 0,
          title: t("applyNow"),
          styles: {
            backgroundColor: "red",
            borderColor: "red",
          },
          action: mutationMediatorApplyService?.mutate,
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setIsWorkerSelectModal(false),
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
});
