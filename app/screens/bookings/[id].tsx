import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown, useAnimatedRef } from "react-native-reanimated";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import Button from "@/components/inputs/Button";
import moment from "moment";
import EmployerCard from "@/components/commons/EmployerCard";
import Highlights from "@/components/commons/Highlights";
import ImageSlider from "@/components/commons/ImageSlider";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import WorkerCard from "@/components/commons/WorkerCard";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "@/components/commons/Loaders/Loader";
import Requirements from "@/components/commons/Requirements";
import { handleCall } from "@/constants/functions";
import EMPLOYER from "@/app/api/employer";
import ShowSkills from "@/components/commons/ShowSkills";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

interface ImageAsset {
  uri: string;
}

const ServiceDetails = () => {
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const { title, data }: any = useLocalSearchParams();
  const [booking, setBooking]: any = useState(JSON.parse(data));
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [isSelected, setIsSelected] = useState(
    booking?.selectedUsers?.find(
      (worker: any) => worker?._id === userDetails?._id
    ) || false
  );

  const mutationRemoveBookedUser = useMutation({
    mutationKey: ["removeBookedUser"],
    mutationFn: () =>
      EMPLOYER?.removeBookedWorker({ userId: booking?.worker?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("removedBookedWorkerSuccessfully"));
      console.log("Response while removing a booked worker - ", response);
    },
  });

  const mutationCancelBooking = useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: () => EMPLOYER?.cancelBooking({ bookingId: booking?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("bookingCancelledSuccessfully"));
      console.log("Response while cancelling a booking - ", response);
    },
  });

  const mutationCompleteBooking = useMutation({
    mutationKey: ["completBooking"],
    mutationFn: () => EMPLOYER?.completeBooking({ bookingId: booking?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("bookingCompletedSuccessfully"));
      console.log("Response while cancelling a booking - ", response);
    },
  });

  useEffect(() => {
    setIsSelected(
      booking?.selectedUsers?.find(
        (worker: any) => worker?._id === userDetails?._id
      ) || false
    );
  }, [booking]);

  const workersList =
    booking?.selectedUsers?.length > 0
      ? booking?.selectedUsers
      : [booking?.bookedWorker ?? ""];
  console.log("data---", workersList);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={title} left="back" right="notification" />
          ),
        }}
      />
      <StatusBar backgroundColor={Colors?.fourth} />
      <Loader
        loading={
          mutationCancelBooking?.isPending ||
          mutationCompleteBooking?.isPending ||
          mutationRemoveBookedUser?.isPending
        }
      />
      <ScrollView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <ImageSlider images={booking?.images} />

          <View style={styles.contentWrapper}>
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
                  onPress={handleCall}
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

            <CustomHeading baseFont={18} textAlign="left">
              {t(booking?.type)} - {t(booking?.subType)}
            </CustomHeading>
            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText textAlign="left">{booking?.address}</CustomText>
            </View>

            <View style={styles.listingLocationWrapper}>
              <Entypo
                name="calendar"
                size={14}
                color={Colors.primary}
                style={{ alignSelf: "center" }}
              />
              <CustomText textAlign="left">
                {t("startFrom")} {moment(booking?.startDate).format("LL")}
              </CustomText>
            </View>

            <Highlights service={booking} />

            <CustomText textAlign="left" baseFont={13}>
              {booking?.description}
            </CustomText>

            {booking && booking?.requirements?.length > 0 && (
              <Requirements type="full" requirements={booking?.requirements} />
            )}
          </View>

          {workersList?.length > 0 && (
            <View style={styles.workerListContainer}>
              <CustomHeading baseFont={18} textAlign="left">
                {t("selectedWorkers")}
              </CustomHeading>

              {workersList?.map((worker: any) => (
                <View key={worker._id} style={styles.workerCard}>
                  {/* Worker Image */}
                  <Image
                    source={{ uri: worker?.profilePicture }}
                    style={styles.workerImage}
                  />

                  {/* Worker Details */}
                  <View style={styles.workerInfo}>
                    <CustomHeading baseFont={16} textAlign="left">
                      {worker?.name}
                    </CustomHeading>
                    <ShowSkills userSkills={worker?.skills} />
                    <View style={styles.workerLocation}>
                      <Entypo
                        name="location-pin"
                        size={14}
                        color={Colors.primary}
                      />
                      <CustomText textAlign="left" style={styles.workerAddress}>
                        {worker?.address || "Address not found"}
                      </CustomText>
                    </View>
                    <Button
                      isPrimary={false}
                      title={t("removeFromBooking")}
                      onPress={() => mutationRemoveBookedUser.mutate()}
                      style={styles.removeButton}
                      bgColor={Colors?.danger}
                      borderColor={Colors?.danger}
                      textColor={Colors.danger}
                    />
                  </View>

                  {/* Remove Button */}
                </View>
              ))}
            </View>
          )}

          {booking && booking?.employer !== userDetails?._id && (
            <EmployerCard employer={booking?.employer} />
          )}
        </Animated.ScrollView>
      </ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <Button
          isPrimary={false}
          title={t("cancel")}
          onPress={() => mutationCancelBooking.mutate()}
          bgColor={Colors?.danger}
          borderColor={Colors?.danger}
          style={styles.cancelBtn}
          textStyle={{ color: Colors?.white }}
        />
        <Button
          isPrimary={false}
          title={t("completeBooking")}
          onPress={() => mutationCompleteBooking?.mutate()}
          style={styles.completeBtn}
          textStyle={{ color: Colors?.white }}
        />
      </Animated.View>
    </>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fourth,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: Colors.fourth,
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
  cancelBtn: {
    flex: 1,
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
  workerListContainer: {
    marginTop: 20,
    padding: 10,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    elevation: 2, // Light shadow for elevation
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: Colors.fourth,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  workerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  workerSkills: {
    fontSize: 14,
    color: Colors.gray,
  },
  workerLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  workerAddress: {
    fontSize: 12,
    color: Colors.secondary,
    marginLeft: 5,
  },
  removeButton: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginTop: 10,
  },
});
