import { Dimensions, StyleSheet } from "react-native";
import React from "react";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import Colors from "@/constants/Colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import {
  bookWorker,
  likeWorker,
  removeBookedWorker,
  unlikeWorker,
} from "../../api/workers";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { sendJoiningRequest } from "@/app/api/requests";
import { toast } from "@/app/hooks/toast";
import Button from "@/components/inputs/Button";
import {
  bookMediator,
  likeMediator,
  removeBookedMediator,
  unlikeMediator,
} from "@/app/api/mediator";
import { likeEmployer, unlikeEmployer } from "@/app/api/employer";
import Loader from "@/components/commons/Loader";

const { width } = Dimensions.get("window");

interface ButtonContainerProps {
  isLoading: boolean;
  worker: any;
  refetch: any;
  isWorkerBooked: boolean;
  isWorkerLiked: boolean;
}

const ButtonContainer = ({
  isLoading,
  worker,
  refetch,
  isWorkerBooked,
  isWorkerLiked,
}: ButtonContainerProps) => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const { role, type } = useGlobalSearchParams();

  const mutationLikeWorker = useMutation({
    mutationKey: ["likeWorker", { id }],
    mutationFn: () => likeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker added in favourites");
      console.log("Response while liking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while liking the worker ", err);
    },
  });

  const mutationUnLikeWorker = useMutation({
    mutationKey: ["unlikeService", { id }],
    mutationFn: () => unlikeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker removed from favourites");
      console.log("Response while unliking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the worker ", err);
    },
  });

  const mutationLikeMediator = useMutation({
    mutationKey: ["likeMediator", { id }],
    mutationFn: () => likeMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Mediator added in favourites");
      console.log("Response while liking a mediator - ", response);
    },
    onError: (err) => {
      console.error("error while liking the mediator ", err);
    },
  });

  const mutationUnLikeMediator = useMutation({
    mutationKey: ["unlikeMediator", { id }],
    mutationFn: () => unlikeMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Mediator removed from favourites");
      console.log("Response while unliking a mediator - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the mediator ", err);
    },
  });

  const mutationLikeEmployer = useMutation({
    mutationKey: ["likeEmployer", { id }],
    mutationFn: () => likeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Employer added in favourites");
      console.log("Response while liking a employer - ", response);
    },
    onError: (err) => {
      console.error("error while liking the employer ", err);
    },
  });

  const mutationUnLikeEmployer = useMutation({
    mutationKey: ["unlikeEmployer", { id }],
    mutationFn: () => unlikeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Employer removed from favourites");
      console.log("Response while unliking a employer - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the employer ", err);
    },
  });

  const mutationBookWorker = useMutation({
    mutationKey: ["bookWorker", { id }],
    mutationFn: () => bookWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker booked in successfully");
      console.log("Response while liking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while booking the worker ", err);
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedService", { id }],
    mutationFn: () => removeBookedWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Successfully cancel booking of the worker");
      console.log(
        "Response while canceling booking of this worker - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while canceling the booking of the worker ", err);
    },
  });

  const mutationBookMediator = useMutation({
    mutationKey: ["bookMediator", { id }],
    mutationFn: () => bookMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker booked in successfully");
      console.log("Response while liking a mediator - ", response);
    },
    onError: (err) => {
      console.error("error while booking the mediator ", err);
    },
  });

  const mutationRemoveBookedMediator = useMutation({
    mutationKey: ["removeBookedMediator", { id }],
    mutationFn: () => removeBookedMediator({ mediatorID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Successfully cancel booking of the mediator");
      console.log(
        "Response while canceling booking of this mediator - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while canceling the booking of the mediator ", err);
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

  console.log("roleo   --", role);

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
          mutationSendRequest?.isPending ||
          mutationBookWorker?.isPending ||
          mutationRemoveBookedWorker?.isPending
        }
      />
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {type === "applicant" && (
          <Button
            isPrimary={true}
            title={isWorkerBooked ? "Selected" : "Select"}
            onPress={() => {}}
            style={styles?.selectBtn}
          />
        )}

        {userDetails?.role === "EMPLOYER" &&
          (!type || type !== "applicant") && (
            <Button
              isPrimary={true}
              title={isWorkerBooked ? "Already Booked" : "Book Now"}
              onPress={() =>
                isWorkerBooked
                  ? handleRemoveBookedFunction()
                  : handleBookFunction()
              }
              style={styles?.bookBtn}
            />
          )}

        {userDetails?.role === "MEDIATOR" && (
          <Button
            isPrimary={true}
            title={isWorkerBooked ? "Already Added" : "Add In Your Team"}
            onPress={() => handleSendFunction()}
            style={[styles.footerBtn, styles.footerAddRequestBtn]}
          />
        )}
        <Button
          isPrimary={true}
          title={isWorkerLiked ? "Unlike" : "Like"}
          onPress={() =>
            isWorkerLiked ? handleUnLikeFunction() : handleLikeFunction()
          }
          style={styles.footerBtn}
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
