import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import Loader from "@/components/commons/Loaders/Loader";
import Button from "@/components/inputs/Button";
import AddBookingDetails from "./addBookingDetails";
import { t } from "@/utils/translationHelper";
import useApiCalls from "@/app/hooks/useWorkerAction";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import EMPLOYER from "@/app/api/employer";
import TOAST from "@/app/hooks/toast";
import { useForm } from "react-hook-form";

const { width } = Dimensions.get("window");

const ButtonContainer = ({
  user,
  refetch,
  isUserBooked,
  isUserLiked,
  isUserRequestedToJoinTeam,
  isInYourTeam,
  isWorkerBookingRequested,
  isWorkerBooked,
}: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      subType: "",
      address: userDetails?.address || "",
      location: {},
      startDate: new Date(),
      duration: 0,
      noOfWorkers: 0,
      description: "",
      facilities: {
        food: false,
        living: false,
        esi_pf: false,
        travelling: false,
      },
    },
  });
  const setDrawerState: any = useSetAtom(Atoms?.SideDrawerAtom);
  const { id } = useLocalSearchParams();

  // Using the custom hook for all API calls
  const {
    mutationLikeUser,
    mutationUnLikeUser,
    mutationCancelBookingRequest,
    mutationRemoveBookedWorker,
    mutationSendRequest,
    mutationActivateUser,
    mutationSuspendUser,
    mutationCancelRequest,
    mutationRemoveMemberFromTeam,
  } = useApiCalls(id, refetch);

  const mutationAddBookingRequest = useMutation({
    mutationKey: ["addBookingRequest"],
    mutationFn: (payload: any) => EMPLOYER?.addBookingRequest(payload),
    onSuccess: (response) => {
      setDrawerState({
        visible: false,
      }); // Close the drawer after success
      refetch();
      TOAST?.success(t("bookRequestSentSuccessfully"));
    },
  });

  const handleSubmitBooking = async (data: any) => {
    console.log("handleSubmitBooking", data);

    if (
      !data?.type ||
      !data?.subType ||
      !data?.address ||
      !data?.startDate ||
      !data?.duration
    ) {
      throw new Error("Required fields are missing");
    }

    const formData: any = new FormData();

    formData.append("requiredNumberOfWorkers", data?.noOfWorkers);
    formData.append("userId", id);
    formData.append("type", data?.type);
    formData.append("subType", data?.subType);
    formData.append("duration", data?.duration);
    formData.append("description", data?.description);
    formData.append("address", data?.address);
    formData.append("location", JSON.stringify(data?.location || {}));
    formData.append("startDate", moment(data?.startDate).format("YYYY-MM-DD"));
    formData.append("facilities", JSON.stringify(data?.facilities));

    console.log("Form data --", formData);

    const response: any = mutationAddBookingRequest?.mutate(formData);
    return response?.data;
  };

  useEffect(() => {
    if (watch("type")) {
      setDrawerState((prevState: any) => ({
        ...prevState, // Preserve existing drawer state
        visible: true,
        title: "addBookingDetails",
        content: () => (
          <AddBookingDetails
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
          />
        ),
        primaryButton: {
          title: "addBookingDetails",
          action: handleSubmit(handleSubmitBooking),
        },
        secondaryButton: {
          title: "cancel",
          action: () => setDrawerState({ visible: false }),
        },
      }));
    }
  }, [watch("type"), watch("facilities")]); // ✅ Re-renders drawer when 'type' and 'facilities changes

  const handleAddBookingDetails = () => {
    setDrawerState({
      visible: true,
      title: "addBookingDetails",
      content: () => (
        <AddBookingDetails
          control={control}
          setValue={setValue}
          errors={errors}
          watch={watch}
        />
      ),
      primaryButton: {
        title: "addBookingDetails",
        action: handleSubmit(handleSubmitBooking),
      },
      secondaryButton: {
        title: "cancel",
        action: () => setDrawerState({ visible: false }),
      },
    });
  };

  return (
    <>
      <Loader
        loading={
          mutationLikeUser.isPending ||
          mutationUnLikeUser.isPending ||
          mutationCancelBookingRequest.isPending ||
          mutationRemoveBookedWorker.isPending ||
          mutationSendRequest.isPending ||
          mutationActivateUser.isPending ||
          mutationSuspendUser.isPending ||
          mutationCancelRequest.isPending ||
          mutationRemoveMemberFromTeam.isPending ||
          mutationAddBookingRequest?.isPending
        }
      />

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {/* Button for "select" or "selected" */}
        {user?.type === "applicant" && (
          <Button
            isPrimary={true}
            title={isUserBooked ? t("selected") : t("select")}
            onPress={() => {}}
          />
        )}

        {/* Button for team related actions */}
        <Button
          isPrimary={true}
          bgColor={
            isInYourTeam || isUserRequestedToJoinTeam
              ? Colors.danger
              : Colors.primary
          }
          borderColor={
            isInYourTeam || isUserRequestedToJoinTeam
              ? Colors.danger
              : Colors.primary
          }
          style={styles.footerFirstBtn}
          title={
            isInYourTeam
              ? t("leaveFromTeam")
              : isUserRequestedToJoinTeam
              ? t("removeTeamJoingRequest")
              : t("addInYourTeam")
          }
          onPress={() => {
            if (isInYourTeam) {
              mutationRemoveMemberFromTeam.mutate();
            } else if (isUserRequestedToJoinTeam) {
              mutationCancelRequest.mutate();
            } else {
              mutationSendRequest.mutate();
            }
          }}
        />

        {/* Button for liking/unliking */}
        <Button
          isPrimary={true}
          bgColor={isUserLiked ? Colors.danger : Colors.primary}
          borderColor={isUserLiked ? Colors.danger : Colors.primary}
          title={isUserLiked ? t("removeFromSaved") : t("save")}
          style={styles.saveServiceBtn}
          onPress={() =>
            isUserLiked
              ? mutationUnLikeUser.mutate()
              : mutationLikeUser.mutate()
          }
        />

        {/* Button for booking related actions */}
        <Button
          isPrimary={true}
          bgColor={
            isWorkerBooked || isWorkerBookingRequested
              ? Colors.danger
              : Colors.primary
          }
          borderColor={
            isWorkerBooked || isWorkerBookingRequested
              ? Colors.danger
              : Colors.primary
          }
          title={
            isWorkerBooked
              ? t("cancelBooking")
              : isWorkerBookingRequested
              ? t("cancelBookingRequest")
              : t("bookWorker")
          }
          onPress={() => {
            if (isWorkerBooked) {
              mutationRemoveBookedWorker.mutate();
            } else if (isWorkerBookingRequested) {
              mutationCancelBookingRequest.mutate();
            } else {
              handleAddBookingDetails();
              // setIsAddBookingModal(true);
            }
          }}
          style={styles.footerBtn}
        />
      </Animated.View>

      {/* Add Booking Modal */}
      {/* <AddBookingDetails
        refetch={refetch}
        id={id}
        role={user?.role}
        isAddBookingModal={isAddBookingModal}
        setIsAddBookingModal={setIsAddBookingModal}
      /> */}
    </>
  );
};

export default ButtonContainer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ Allows buttons to wrap if needed
    justifyContent: "space-evenly", // ✅ Ensures even spacing
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
    backgroundColor: "transparent", // Optional for visibility
  },
  footerFirstBtn: {
    flex: 1, // ✅ Ensures button takes available space
    minWidth: "40%", // ✅ Ensures it doesn't shrink too much
  },
  footerBtn: {
    flex: 1, // ✅ Ensures button takes available space
    minWidth: "30%", // ✅ Allows buttons to fit in a row
  },
  saveServiceBtn: {
    minWidth: "30%",
  },
});
