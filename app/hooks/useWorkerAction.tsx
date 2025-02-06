import { useMutation } from "@tanstack/react-query";
import WORKER from "@/app/api/workers";
import MEDIATOR from "@/app/api/mediator";
import EMPLOYER from "@/app/api/employer";
import REQUEST from "@/app/api/requests";
import BOOKING from "@/app/api/booking";
import ADMIN from "@/app/api/admin";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";

const useApiCalls = (id: any, refetch: any) => {
  const mutationLikeWorker = useMutation({
    mutationKey: ["likeWorker", { id }],
    mutationFn: () => WORKER?.likeWorker({ workerID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("workerAddedToFavourites"));
    },
  });

  const mutationUnLikeWorker = useMutation({
    mutationKey: ["unlikeWorker", { id }],
    mutationFn: () => WORKER?.unlikeWorker({ workerID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("workerRemovedFromFavourites"));
    },
  });

  const mutationLikeMediator = useMutation({
    mutationKey: ["likeMediator", { id }],
    mutationFn: () => MEDIATOR?.likeMediator({ mediatorID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("mediatorAddedToFavourites"));
    },
  });

  const mutationUnLikeMediator = useMutation({
    mutationKey: ["unlikeMediator", { id }],
    mutationFn: () => MEDIATOR?.unlikeMediator({ mediatorID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("mediatorRemovedFromFavourites"));
    },
  });

  const mutationLikeEmployer = useMutation({
    mutationKey: ["likeEmployer", { id }],
    mutationFn: () => EMPLOYER?.likeEmployer({ employerID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("employerAddedToFavourites"));
    },
  });

  const mutationUnLikeEmployer = useMutation({
    mutationKey: ["unlikeEmployer", { id }],
    mutationFn: () => EMPLOYER?.unlikeEmployer({ employerID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("employerRemovedFromFavourites"));
    },
  });

  const mutationCancelBookingRequest = useMutation({
    mutationKey: ["cancelBookingRequest"],
    mutationFn: () => BOOKING?.cancelBookingRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("bookingRequestCancelledSuccessfully"));
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedWorker", { id }],
    mutationFn: () => BOOKING?.removeBookedWorker({ bookingID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("bookingCancelledWorker"));
    },
  });

  const mutationBookMediator = useMutation({
    mutationKey: ["bookMediator", { id }],
    mutationFn: () => MEDIATOR?.bookMediator({ mediatorID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("workerBookedSuccessfully"));
    },
  });

  const mutationRemoveBookedMediator = useMutation({
    mutationKey: ["removeBookedMediator", { id }],
    mutationFn: () => MEDIATOR?.removeBookedMediator({ mediatorID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("mediatorBookingCancelled"));
    },
  });

  const mutationSendRequest = useMutation({
    mutationKey: ["sendRequest", { id }],
    mutationFn: () => REQUEST?.sendJoiningRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("requestSentSuccessfully"));
    },
  });

  const mutationActivateUser = useMutation({
    mutationKey: ["activateUser", { id }],
    mutationFn: () => ADMIN?.activateUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("userActivated"));
    },
  });

  const mutationSuspendUser = useMutation({
    mutationKey: ["suspendUser", { id }],
    mutationFn: () => ADMIN?.suspendUser({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("userSuspended"));
    },
  });

  const mutationCancelRequest = useMutation({
    mutationKey: ["cancelRequest"],
    mutationFn: () => REQUEST?.cancelJoiningRequest({ userId: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("requestCancelledSuccessfully"));
    },
  });

  const mutationRemoveMemberFromTeam = useMutation({
    mutationKey: ["removeMemberFromTeam", { id }],
    mutationFn: () => MEDIATOR?.removeMemberFromTeam({ memberID: id }),
    onSuccess: () => {
      refetch();
      TOAST?.showToast?.success(t("successfullyLeftFromTeam"));
    },
  });

  return {
    mutationLikeWorker,
    mutationUnLikeWorker,
    mutationLikeMediator,
    mutationUnLikeMediator,
    mutationLikeEmployer,
    mutationUnLikeEmployer,
    mutationCancelBookingRequest,
    mutationRemoveBookedWorker,
    mutationBookMediator,
    mutationRemoveBookedMediator,
    mutationSendRequest,
    mutationActivateUser,
    mutationSuspendUser,
    mutationCancelRequest,
    mutationRemoveMemberFromTeam,
  };
};

export default useApiCalls;
