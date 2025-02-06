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
  } = useApiCalls(id, refetch);

  return (
    <>
      <Loader
        loading={
          isLoading ||
          mutationLikeWorker.isPending ||
          mutationUnLikeWorker.isPending ||
          mutationLikeMediator.isPending ||
          mutationUnLikeMediator.isPending ||
          mutationLikeEmployer.isPending ||
          mutationUnLikeEmployer.isPending ||
          mutationCancelBookingRequest.isPending ||
          mutationRemoveBookedWorker.isPending ||
          mutationBookMediator.isPending ||
          mutationRemoveBookedMediator.isPending ||
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
              ? t("removeRequest")
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
        />

        {/* Button for liking/unliking */}
        <Button
          isPrimary={true}
          title={isUserLiked ? t("unlike") : t("like")}
          style={styles.footerBtn}
          onPress={() =>
            isUserLiked
              ? mutationUnLikeWorker.mutate()
              : mutationLikeWorker.mutate()
          }
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
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerFirstBtn: {
    width: "50%",
  },
  footerBtn: {
    width: "25%",
    backgroundColor: Colors.tertiery,
    borderColor: Colors.tertiery,
    alignItems: "center",
  },
});

// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
// import Colors from "@/constants/Colors";
// import Animated, { SlideInDown } from "react-native-reanimated";
// import { useMutation } from "@tanstack/react-query";
// import { useAtomValue } from "jotai";
// import Atoms from "@/app/AtomStore";
// import TOAST from "@/app/hooks/toast";
// import Button from "@/components/inputs/Button";
// import Loader from "@/components/commons/Loaders/Loader";
// import { t } from "@/utils/translationHelper";
// import WORKER from "../../api/workers";
// import MEDIATOR from "@/app/api/mediator";
// import EMPLOYER from "@/app/api/employer";
// import REQUEST from "@/app/api/requests";
// import ADMIN from "@/app/api/admin";
// import USER from "@/app/api/user";
// import BOOKING from "@/app/api/booking";
// import ModalComponent from "@/components/commons/Modal";
// import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
// import { Controller } from "react-hook-form";
// import DropdownComponent from "@/components/inputs/Dropdown";
// import { WORKTYPES } from "@/constants";
// import { Ionicons } from "@expo/vector-icons";
// import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
// import AddBookingDetails from "./addBookingDetails";
// const { width } = Dimensions.get("window");

// interface ButtonContainerProps {
//   isLoading: boolean;
//   user: any;
//   refetch: any;
//   isUserBooked: boolean;
//   isUserLiked: boolean;
//   isUserRequestedToJoinTeam: boolean;
//   isInYourTeam: boolean;
//   isWorkerBookingRequested: boolean;
//   isWorkerBooked: boolean;
// }

// const ButtonContainer = ({
//   isLoading,
//   user,
//   refetch,
//   isUserBooked,
//   isUserLiked,
//   isUserRequestedToJoinTeam,
//   isInYourTeam,
//   isWorkerBookingRequested,
//   isWorkerBooked,
// }: ButtonContainerProps) => {
//   const userDetails = useAtomValue(Atoms?.UserAtom);
//   const { id } = useLocalSearchParams();
//   const { role, type } = useGlobalSearchParams();

//   const [isAddBookingModal, setIsAddBookingModal] = useState(false);

//   const mutationLikeWorker = useMutation({
//     mutationKey: ["likeWorker", { id }],
//     mutationFn: () => WORKER?.likeWorker({ workerID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("workerAddedToFavourites"));
//     },
//   });

//   const mutationUnLikeWorker = useMutation({
//     mutationKey: ["unlikeWorker", { id }],
//     mutationFn: () => WORKER?.unlikeWorker({ workerID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("workerRemovedFromFavourites"));
//     },
//   });

//   const mutationLikeMediator = useMutation({
//     mutationKey: ["likeMediator", { id }],
//     mutationFn: () => MEDIATOR?.likeMediator({ mediatorID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("mediatorAddedToFavourites"));
//     },
//   });

//   const mutationUnLikeMediator = useMutation({
//     mutationKey: ["unlikeMediator", { id }],
//     mutationFn: () => MEDIATOR?.unlikeMediator({ mediatorID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("mediatorRemovedFromFavourites"));
//     },
//   });

//   const mutationLikeEmployer = useMutation({
//     mutationKey: ["likeEmployer", { id }],
//     mutationFn: () => EMPLOYER?.likeEmployer({ employerID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("employerAddedToFavourites"));
//     },
//   });

//   const mutationUnLikeEmployer = useMutation({
//     mutationKey: ["unlikeEmployer", { id }],
//     mutationFn: () => EMPLOYER?.unlikeEmployer({ employerID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("employerRemovedFromFavourites"));
//     },
//   });

//   const mutationCancelBookingRequest = useMutation({
//     mutationKey: ["cancelBookingRequest"],
//     mutationFn: () => BOOKING?.cancelBookingRequest({ userId: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("bookingRequestCancelledSuccessfully"));
//     },
//   });

//   const mutationRemoveBookedWorker = useMutation({
//     mutationKey: ["removeBookedWorker", { id }],
//     mutationFn: () => BOOKING?.removeBookedWorker({ bookingID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("bookingCancelledWorker"));
//     },
//   });

//   const mutationBookMediator = useMutation({
//     mutationKey: ["bookMediator", { id }],
//     mutationFn: () => MEDIATOR?.bookMediator({ mediatorID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("workerBookedSuccessfully"));
//     },
//   });

//   const mutationRemoveBookedMediator = useMutation({
//     mutationKey: ["removeBookedMediator", { id }],
//     mutationFn: () => MEDIATOR?.removeBookedMediator({ mediatorID: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("mediatorBookingCancelled"));
//     },
//   });

//   const mutationSendRequest = useMutation({
//     mutationKey: ["sendRequest", { id }],
//     mutationFn: () => REQUEST?.sendJoiningRequest({ userId: id }),
//     onSuccess: (response) => {
//       refetch();
//       TOAST?.showToast?.success(t("requestSentSuccessfully"));
//     },
//     onError: (err) => {
//       console.error("error while sending request to worker ", err);
//     },
//   });

//   const mutationActivateUser = useMutation({
//     mutationKey: ["activateUser", { id }],
//     mutationFn: () => ADMIN?.activateUser({ userId: id }),
//     onSuccess: () => {
//       refetch();
//       TOAST?.showToast?.success(t("userActivated"));
//     },
//   });

//   const mutationSuspendUser = useMutation({
//     mutationKey: ["suspendUser", { id }],
//     mutationFn: () => ADMIN?.suspendUser({ userId: id }),
//     onSuccess: () => {
//       refetch();
//       TOAST?.showToast?.success(t("userSuspended"));
//     },
//   });

//   const mutationCancelRequest = useMutation({
//     mutationKey: ["cancelRequest"],
//     mutationFn: () => REQUEST?.cancelJoiningRequest({ userId: id }),
//     onSuccess: () => {
//       refetch();
//       TOAST?.showToast?.success(t("requestCancelledSuccessfully"));
//     },
//     onError: (err) => {
//       console.error("error while cancelling request to worker ", err);
//     },
//   });

//   const mutationRemoveMemberFromTeam = useMutation({
//     mutationKey: ["removeMemberFromTeam", { id }],
//     mutationFn: () => MEDIATOR?.removeMemberFromTeam({ memberID: id }),
//     onSuccess: () => {
//       refetch();
//       TOAST?.showToast?.success(t("successfullyLeftFromTeam"));
//     },
//     onError: (err) => {
//       console.error("error while leaving from team ", err);
//     },
//   });

//   // const mutationDeleteUser = useMutation({
//   //   mutationKey: ["deleteUser", { id }],
//   //   mutationFn: () => deleteUserById(id),
//   //   onSuccess: () => {
//   //     refetch();
//   //     TOAST?.showToast?.success(t("userDeleted"));
//   //   },
//   // });

//   const handleLikeFunction = () => {
//     mutationLikeEmployer?.mutate();
//   };

//   const handleUnLikeFunction = () => {
//     mutationUnLikeEmployer?.mutate();
//   };

//   return (
//     <>
//       <Loader
//         loading={
//           isLoading ||
//           mutationLikeWorker?.isPending ||
//           mutationUnLikeWorker?.isPending ||
//           mutationLikeMediator?.isPending ||
//           mutationUnLikeMediator?.isPending ||
//           mutationLikeEmployer?.isPending ||
//           mutationUnLikeEmployer?.isPending ||
//           mutationCancelBookingRequest?.isPending ||
//           mutationRemoveBookedWorker?.isPending ||
//           mutationBookMediator?.isPending ||
//           mutationRemoveBookedMediator?.isPending ||
//           mutationSendRequest?.isPending ||
//           mutationActivateUser?.isPending ||
//           mutationSuspendUser?.isPending ||
//           mutationCancelRequest?.isPending ||
//           mutationRemoveMemberFromTeam?.isPending
//         }
//       />
//       <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
//         {type === "applicant" && (
//           <Button
//             isPrimary={true}
//             title={isUserBooked ? t("selected") : t("select")}
//             onPress={() => {}}
//           />
//         )}

//         <Button
//           isPrimary={true}
//           bgColor={
//             isInYourTeam || isUserRequestedToJoinTeam ? Colors.danger : Colors.primary
//           }
//           borderColor={
//             isInYourTeam || isUserRequestedToJoinTeam ? Colors.danger : Colors.primary
//           }
//           style={styles?.footerFirstBtn}
//           title={
//             isInYourTeam
//               ? t("leaveFromTeam")
//               : isUserRequestedToJoinTeam
//               ? t("removeRequest")
//               : t("addInYourTeam")
//           }
//           onPress={() => {
//             if (isInYourTeam) {
//               mutationRemoveMemberFromTeam?.mutate();
//             } else if (isUserRequestedToJoinTeam) {
//               mutationCancelRequest?.mutate();
//             } else {
//               mutationSendRequest?.mutate();
//             }
//           }}
//         />

//         <Button
//           isPrimary={true}
//           bgColor={
//             isInYourTeam || isUserRequestedToJoinTeam ? Colors.danger : Colors.primary
//           }
//           title={
//             isWorkerBooked
//               ? t("cancelBooking")
//               : isWorkerBookingRequested
//               ? t("cancelBookingRequest")
//               : t("bookWorker")
//           }
//           onPress={() => {
//             if (isWorkerBooked) {
//               mutationRemoveBookedWorker?.mutate();
//             } else if (isWorkerBookingRequested) {
//               mutationCancelBookingRequest?.mutate();
//             } else {
//               setIsAddBookingModal(true);
//             }
//           }}
//         />

//         <Button
//           isPrimary={true}
//           title={isUserLiked ? t("unlike") : t("like")}
//           style={styles?.footerBtn}
//           onPress={() =>
//             isUserLiked ? handleUnLikeFunction() : handleLikeFunction()
//           }
//         />

//         {userDetails?.isAdmin && (
//           <Animated.View style={styles.adminActions}>
//             {user?.status === "ACTIVE" && (
//               <>
//                 <Button
//                   isPrimary={true}
//                   title={t("suspend")}
//                   onPress={() => mutationSuspendUser.mutate()}
//                   style={styles.adminButton}
//                 />
//                 <Button
//                   isPrimary={false}
//                   title={t("edit")}
//                   onPress={() => {
//                     /* Navigate to edit screen */
//                   }}
//                 />
//                 <Button
//                   isPrimary={true}
//                   title={t("delete")}
//                   onPress={() => {}}
//                   style={styles.deleteButton}
//                 />
//               </>
//             )}

//             {user?.status !== "ACTIVE" && (
//               <>
//                 <Button
//                   isPrimary={true}
//                   title={t("activate")}
//                   onPress={() => mutationActivateUser.mutate()}
//                   style={styles.activateButton}
//                 />
//                 <Button
//                   isPrimary={false}
//                   title={t("edit")}
//                   onPress={() => {}}
//                 />
//                 <Button
//                   isPrimary={true}
//                   title={t("delete")}
//                   onPress={() => {}}
//                   style={styles.deleteButton}
//                 />
//               </>
//             )}
//           </Animated.View>
//         )}
//       </Animated.View>

//       <AddBookingDetails
//         refetch={refetch}
//         id={id}
//         role={user?.role}
//         isAddBookingModal={isAddBookingModal}
//         setIsAddBookingModal={setIsAddBookingModal}
//       />
//     </>
//   );
// };

// export default ButtonContainer;

// const styles = StyleSheet.create({
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//     position: "absolute",
//     bottom: 0,
//     padding: 20,
//     paddingBottom: 30,
//     width: width,
//   },
//   footerBookBtn: {
//     flex: 2,
//     backgroundColor: Colors.primary,
//     marginRight: 20,
//     paddingHorizontal: 10,
//   },
//   footerBtnTxt: {
//     color: Colors.white,
//     fontSize: 16,
//     fontWeight: "600",
//     textTransform: "uppercase",
//   },
//   footerAddRequestBtn: {
//     flex: 2,
//     backgroundColor: Colors.primary,
//     marginRight: 10,
//     paddingHorizontal: 10,
//   },
//   selectBtn: {
//     width: "48%",
//     backgroundColor: Colors?.secondaryText,
//     borderColor: Colors?.secondaryText,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//   },
//   bookBtn: {
//     width: "48%",
//     backgroundColor: Colors?.primary,
//     borderColor: Colors?.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//   },
//   adminActions: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 10,
//     width: "100%",
//     justifyContent: "space-between",
//   },
//   activateButton: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: Colors.success,
//     borderColor: Colors.success,
//   },
//   adminButton: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: Colors.primary,
//   },
//   deleteButton: {
//     backgroundColor: Colors.danger,
//     borderColor: Colors.danger,
//   },
//   modalContent: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//   },
//   footerFirstBtn: {
//     width: "50%",
//   },
//   footerBtn: {
//     width: "25%",
//     backgroundColor: Colors.tertiery,
//     borderColor: Colors.tertiery,
//     alignItems: "center",
//   },
// });
