import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { toast } from "@/app/hooks/toast";
import Button from "@/components/inputs/Button";
import Loader from "@/components/commons/Loader";
import { likeWorker, unlikeWorker } from "../../api/workers";
import {
  bookMediator,
  likeMediator,
  removeBookedMediator,
  removeMemberFromTeam,
  unlikeMediator,
} from "@/app/api/mediator";
import { likeEmployer, unlikeEmployer } from "@/app/api/employer";
import { t } from "@/utils/translationHelper";
import {
  cancelJoiningRequest,
  leaveFromTeam,
  sendJoiningRequest,
} from "@/app/api/requests";
import { activateUser, suspendUser } from "@/app/api/admin";
import { deleteUserById } from "@/app/api/user";
import {
  addBookingRequest,
  cancelBooking,
  cancelBookingRequest,
  removeBookedWorker,
} from "@/app/api/booking";
import ModalComponent from "@/components/commons/Modal";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { Controller } from "react-hook-form";
import DropdownComponent from "@/components/inputs/Dropdown";
import { WORKTYPES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import AddBookingDetails from "./addBookingDetails";
const { width } = Dimensions.get("window");

interface ButtonContainerProps {
  isLoading: boolean;
  user: any;
  refetch: any;
  isUserBooked: boolean;
  isUserLiked: boolean;
  isUserRequested: boolean;
  isInYourTeam: boolean;
  isWorkerBookingRequested: boolean;
  isWorkerBooked: boolean;
}

const ButtonContainer = ({
  isLoading,
  user,
  refetch,
  isUserBooked,
  isUserLiked,
  isUserRequested,
  isInYourTeam,
  isWorkerBookingRequested,
  isWorkerBooked,
}: ButtonContainerProps) => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const { role, type } = useGlobalSearchParams();

  const [isAddBookingModal, setIsAddBookingModal] = useState(false);

  const mutationLikeWorker = useMutation({
    mutationKey: ["likeWorker", { id }],
    mutationFn: () => likeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("workerAddedToFavourites"));
    },
  });

  const mutationUnLikeWorker = useMutation({
    mutationKey: ["unlikeWorker", { id }],
    mutationFn: () => unlikeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("workerRemovedFromFavourites"));
    },
  });

  const mutationLikeMediator = useMutation({
    mutationKey: ["likeMediator", { id }],
    mutationFn: () => likeMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("mediatorAddedToFavourites"));
    },
  });

  const mutationUnLikeMediator = useMutation({
    mutationKey: ["unlikeMediator", { id }],
    mutationFn: () => unlikeMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("mediatorRemovedFromFavourites"));
    },
  });

  const mutationLikeEmployer = useMutation({
    mutationKey: ["likeEmployer", { id }],
    mutationFn: () => likeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("employerAddedToFavourites"));
    },
  });

  const mutationUnLikeEmployer = useMutation({
    mutationKey: ["unlikeEmployer", { id }],
    mutationFn: () => unlikeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("employerRemovedFromFavourites"));
    },
  });

  const mutationCancelBookingRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: () => cancelBookingRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker", { id }],
    mutationFn: () => removeBookedWorker({ bookingID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("bookingCancelledWorker"));
    },
  });

  const mutationBookMediator = useMutation({
    mutationKey: ["bookMediator", { id }],
    mutationFn: () => bookMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("workerBookedSuccessfully"));
    },
  });

  const mutationRemoveBookedMediator = useMutation({
    mutationKey: ["removeBookedMediator", { id }],
    mutationFn: () => removeBookedMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("mediatorBookingCancelled"));
    },
  });

  const mutationSendRequest = useMutation({
    mutationKey: ["sendRequest", { id }],
    mutationFn: () => sendJoiningRequest({ userId: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("requestSentSuccessfully"));
    },
    onError: (err) => {
      console.error("error while sending request to worker ", err);
    },
  });

  const mutationActivateUser = useMutation({
    mutationKey: ["activateUser", { id }],
    mutationFn: () => activateUser({ userId: id }),
    onSuccess: () => {
      refetch();
      toast.success(t("userActivated"));
    },
  });

  const mutationSuspendUser = useMutation({
    mutationKey: ["suspendUser", { id }],
    mutationFn: () => suspendUser({ userId: id }),
    onSuccess: () => {
      refetch();
      toast.success(t("userSuspended"));
    },
  });

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelRequest"],
    mutationFn: () => cancelJoiningRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      toast.success(t("requestCancelledSuccessfully"));
    },
    onError: (err) => {
      console.error("error while cancelling request to worker ", err);
    },
  });

  const mutationRemoveMemberFromTeam = useMutation({
    mutationKey: ["removeMemberFromTeam", { id }],
    mutationFn: () => removeMemberFromTeam({ memberID: id }),
    onSuccess: () => {
      refetch();
      toast.success(t("successfullyLeftFromTeam"));
    },
    onError: (err) => {
      console.error("error while leaving from team ", err);
    },
  });

  // const mutationDeleteUser = useMutation({
  //   mutationKey: ["deleteUser", { id }],
  //   mutationFn: () => deleteUserById(id),
  //   onSuccess: () => {
  //     refetch();
  //     toast.success(t("userDeleted"));
  //   },
  // });

  const handleLikeFunction = () => {
    if (role === "worker") mutationLikeWorker?.mutate();
    else if (role === "mediator") mutationLikeMediator?.mutate();
    else mutationLikeEmployer?.mutate();
  };

  const handleUnLikeFunction = () => {
    if (role === "worker") mutationUnLikeWorker?.mutate();
    else if (role === "mediator") mutationUnLikeMediator?.mutate();
    else mutationUnLikeEmployer?.mutate();
  };

  return (
    <>
      <Loader
        loading={
          isLoading ||
          mutationLikeWorker?.isPending ||
          mutationUnLikeWorker?.isPending ||
          mutationLikeMediator?.isPending ||
          mutationUnLikeMediator?.isPending ||
          mutationLikeEmployer?.isPending ||
          mutationUnLikeEmployer?.isPending ||
          mutationCancelBookingRequest?.isPending ||
          mutationRemoveBookedWorker?.isPending ||
          mutationBookMediator?.isPending ||
          mutationRemoveBookedMediator?.isPending ||
          mutationSendRequest?.isPending ||
          mutationActivateUser?.isPending ||
          mutationSuspendUser?.isPending ||
          mutationCancelRequest?.isPending ||
          mutationRemoveMemberFromTeam?.isPending
        }
      />
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {type === "applicant" && (
          <Button
            isPrimary={true}
            title={isUserBooked ? t("selected") : t("select")}
            onPress={() => {}}
          />
        )}
        {userDetails?.role === "MEDIATOR" && (
          <Button
            isPrimary={true}
            bgColor={
              isInYourTeam || isUserRequested ? Colors.danger : Colors.primary
            }
            title={
              isInYourTeam
                ? t("leaveFromTeam")
                : isUserRequested
                ? t("removeRequest")
                : t("addInYourTeam")
            }
            onPress={() => {
              if (isInYourTeam) {
                mutationRemoveMemberFromTeam?.mutate();
              } else if (isUserRequested) {
                mutationCancelRequest?.mutate();
              } else {
                mutationSendRequest?.mutate();
              }
            }}
          />
        )}

        {userDetails?.role === "EMPLOYER" && (
          <Button
            isPrimary={true}
            bgColor={
              isInYourTeam || isUserRequested ? Colors.danger : Colors.primary
            }
            title={
              isWorkerBooked
                ? t("cancelBooking")
                : isWorkerBookingRequested
                ? t("cancelBookingRequest")
                : user?.role === "MEDIATOR"
                ? t("bookMediator")
                : t("bookWorker")
            }
            onPress={() => {
              if (isWorkerBooked) {
                mutationRemoveBookedWorker?.mutate();
              } else if (isWorkerBookingRequested) {
                mutationCancelBookingRequest?.mutate();
              } else {
                setIsAddBookingModal(true);
              }
            }}
          />
        )}

        {userDetails?.role !== "ADMIN" && (
          <Button
            isPrimary={true}
            title={isUserLiked ? t("unlike") : t("like")}
            onPress={() =>
              isUserLiked ? handleUnLikeFunction() : handleLikeFunction()
            }
          />
        )}
        {userDetails?.role === "ADMIN" && (
          <Animated.View style={styles.adminActions}>
            {user?.status === "ACTIVE" && (
              <>
                <Button
                  isPrimary={true}
                  title={t("suspend")}
                  onPress={() => mutationSuspendUser.mutate()}
                  style={styles.adminButton}
                />
                <Button
                  isPrimary={false}
                  title={t("edit")}
                  onPress={() => {
                    /* Navigate to edit screen */
                  }}
                />
                <Button
                  isPrimary={true}
                  title={t("delete")}
                  onPress={() => {}}
                  style={styles.deleteButton}
                />
              </>
            )}

            {user?.status !== "ACTIVE" && (
              <>
                <Button
                  isPrimary={true}
                  title={t("activate")}
                  onPress={() => mutationActivateUser.mutate()}
                  style={styles.activateButton}
                />
                <Button
                  isPrimary={false}
                  title={t("edit")}
                  onPress={() => {
                    /* Navigate to edit screen */
                  }}
                  // style={styles.adminButton}
                />
                <Button
                  isPrimary={true}
                  title={t("delete")}
                  onPress={() => {}}
                  style={styles.deleteButton}
                />
              </>
            )}
          </Animated.View>
        )}
      </Animated.View>

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
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    marginRight: 20,
    paddingHorizontal: 10,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  footerAddRequestBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  selectBtn: {
    width: "48%",
    backgroundColor: Colors?.secondaryText,
    borderColor: Colors?.secondaryText,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  bookBtn: {
    width: "48%",
    backgroundColor: Colors?.primary,
    borderColor: Colors?.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  adminActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  activateButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  adminButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
});
