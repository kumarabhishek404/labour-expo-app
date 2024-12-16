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

const { width } = Dimensions.get("window");

interface ButtonContainerProps {
  isLoading: boolean;
  worker: any;
  refetch: any;
  isWorkerBooked: boolean;
  isWorkerLiked: boolean;
  isWorkerRequested: boolean;
}

const ButtonContainer = ({
  isLoading,
  worker,
  refetch,
  isWorkerBooked,
  isWorkerLiked,
  isWorkerRequested,
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
          mutationSendRequest?.isPending
        }
      />
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {type === "applicant" && (
          <Button
            isPrimary={true}
            title={isWorkerBooked ? t("selected") : t("select")}
            onPress={() => {}}
          />
        )}
        {userDetails?.role === "EMPLOYER" &&
          (!type || type !== "applicant") && (
            <Button
              isPrimary={true}
              title={isWorkerBooked ? t("alreadyBooked") : t("bookNow")}
              onPress={() =>
                isWorkerBooked
                  ? handleRemoveBookedFunction()
                  : handleBookFunction()
              }
            />
          )}
        {userDetails?.role === "MEDIATOR" && (
          <Button
            isPrimary={true}
            title={isWorkerRequested ? t("alreadyAdded") : t("addInYourTeam")}
            onPress={() => handleSendFunction()}
          />
        )}
        <Button
          isPrimary={true}
          title={isWorkerLiked ? t("unlike") : t("like")}
          onPress={() =>
            isWorkerLiked ? handleUnLikeFunction() : handleLikeFunction()
          }
        />
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
});
