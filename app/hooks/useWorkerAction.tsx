import { useMutation } from "@tanstack/react-query";
import MEDIATOR from "@/app/api/mediator";
import ADMIN from "@/app/api/admin";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import USER from "../api/user";
import EMPLOYER from "../api/employer";

const useApiCalls = (id: any, refetch: any) => {
  const mutationLikeUser = useMutation({
    mutationKey: ["likeUser", { id }],
    mutationFn: () => USER?.likeUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("userAddedToFavourites"));
    },
  });

  const mutationUnLikeUser = useMutation({
    mutationKey: ["unlikeUser", { id }],
    mutationFn: () => USER?.unlikeUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("userRemovedFromFavourites"));
    },
  });

  const mutationCancelBookingRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: () => EMPLOYER?.cancelBookingRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker", { id }],
    mutationFn: () => EMPLOYER?.removeBookedWorker({ bookingID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("bookingCancelledWorker"));
    },
  });

  const mutationSendRequest = useMutation({
    mutationKey: ["sendRequest", { id }],
    mutationFn: () => MEDIATOR?.sendTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("requestSentSuccessfully"));
    },
  });

  const mutationActivateUser = useMutation({
    mutationKey: ["activateUser", { id }],
    mutationFn: () => ADMIN?.activateUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("userActivated"));
    },
  });

  const mutationSuspendUser = useMutation({
    mutationKey: ["suspendUser", { id }],
    mutationFn: () => ADMIN?.suspendUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("userSuspended"));
    },
  });

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelRequest"],
    mutationFn: () => MEDIATOR?.cancelTeamRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("requestCancelledSuccessfully"));
    },
  });

  const mutationRemoveMemberFromTeam = useMutation({
    mutationKey: ["removeMemberFromTeam", { id }],
    mutationFn: () => MEDIATOR?.removeMemberFromTeam({ memberID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.success(t("successfullyLeftFromTeam"));
    },
  });

  return {
    mutationLikeUser,
    mutationUnLikeUser,
    mutationCancelBookingRequest,
    mutationRemoveBookedWorker,
    mutationSendRequest,
    mutationActivateUser,
    mutationSuspendUser,
    mutationCancelRequest,
    mutationRemoveMemberFromTeam,
  };
};

export default useApiCalls;
