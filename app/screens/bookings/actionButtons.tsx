import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import Animated, { SlideInDown } from "react-native-reanimated";
import { t } from "@/utils/translationHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "@/components/commons/Loaders/Loader";
import ModalComponent from "@/components/commons/Modal";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import WORKER from "@/app/api/workers";
import EMPLOYER from "@/app/api/employer";
import { router } from "expo-router";

interface ServiceActionButtonsProps {
  booking: any;
  category: string;
  userDetails: any;
  isAdmin: boolean;
  id: string;
  refetch: () => void;
  refreshUser: () => void;
  setModalVisible: (modal: boolean) => void;
  setIsCompleteModalVisible: (modal: boolean) => void;
  isCompleteModalVisible: boolean;
  modalVisible: boolean;
}

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const BookingActionButtons = ({
  category,
  booking,
  userDetails,
  isAdmin,
  id,
  refetch,
  refreshUser,
  setModalVisible,
  setIsCompleteModalVisible,
  isCompleteModalVisible,
  modalVisible,
}: ServiceActionButtonsProps) => {
  const queryClient = useQueryClient();

  const mutationCancelBooking = useMutation({
    mutationKey: ["cancelServiceByWorkerAfterSelection", { id }],
    mutationFn: () => WORKER?.cancelBooking({ bookingId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      TOAST?.success(t("yourSelectionCancelledSuccessfully"));
      console.log("Response while unapplying in the booking - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the booking ", err);
    },
  });

  const mutationCompleteService = useMutation({
    mutationKey: ["completeService", { id }],
    mutationFn: () => EMPLOYER?.completeBooking({ serviceId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["bookedWorkers"] });
      TOAST?.success(t("serviceCompletedSuccessfully"));
      console.log("Response while completing a booking - ", response);
    },
    onError: (err) => {
      console.error("error while completing the booking ", err);
    },
  });

  const mutationCancelBookingByEmployer = useMutation({
    mutationKey: ["deleteService", { id }],
    mutationFn: () => EMPLOYER?.cancelBooking(id),
    onSuccess: async (response) => {
      setModalVisible(false);
      await refetch();
      await refreshUser();
      console.log("Response while deleting a booking - ", response);
    },
    onError: (err) => {
      console.error("error while deleting a booking ", err);
    },
  });

  const mutationCancelBookingRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: (id: string) => EMPLOYER?.cancelBookingRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      router?.back();
      TOAST?.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationAcceptBookingRequest = useMutation({
    mutationKey: ["acceptBookingRequest"],
    mutationFn: (id) => WORKER?.acceptBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetch();
      router?.back();
      TOAST?.success(t("bookingRequestAcceptedSuccessfully"));
      console.log("Response while accepting a request - ", response);
    },
  });

  const mutationRejectBookingRequest = useMutation({
    mutationKey: ["rejectBookingRequest"],
    mutationFn: (id) => WORKER?.rejectBookingRequest({ invitationId: id }),
    onSuccess: (response) => {
      refetch();
      router?.back();
      TOAST?.success(t("bookingRequestRejectedSuccessfully"));
      console.log("Response while rejecting request - ", response);
    },
  });

  const handleDelete = () => {
    mutationCancelBookingByEmployer.mutate();
  };

  const renderDirectBookingButtons = () => {
    if (!booking) return null;

    switch (true) {
      case category === "recievedRequests":
        return (
          <>
            <Button
              isPrimary={true}
              title={t("reject")}
              bgColor={Colors?.danger}
              borderColor={Colors?.danger}
              style={{ width: "40%" }}
              onPress={() => mutationRejectBookingRequest?.mutate(booking?._id)}
            />
            <Button
              isPrimary={true}
              title={t("acceptBookingRequest")}
              bgColor={Colors?.success}
              borderColor={Colors?.success}
              style={{ flex: 1 }}
              onPress={() => mutationAcceptBookingRequest?.mutate(booking?._id)}
            />
          </>
        );

      case category === "sentRequests":
        return (
          <Button
            isPrimary={true}
            title={t("cancelBookingRequest")}
            bgColor={Colors?.danger}
            borderColor={Colors?.danger}
            style={{ flex: 1 }}
            onPress={() =>
              mutationCancelBookingRequest.mutate(booking?.bookedWorker?._id)
            }
          />
        );

      case booking.employer?._id !== userDetails?._id &&
        (booking.status === "HIRING" || booking.status === "PENDING"):
        return (
          <Button
            isPrimary={true}
            title={t("cancelBooking")}
            bgColor={Colors?.danger}
            borderColor={Colors?.danger}
            style={{ flex: 1 }}
            onPress={mutationCancelBooking.mutate}
          />
        );

      case booking.employer?._id === userDetails?._id &&
        booking.status !== "CANCELLED" &&
        booking.status !== "COMPLETED":
        return (
          <>
            <Button
              isPrimary={true}
              title={t("cancelBooking")}
              onPress={mutationCancelBookingByEmployer.mutate}
              style={styles.deleteBtn}
            />
            <Button
              isPrimary={true}
              title={t("completeBooking")}
              onPress={mutationCompleteService.mutate}
              style={styles.completeBtn}
              textStyle={{ color: Colors?.white }}
            />
          </>
        );

      default:
        return null;
    }
  };

  const deleteModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading baseFont={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading baseFont={14}>{t("wantToDeleteService")}</CustomHeading>
        <CustomText>{t("irreversibleAction")}</CustomText>
      </View>
    );
  };

  const completeServiceModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading baseFont={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading baseFont={14}>
          {t("wantToCompleteService")}
        </CustomHeading>
        <CustomText>{t("restoreSerivceText")}</CustomText>
      </View>
    );
  };

  return (
    <>
      <Loader
        loading={
          mutationCompleteService?.isPending ||
          mutationCancelBookingByEmployer?.isPending ||
          mutationCancelBooking?.isPending ||
          mutationCancelBookingRequest?.isPending ||
          mutationAcceptBookingRequest?.isPending ||
          mutationRejectBookingRequest?.isPending
        }
      />
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {renderDirectBookingButtons()}
      </Animated.View>

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
    </>
  );
};

export default BookingActionButtons;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    width: "35%",
    alignItems: "center",
  },
  restoreBtn: {
    width: "50%",
    alignItems: "center",
  },
  deleteBtn: {
    width: "48%",
    backgroundColor: Colors?.danger,
    borderColor: Colors?.danger,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  completeBtn: {
    // width: "48%",
    flex: 1,
    backgroundColor: Colors?.primary,
    borderColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
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
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
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
    paddingVertical: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
