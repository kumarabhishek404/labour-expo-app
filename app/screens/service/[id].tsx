import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import Map from "@/components/ViewMap";
import {
  applyService,
  editService,
  fetchMyApplicants,
  getServiceById,
  likeService,
  unApplyService,
  unLikeService,
} from "../../api/services";
import Loader from "@/components/Loader";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { AddServiceAtom, LocationAtom, UserAtom } from "../../AtomStore/user";
import { toast } from "../../hooks/toast";
import profileImage from "../../../assets/person-placeholder.png";
import { dateDifference } from "@/constants/functions";
import Button from "@/components/Button";
import ModalComponent from "@/components/Modal";
import EditService from "./editService";
import moment from "moment";
import AvatarComponent from "@/components/Avatar";
import { openGoogleMaps } from "@/app/hooks/map";

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
    service?.isLiked || false
  );
  const [isServiceApplied, setIsServiceApplied] = useState(
    service?.isApplied || service?.applied?.includes(userDetails?._id) || false
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
  } = useInfiniteQuery({
    queryKey: ["applicants"],
    queryFn: ({ pageParam }) => {
      return fetchMyApplicants({ pageParam, id });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
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
      // console.log("Response while unliking a service - ", response);
      let likedService = [...userDetails?.likedJobs];
      console.log("Response while unliking a service - ", likedService);

      // likeService?.filter((serviceId:any) => serviceId !== id)
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

  useEffect(() => {
    console.log("Resposne --", response?.data);
    setIsServiceApplied(
      service?.isApplied ||
        service?.applied?.includes(userDetails?._id) ||
        false
    );
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

  console.log(
    "serviceserviceservice----",
    service,
    userDetails?._id,
    service?.applied?.includes(userDetails?._id)
  );

  const handleSubmit = async () => {
    if (images && images?.length > 0) {
      setIsEditLoading(true);

      let payload = {
        ...service,
        _id: service?._id,
        name: title,
        description: description,
        // startDate: startDate,
        // endDate: endDate,
        location: {
          latitude: 27.1767,
          longitude: 78.0081,
        },
        // city: service?.city,
        // state: service?.state,
        // pinCode: service?.pinCode,
        // address: service?.address,
        // requirements: service?.requirements,
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

  const destination = {
    latitude: 40.758896,
    longitude: -73.98513,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
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
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
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
          mutationApplyService?.isPending
        }
      />

      <ScrollView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={{ uri: service?.coverImage }}
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
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

            <View style={styles.highlightWrapper}>
              <View
                style={{
                  flexDirection: "row",
                  width: "32%",
                }}
              >
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.highlightTxt}>Duration</Text>
                  <Text style={styles.highlightTxtVal}>
                    {service?.duration ||
                      dateDifference(service?.startDate, service?.endDate)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "32%",
                }}
              >
                <View style={styles.highlightIcon}>
                  <FontAwesome name="users" size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.highlightTxt}>Travelling</Text>
                  <Text style={styles.highlightTxtVal}>Yes</Text>
                </View>
              </View>
              {service?.location && service?.location?.latitude && (
                <View
                  style={{
                    flexDirection: "column",
                    width: "32%",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.highlightIcon}>
                      <FontAwesome5
                        name="rupee-sign"
                        size={18}
                        color={Colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.highlightTxt}>Distance</Text>
                      <Text style={styles.highlightTxtVal}>Just 2 Kms</Text>
                    </View>
                  </View>
                  <Button
                    isPrimary={false}
                    title="Get Direction"
                    onPress={() => openGoogleMaps(destination)}
                    // icon={
                    //   <FontAwesome
                    //     name="users"
                    //     size={12}
                    //     color={Colors.primary}
                    //   />
                    // }
                    style={{
                      marginTop: 6,
                      borderWidth: 1.5,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                    }}
                    textStyle={{
                      fontWeight: "700",
                      fontSize: 12,
                    }}
                  />
                </View>
              )}
            </View>

            <Text style={styles.listingDetails}>{service?.description}</Text>

            {service && service?.requirements?.length > 0 && (
              <View style={styles.requirmentContainer}>
                {service &&
                  service?.requirements?.length > 0 &&
                  service?.requirements?.map(
                    (requirement: any, index: number) => {
                      return (
                        <View style={styles.card} key={index}>
                          <View style={styles.header}>
                            <Text style={styles.title}>
                              {requirement?.name}
                            </Text>
                            <Text style={styles.price}>
                              ₹ {requirement?.payPerDay} Per Day
                            </Text>
                          </View>
                          <Text style={styles.subTitle}>shuttering</Text>

                          <View style={styles.details}>
                            <Text style={styles.detailLabel}>Count</Text>
                            <Text style={styles.detailLabel}>Food</Text>
                            <Text style={styles.detailLabel}>Living</Text>
                            <Text style={styles.detailLabel}>ESI / PF</Text>
                          </View>

                          <View style={styles.values}>
                            <Text style={styles.value}>
                              {requirement?.totalRequired}
                            </Text>
                            <Text style={styles.value}>
                              {requirement?.foodProvided ? "Yes" : "No"}
                            </Text>
                            <Text style={styles.value}>
                              {requirement?.shelterProvider ? "Yes" : "No"}
                            </Text>
                            <Text style={styles.value}>No</Text>
                          </View>
                        </View>
                      );
                    }
                  )}
              </View>
            )}
          </View>

          {service?.employer === userDetails?._id &&
            applicants?.pages[0]?.data &&
            applicants?.pages[0]?.data?.length > 0 && (
              <View style={styles.applicantContainer}>
                <Text style={styles.applicantHeader}>Applicants</Text>
                {applicants?.pages[0]?.data?.map((item: any, index: number) => {
                  return (
                    <View key={index} style={styles.productCard}>
                      <Image
                        source={
                          item.avatar ? { uri: item.avatar } : profileImage
                        }
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <View style={styles?.titleContainer}>
                          <Text style={styles.productTitle}>
                            {item.firstName} {item.lastName}
                          </Text>
                          <Button
                            style={{
                              paddingVertical: 4,
                              paddingHorizontal: 10,
                              marginLeft: 4,
                            }}
                            textStyle={{
                              fontSize: 10,
                            }}
                            isPrimary={true}
                            title="View Details"
                            onPress={() =>
                              router?.push(`/screens/worker/${item._id}`)
                            }
                          />
                        </View>

                        <Text style={styles.productPrice}>
                          {item.skills.join(", ") || "Labour, Mistri, Plumber"}
                        </Text>
                        <View style={styles.recommendationContainer}>
                          <FontAwesome
                            name="user-circle"
                            size={16}
                            color="gray"
                          />
                          <Text style={styles.recommendationText}>
                            {item.address ||
                              "Balipur, Shakarauli, Jalesar Etah"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

          {/* First Make Google Maps API Key Then Uncomment It */}
          {service?.location && service?.location?.latitude && (
            <Map
              data={{
                ...service?.location,
                latitudeDelta: 2,
                longitudeDelta: 2,
              }}
            />
          )}

          {service && service?.employer && (
            <View
              style={[
                styles.requirmentContainer,
                {
                  marginVertical: 20,
                  marginHorizontal: 20,
                },
              ]}
            >
              <View
                style={[
                  styles.card,
                  {
                    marginBottom: 0,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View style={{ width: "67%" }}>
                  <Text style={[styles.title, { marginBottom: 10 }]}>
                    Employer
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "500" }}>
                    Sanaya Singh
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "500" }}>
                    Balipur, Shakrauli, Jalesar, Etah Uttar Predesh
                  </Text>
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: Colors?.primary,
                      width: 120,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <FontAwesome5
                      name="phone-alt"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text
                      style={{
                        color: Colors?.primary,
                        marginLeft: 6,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Dial Phone
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: Colors?.primary,
                      width: 160,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <FontAwesome5
                      name="whatsapp"
                      size={18}
                      color={Colors.primary}
                    />
                    <Text
                      style={{
                        color: Colors?.primary,
                        marginLeft: 6,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Whatsapp Message
                    </Text>
                  </View>
                </View>
                <View style={{ width: "33%" }}>
                  <AvatarComponent
                    isEditable={false}
                    profileImage={
                      "https://xsgames.co/randomusers/avatar.php?g=female"
                    }
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderWidth: 2,
                      borderColor: Colors?.primary,
                      width: 120,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() =>
                      router.push(
                        userDetails?._id === service?.employer
                          ? "/(tabs)/profile"
                          : `/screens/employer/${service?.employer}`
                      )
                    }
                  >
                    <AntDesign name="eye" size={18} color={Colors.primary} />
                    <Text
                      style={{
                        color: Colors?.primary,
                        marginLeft: 6,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </ScrollView>

      {service?.employer === userDetails?._id ? (
        <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
          <TouchableOpacity
            // onPress={() =>
            //   isServiceApplied
            //     ? mutationUnApplyService.mutate()
            //     : mutationApplyService.mutate()
            // }
            style={[styles.footerBtn, styles.footerBookBtn]}
          >
            <Text style={styles.footerBtnTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/addService/");
              setAddService(service);
            }}
            style={[styles.footerBtn]}
          >
            <Text style={styles.footerBtnTxt}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
          <TouchableOpacity
            onPress={() =>
              isServiceApplied
                ? mutationUnApplyService.mutate()
                : mutationApplyService.mutate()
            }
            style={[styles.footerBtn, styles.footerBookBtn]}
          >
            <Text style={styles.footerBtnTxt}>
              {isServiceApplied ? "Already Applied" : "Apply Now"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              isServiceLiked
                ? mutationUnLikeService.mutate()
                : mutationLikeService.mutate()
            }
            style={[styles.footerBtn]}
          >
            <Text style={styles.footerBtnTxt}>
              {isServiceLiked ? "Unlike" : "Like"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => {}} style={styles.footerBtn}>
          <Text style={styles.footerBtnTxt}>${service?.price}</Text>
          </TouchableOpacity> */}
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
    padding: 20,
    backgroundColor: Colors.white,
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
  highlightWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
    height: 30,
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  getDirectionText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    textAlign: "left",
  },
  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  applicantList: {
    display: "flex",
  },
  applicantContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  applicantHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 2,
    borderColor: "gray",
    borderWidth: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 15,
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
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationText: {
    marginLeft: 5,
    fontSize: 12,
    color: "gray",
    flex: 1,
  },
  requirmentContainer: {
    marginVertical: 10,
    backgroundColor: "#e1e8e5",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#e1e8e5",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  viewButton: {
    width: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.black,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 16,
    color: Colors?.black,
  },
  subTitle: {
    fontSize: 14,
    color: Colors?.primary,
    marginBottom: 12,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#4F4F4F",
    fontWeight: "600",
  },
  values: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    marginRight: 20,
  },
  // footerLikeBtn: {
  //   backgroundColor: "gray",
  // },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
