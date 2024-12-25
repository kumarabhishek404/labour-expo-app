import { Dimensions, StyleSheet } from "react-native";
import React from "react";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { toast } from "@/app/hooks/toast";
import Button from "@/components/inputs/Button";
import Loader from "@/components/commons/Loader";
import {
  bookWorker,
  likeWorker,
  removeBookedWorker,
  unlikeWorker,
} from "../../api/workers";
import {
  bookMediator,
  likeMediator,
  removeBookedMediator,
  unlikeMediator,
} from "@/app/api/mediator";
import { likeEmployer, unlikeEmployer } from "@/app/api/employer";
import { t } from "@/utils/translationHelper";
import { sendJoiningRequest } from "@/app/api/requests";
import {
  activateUser,
  suspendUser,
  deleteUser,
  editUser,
} from "@/app/api/admin";

const { width } = Dimensions.get("window");

interface ButtonContainerProps {
  isLoading: boolean;
  user: any;
  refetch: any;
  isUserBooked: boolean;
  isUserLiked: boolean;
  isUserRequested: boolean;
}

const ButtonContainer = ({
  isLoading,
  user,
  refetch,
  isUserBooked,
  isUserLiked,
  isUserRequested,
}: ButtonContainerProps) => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const { role, type } = useGlobalSearchParams();

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

  const mutationBookWorker = useMutation({
    mutationKey: ["bookWorker", { id }],
    mutationFn: () => bookWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("workerBookedSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker", { id }],
    mutationFn: () => removeBookedWorker({ workerID: id }),
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
      console.log("Response while sending a request to worker - ", response);
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

  const mutationDeleteUser = useMutation({
    mutationKey: ["deleteUser", { id }],
    mutationFn: () => deleteUser({ userId: id }),
    onSuccess: () => {
      refetch();
      toast.success(t("userDeleted"));
    },
  });

  const handleLikeFunction = () => {
    if (role === "workers") mutationLikeWorker?.mutate();
    else if (role === "mediators") mutationLikeMediator?.mutate();
    else mutationLikeEmployer?.mutate();
  };

  const handleUnLikeFunction = () => {
    if (role === "workers") mutationUnLikeWorker?.mutate();
    else if (role === "mediators") mutationUnLikeMediator?.mutate();
    else mutationUnLikeEmployer?.mutate();
  };

  const handleBookFunction = () => {
    if (role === "workers") mutationBookWorker?.mutate();
    else if (role === "mediators") mutationBookMediator?.mutate();
    else mutationLikeWorker?.mutate();
  };

  const handleRemoveBookedFunction = () => {
    if (role === "workers") mutationRemoveBookedWorker?.mutate();
    else if (role === "mediators") mutationRemoveBookedMediator?.mutate();
    else mutationLikeWorker?.mutate();
  };

  const handleSendFunction = () => {
    mutationSendRequest?.mutate();
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
          mutationBookWorker?.isPending ||
          mutationRemoveBookedWorker?.isPending ||
          mutationBookMediator?.isPending ||
          mutationRemoveBookedMediator?.isPending ||
          mutationSendRequest?.isPending ||
          mutationActivateUser?.isPending ||
          mutationSuspendUser?.isPending ||
          mutationDeleteUser?.isPending
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
            title={isUserRequested ? t("alreadyAdded") : t("addInYourTeam")}
            onPress={() => handleSendFunction()}
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
                  onPress={() => mutationDeleteUser.mutate()}
                  style={styles.deleteButton}
                />
              </>
            )}

            {(user?.status === "SUSPENDED" ||
              user?.status === "PENDING" ||
              user?.status === "DISABLED") && (
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
                  onPress={() => mutationDeleteUser.mutate()}
                  style={styles.deleteButton}
                />
              </>
            )}
          </Animated.View>
        )}
      </Animated.View>
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
  footerBtn: {
    width: "48%",
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
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
});
