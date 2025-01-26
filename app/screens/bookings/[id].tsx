import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
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
import BOOKING from "@/app/api/booking";
import TOAST from "@/app/hooks/toast";
import Loader from "@/components/commons/Loader";

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
    userDetails?.role === "MEDIATOR"
      ? booking?.selectedMediators?.find(
          (mediator: any) => mediator?.mediator?._id === userDetails?._id
        )
      : booking?.selectedWorkers?.find(
          (worker: any) => worker?._id === userDetails?._id
        ) || false
  );
  const [isAdmin] = useState(userDetails?.role === "ADMIN");

  const mutationRemoveBookedUser = useMutation({
    mutationKey: ["removeBookedUser"],
    mutationFn: () =>
      BOOKING?.removeBookedWorker({ userId: booking?.worker?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("removedBookedWorkerSuccessfully"));
      console.log("Response while removing a booked worker - ", response);
    },
  });

  const mutationCancelBooking = useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: () => BOOKING?.cancelBooking({ bookingId: booking?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("bookingCancelledSuccessfully"));
      console.log("Response while cancelling a booking - ", response);
    },
  });

  const mutationCompleteBooking = useMutation({
    mutationKey: ["completBooking"],
    mutationFn: () => BOOKING?.completeBooking({ bookingId: booking?._id }),
    onSuccess: async (response) => {
      TOAST?.showToast?.success(t("bookingCompletedSuccessfully"));
      console.log("Response while cancelling a booking - ", response);
    },
  });

  console.log("data---", JSON.parse(data)?._id, booking?.worker);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={title} left="back" right="notification" />
          ),
        }}
      />

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
          {booking && booking?.images?.length > 0 && (
            <ImageSlider images={booking?.images} />
          )}

          <View style={styles.contentWrapper}>
            <CustomHeading fontSize={18} textAlign="left">
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

            {booking?.description && (
              <CustomText textAlign="left" fontSize={13}>
                {booking?.description}
              </CustomText>
            )}
          </View>
          {booking && booking?.user && <WorkerCard worker={booking?.user} />}
          {booking && booking?.employer && (
            <EmployerCard employer={booking?.user} />
          )}
        </Animated.ScrollView>
      </ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <Button
          isPrimary={false}
          title={t("cancel")}
          onPress={() =>
            userDetails?.role === "EMPLOYER"
              ? mutationRemoveBookedUser.mutate()
              : mutationCancelBooking.mutate()
          }
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
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    paddingHorizontal: 10,
    paddingTop: 20,
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
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.tertiery,
    borderColor: Colors.tertiery,
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
