import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import SERVICE from "../../api/services";
import Loader from "@/components/commons/Loaders/Loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Button from "@/components/inputs/Button";
import moment from "moment";
import Requirements from "@/components/commons/Requirements";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import { handleCall } from "@/constants/functions";
import BookingActionButtons from "./actionButtons";
import SelectedUsers from "./selectedUsers";
import EMPLOYER from "@/app/api/employer";
import TOAST from "@/app/hooks/toast";
import ButtonComp from "@/components/inputs/Button";
import WORKER from "@/app/api/workers";
import DateDisplay from "@/components/commons/ShowDate";
import ShowAddress from "@/components/commons/ShowAddress";
import BookingDetailsPlaceholder from "@/components/commons/LoadingPlaceholders/BookingDetails";
import { getDynamicWorkerType } from "@/utils/i18n";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const BookingDetails = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const firstTimeRef = React.useRef(true);
  const { id, data, category, title }: any = useLocalSearchParams();
  const [booking, setBooking] = useState(JSON.parse(data));
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isSelected, setIsSelected] = useState(
    booking?.selectedUsers?.find(
      (user: any) => user?.user?._id === userDetails?._id
    ) || false
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const { refreshUser, isLoading: isRefreshLoading } =
    REFRESH_USER.useRefreshUser();

  const [isAdmin] = useState(userDetails?.isAdmin);

  let workersList =
    booking?.bookingType === "byService"
      ? [
          ...(booking.selectedUsers?.filter(
            (user: any) => user?.status === "SELECTED"
          ) || []),
          ...booking.selectedUsers
            .filter((user: any) => user?.status === "SELECTED")
            .flatMap((user: any) => user?.workers || []),
        ]
      : [booking?.bookedWorker];

  const {
    isLoading,
    isRefetching,
    data: response,
    refetch,
  } = useQuery({
    queryKey: ["bookingDetails", id],
    queryFn: async () =>
      category === "recievedRequests" || category === "sentRequests"
        ? await WORKER?.fetchBookingInvitationsDetails(id)
        : await SERVICE?.getServiceById(id),
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

  useEffect(() => {
    setIsSelected(
      booking?.selectedUsers?.find(
        (user: any) => user?.user?._id === userDetails?._id
      ) || false
    );
  }, [booking]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setBooking(response?.data || JSON.parse(data));
      return () => unsubscribe;
    }, [response])
  );

  console.log("booking?.bookedWorker-", booking?.bookedWorker);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={title || "directBookingDetails"}
              left="back"
              right="notification"
            />
          ),
        }}
      />

      {/* <Loader loading={isLoading} /> */}
      {isLoading ? (
        <BookingDetailsPlaceholder />
      ) : (
        <ScrollView style={styles.container}>
          <Animated.ScrollView
            ref={scrollRef}
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            <View style={styles.contentWrapper}>
              {booking?.employer && booking?.employer === userDetails?._id && (
                <View>
                  <CustomHeading
                    textAlign="left"
                    baseFont={20}
                    color={Colors?.black}
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    {t("bookedWorker")}
                  </CustomHeading>
                  <SelectedUsers
                    selectedApplicants={[
                      ...(booking?.bookedWorker ? [booking?.bookedWorker] : []), // Add booked worker if available
                      ...(booking?.selectedUsers || []),
                    ].filter(Boolean)}
                    bookingId={booking?._id}
                    bookingType={booking?.bookingType}
                    appliedSkill={booking?.appliedSkill}
                    refetch={refetch}
                  />
                </View>
              )}

              {booking?.status === "HIRING" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  {booking?.employer === userDetails?._id ? (
                    <ButtonComp
                      isPrimary={true}
                      title={t("addAttendance")}
                      onPress={() =>
                        router?.push({
                          pathname: "/screens/bookings/addAttendance",
                          params: {
                            bookingDetails: JSON.stringify(booking),
                            workers: JSON.stringify(workersList),
                          },
                        })
                      }
                      style={{ flex: 1, paddingVertical: 6, marginTop: 10 }}
                    />
                  ) : (
                    <ButtonComp
                      isPrimary={true}
                      title={t("showYourAttendance")}
                      onPress={() =>
                        router?.push({
                          pathname: "/screens/bookings/showAttendance",
                          params: {
                            bookingDetails: JSON.stringify(booking),
                          },
                        })
                      }
                      bgColor={Colors?.tertieryButton}
                      borderColor={Colors?.tertieryButton}
                      style={{ flex: 1, paddingVertical: 6 }}
                    />
                  )}
                </View>
              )}

              {booking?.status === "CANCELLED" && (
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

              {booking?.status === "COMPLETED" && (
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

              {isSelected && booking?.status !== "CANCELLED" && (
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
                    onPress={() => handleCall(booking?.employer?.mobile)}
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

              <View style={{ marginTop: 20, marginBottom: 10 }}>
                {booking?.type &&
                  booking?.subType &&
                  booking?.bookingType === "byService" && (
                    <CustomHeading baseFont={18} textAlign="left">
                      {t(booking?.type)} - {t(booking?.subType)}
                    </CustomHeading>
                  )}

                {booking?.appliedSkill && booking?.appliedSkill?.skill && (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <CustomHeading
                      baseFont={20}
                      textAlign="left"
                      style={{
                        flex: 1,
                      }}
                    >
                      {getDynamicWorkerType(booking?.appliedSkill?.skill, 1)}
                    </CustomHeading>

                    {booking?.appliedSkill?.pricePerDay && (
                      <CustomHeading
                        baseFont={20}
                        textAlign="right"
                        color={Colors?.tertieryButton}
                        style={{ width: "35%" }}
                      >
                        {booking?.appliedSkill?.pricePerDay} {t("perDay")}
                      </CustomHeading>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.listingLocationWrapper}>
                <ShowAddress address={booking?.address} />
              </View>

              <View style={styles.listingLocationWrapper}>
                <DateDisplay date={booking?.startDate} type="startDate" />
              </View>

              <Highlights service={booking} />

              {booking?.description && (
                <View style={{ marginVertical: 20 }}>
                  <CustomHeading
                    textAlign="left"
                    baseFont={18}
                    color={Colors?.inputLabel}
                  >
                    {t("description")}
                  </CustomHeading>
                  <CustomText textAlign="left" baseFont={16}>
                    {booking?.description}
                  </CustomText>
                </View>
              )}

              {booking && booking?.requirements?.length > 0 && (
                <Requirements
                  type="full"
                  requirements={booking?.requirements}
                />
              )}

              {booking?.employer?._id &&
                booking?.employer?._id !== userDetails?._id && (
                  <View style={{ marginTop: 20 }}>
                    <CustomHeading
                      textAlign="left"
                      baseFont={20}
                      color={Colors?.black}
                    >
                      {t("employer")}
                    </CustomHeading>
                    <EmployerCard employer={booking?.employer} />
                  </View>
                )}
            </View>
          </Animated.ScrollView>
        </ScrollView>
      )}

      {!isLoading && (
        <BookingActionButtons
          category={category}
          booking={booking}
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
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentWrapper: {
    paddingHorizontal: 15,
    // paddingVertical: 20,
    backgroundColor: Colors.background,
  },
  selectedWrapper: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors?.success,
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
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
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
    backgroundColor: Colors.fourth,
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
    marginVertical: 5,
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
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
