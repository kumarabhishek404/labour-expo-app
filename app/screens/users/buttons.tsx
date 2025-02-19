import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import Loader from "@/components/commons/Loaders/Loader";
import Button from "@/components/inputs/Button";
import AddBookingDetails from "./addBookingDetails";
import { t } from "@/utils/translationHelper";
import useApiCalls from "@/app/hooks/useWorkerAction";

const { width } = Dimensions.get("window");

const ButtonContainer = ({
  isLoading,
  user,
  refetch,
  isUserBooked,
  isUserLiked,
  isUserRequestedToJoinTeam,
  isInYourTeam,
  isWorkerBookingRequested,
  isWorkerBooked,
}: any) => {
  const { id } = useLocalSearchParams();
  const [isAddBookingModal, setIsAddBookingModal] = useState(false);

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

  return (
    <>
      <Loader
        loading={
          isLoading ||
          mutationLikeUser.isPending ||
          mutationUnLikeUser.isPending ||
          mutationCancelBookingRequest.isPending ||
          mutationRemoveBookedWorker.isPending ||
          mutationSendRequest.isPending ||
          mutationActivateUser.isPending ||
          mutationSuspendUser.isPending ||
          mutationCancelRequest.isPending ||
          mutationRemoveMemberFromTeam.isPending
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
              setIsAddBookingModal(true);
            }
          }}
          style={styles.footerBtn}
        />
      </Animated.View>

      {/* Add Booking Modal */}
      <AddBookingDetails
        refetch={refetch}
        id={id}
        role={user?.role}
        isAddBookingModal={isAddBookingModal}
        setIsAddBookingModal={setIsAddBookingModal}
      />
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
