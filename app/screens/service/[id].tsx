import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import Map from "@/components/commons/ViewMap";
import {
  applyService,
  completeService,
  editService,
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
import { AddServiceAtom, LocationAtom, UserAtom } from "../../AtomStore/user";
import { toast } from "../../hooks/toast";
import coverImage from "../../../assets/images/placeholder-cover.jpg";
import { dateDifference } from "@/constants/functions";
import Button from "@/components/inputs/Button";
import ModalComponent from "@/components/commons/Modal";
import EditService from "./editService";
import moment from "moment";
import AvatarComponent from "@/components/commons/Avatar";
import { openGoogleMaps } from "@/app/hooks/map";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import Applicants from "@/components/commons/Applicants";
import SelectedApplicants from "@/components/commons/SelectedApplicants";
import Requirements from "@/components/commons/Requirements";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

interface ImageAsset {
  uri: string;
}

const ServiceDetails = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const setAddService = useSetAtom(AddServiceAtom);
  const [location, setLocation] = useAtom(LocationAtom);
  const [mapLocation, setMapLocation]: any = useState({});
  const { id } = useLocalSearchParams();
  const [service, setService]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isEditService, setIsEditService] = useState(false);
  const [isServiceLiked, setIsServiceLiked] = useState(
    service?.likedBy?.includes(userDetails?._id) || false
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    service?.appliedBy?.includes(userDetails?._id) || false
  );
  const [isSelected, setIsSelected] = useState(
    service?.selected?.includes(userDetails?._id) || false
  );

  // const [addService, setAddService] = useAtom(AddServiceAtom);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [images, setImages]: any = useState<ImageAsset[]>([
    service?.coverImage,
  ]);
  const [title, setTitle] = useState<string>(service?.name ?? "");
  const [description, setDescription] = useState<string>(
    service?.description ?? ""
  );
  const [startDate, setStartDate] = useState<any>(
    moment(service?.startDate).format("DD/MM/YYYY") ?? ""
  );
  const [endDate, setEndDate] = useState<any>(
    moment(service?.endDate).format("DD/MM/YYYY") ?? ""
  );

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

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
  console.log("sewrvire----", service?.selected);

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

  useFocusEffect(
    React.useCallback(() => {
      const locationObject = {
        cordinates: {
          latitude: 28.6448,
          longitude: 77.216721,
          latitudeDelta: 2,
          longitudeDelta: 2,
        },
      };
      return () => setMapLocation(locationObject);
    }, [location])
  );

  const handleSubmit = async () => {
    if (images && images?.length > 0) {
      setIsEditLoading(true);

      let payload = {
        ...service,
        _id: service?._id,
        name: title,
        description: description,
        location: {
          latitude: 27.1767,
          longitude: 78.0081,
        },
      };

      try {
        const response: any = await editService(payload);
        console.log("Response Data ---", response?.data);
        setIsEditLoading(false);
        setIsEditService(false);
        toast?.success("Form submitted successfully!");
        refetch();
      } catch (error: any) {
        console.log("error?.response?.data?.message--", error);
        setIsEditLoading(false);
      }
    } else {
      toast.error("Please fill all the input fields");
    }
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const modalContent = () => {
    return (
      <EditService
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        startDate={startDate}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        onStartDateChange={onStartDateChange}
        endDate={endDate}
        showEndDatePicker={showEndDatePicker}
        setShowEndDatePicker={setShowEndDatePicker}
        onEndDateChange={onEndDateChange}
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          // headerTransparent: false,
          headerTitle: "Service Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="bookmark-outline" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Loader
        loading={
          isLoading ||
          isEditLoading ||
          isRefetching ||
          mutationLikeService?.isPending ||
          mutationUnLikeService?.isPending ||
          mutationApplyService?.isPending ||
          mutationUnApplyService?.isPending ||
          mutationCompleteService?.isPending
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
            {isSelected && (
              <View style={styles?.selectedWrapper}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.selectedText}>You are Selected</Text>
                  <Text style={styles.helpingText}>
                    (Do your best work and get best rating. It will help you to
                    get more work)
                  </Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Button
                    isPrimary={true}
                    title="Call Employer"
                    onPress={() => {}}
                    style={{
                      backgroundColor: "#007BFF",
                      borderColor: "#007BFF",
                      paddingHorizontal: 0,
                      borderWidth: 0,
                    }}
                    textStyle={{
                      fontSize: 16,
                    }}
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
              </View>
            )}

            <Text style={styles.listingName}>{service?.name}</Text>
            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.listingLocationTxt}>{service?.address}</Text>
            </View>

            <View style={styles.listingLocationWrapper}>
              <Entypo name="calendar" size={18} color={Colors.primary} />
              <Text style={styles.listingLocationTxt}>
                Start from {moment(service?.startDate).format("LL")}
              </Text>
            </View>

            <Highlights service={service} />

            <Text style={styles.listingDetails}>{service?.description}</Text>

            {service && service?.requirements?.length > 0 && (
              <Requirements requirements={service?.requirements} />
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

      {service?.employer?._id === userDetails?._id ? (
        <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
          <Button isPrimary={true} title="Cancel" onPress={() => {}} />
          {applicants &&
          applicants?.pages[0]?.data &&
          applicants?.pages[0]?.data?.length > 0 ? (
            <Button
              isPrimary={false}
              title="Complete Service"
              onPress={() => mutationCompleteService?.mutate()}
              style={styles?.footerBtn}
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
      ) : (
        <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
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

      <ModalComponent
        title="Add Service"
        visible={isEditService}
        onClose={() => {
          setIsEditService(false);
          setShowStartDatePicker(false);
          setShowEndDatePicker(false);
        }}
        content={modalContent}
        primaryButton={{
          action: () => handleSubmit(),
        }}
        secondaryButton={{
          action: () => setIsEditService(false),
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
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    textTransform: "uppercase",
    backgroundColor: Colors?.tertiery,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 4,
  },
  selectedText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0,
    color: Colors?.white,
  },
  helpingText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
    color: Colors?.white,
  },
  listingName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  listingLocationWrapper: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
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
});
