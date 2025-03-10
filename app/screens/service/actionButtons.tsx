import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import Animated, { SlideInDown } from "react-native-reanimated";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "@/components/commons/Loaders/Loader";
import ModalComponent from "@/components/commons/Modal";
import CustomHeading from "@/components/commons/CustomHeading";
import { debounce } from "lodash";
import CustomText from "@/components/commons/CustomText";
import ProfilePicture from "@/components/commons/ProfilePicture";
import CustomCheckbox from "@/components/commons/CustomCheckbox";
import { router } from "expo-router";
import USER from "@/app/api/user";
import WORKER from "@/app/api/workers";
import EMPLOYER from "@/app/api/employer";
import { useAtom, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import AddSkillDrawer from "@/components/commons/AddSkillModal";

interface ServiceActionButtonsProps {
  service: any;
  members: any;
  isMemberLoading: boolean;
  isMemberFetchingNextPage: boolean;
  userDetails: any;
  isAdmin: boolean;
  isSelected: boolean;
  isWorkerBooked: boolean;
  isServiceApplied: boolean;
  isServiceLiked: boolean;
  id: string;
  refetch: () => void;
  refreshUser: () => void;
  selectedWorkersIds: string[];
  setSelectedWorkersIds: any;
  setIsWorkerSelectModal: (modal: boolean) => void;
  setModalVisible: (modal: boolean) => void;
  setIsCompleteModalVisible: (modal: boolean) => void;
  hasMemberNextPage: boolean;
  memberFetchPage: () => void;
  setAddService: (service: any) => void;
  isCompleteModalVisible: boolean;
  modalVisible: boolean;
  isWorkerSelectModal: boolean;
}

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ServiceActionButtons = ({
  service,
  members,
  isMemberLoading,
  isMemberFetchingNextPage,
  isAdmin,
  isSelected,
  isWorkerBooked,
  isServiceApplied,
  isServiceLiked,
  id,
  refetch,
  refreshUser,
  selectedWorkersIds,
  setSelectedWorkersIds,
  setIsWorkerSelectModal,
  setModalVisible,
  setIsCompleteModalVisible,
  hasMemberNextPage,
  memberFetchPage,
  setAddService,
  isCompleteModalVisible,
  modalVisible,
  isWorkerSelectModal,
}: ServiceActionButtonsProps) => {
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [selectedWorkers, setSelectedWorkers] = useState(selectedWorkersIds);
  const [isAddSkill, setIsAddSkill] = useState(false);

  const hasUsersAppliedOrSelected =
    service?.appliedUsers?.some((user: any) => user.status === "PENDING") ||
    service?.selectedUsers?.some((user: any) => user.status === "SELECTED");

  useEffect(() => {
    setSelectedWorkers(selectedWorkersIds);
  }, [selectedWorkersIds]);

  const mutationLikeService = useMutation({
    mutationKey: ["likeService", { id }],
    mutationFn: () => USER?.likeService({ serviceId: id }),
    onSuccess: (response) => {
      refetch();
      TOAST?.success(t("serviceAddedInFavourites"));
      console.log("Response while liking a service - ", response);
    },
    onError: (err) => {
      console.error("error while liking the service ", err);
    },
  });

  const mutationUnLikeService = useMutation({
    mutationKey: ["unlikeService", { id }],
    mutationFn: () => USER?.unLikeService({ serviceId: id }),
    onSuccess: (response) => {
      refetch();
      TOAST?.success(t("serviceRemovedInFavourites"));
      console.log("Response while unliking a service - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the service ", err);
    },
  });

  const mutationApplyService = useMutation({
    mutationKey: ["applyService", { id }],
    mutationFn: (payload: any) => WORKER?.applyService(payload),
    onSuccess: async (response) => {
      setIsWorkerSelectModal(false);
      setSelectedWorkersIds([]);
      refetch();
      refreshUser();
      TOAST?.success(t("serviceAppliedSuccessfully"));
      console.log("Response while applying in the service - ", response);
    },
    onError: (err: any) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationUnApplyService = useMutation({
    mutationKey: ["unapplyService", { id }],
    mutationFn: () => WORKER?.unApplyService({ serviceId: id }),
    onSuccess: async (response) => {
      setIsWorkerSelectModal(false);
      setSelectedWorkersIds([]);
      refetch();
      refreshUser();
      TOAST?.success(t("yourApplicationCancelledSuccessfully"));
      console.log("Response while unapplying the service - ", response);
    },
    onError: (err: any) => {
      TOAST?.error(
        `Error while cancelling your application in the service - ${err?.response?.data?.message}`
      );
      console.error("error while unapplying the service ", err);
    },
  });

  const mutationCancelServiceByMediatorAfterSelection = useMutation({
    mutationKey: ["cancelServiceByMediatorAfterSelection", { id }],
    mutationFn: () => WORKER?.cancelBooking({ serviceId: id }),
    onSuccess: async (response) => {
      refetch();
      refreshUser();
      TOAST?.success(t("yourSelectionCancelledSuccessfully"));
      console.log("Response while unapplying in the service - ", response);
    },
    onError: (err) => {
      console.error(
        "error while cancelling the booking or remove selected from the service by mediator ",
        err
      );
    },
  });

  const mutationCompleteService = useMutation({
    mutationKey: ["completeService", { id }],
    mutationFn: () => EMPLOYER?.completeBooking({ serviceId: id }),
    onSuccess: async (response) => {
      refetch();
      refreshUser();
      TOAST?.success(t("serviceCompletedSuccessfully"));
      console.log("Response while completing a service - ", response);
    },
    onError: (err) => {
      console.error("error while completing the service ", err);
    },
  });

  const mutationCancelBookingByEmployer = useMutation({
    mutationKey: ["deleteService", { id }],
    mutationFn: () => WORKER?.cancelBooking({ serviceId: id }),
    onSuccess: async (response) => {
      setModalVisible(false);
      refetch();
      refreshUser();
      console.log("Response while deleting a service - ", response);
    },
    onError: (err) => {
      console.error("error while deleting a service ", err);
    },
  });

  const mutationRestoreService = useMutation({
    mutationKey: ["restoreService", { id }],
    mutationFn: () => EMPLOYER?.restoreService({ serviceId: id }),
    onSuccess: async (response) => {
      refetch();
      refreshUser();
      TOAST?.success(t("serviceRestoredSuccessfully"));
      console.log("Response while restoring a service - ", response);
    },
  });

  const handleDelete = () => {
    mutationCancelBookingByEmployer.mutate();
  };

  const handleApply = () => {
    if (userDetails?.skills && userDetails?.skills?.length === 0) {
      return setIsAddSkill(true);
    }
    if (members && members?.length > 0) setIsWorkerSelectModal(true);
    // for worker
    else mutationApplyService.mutate({ workers: [], serviceId: id });
  };

  const handleCancelApply = () => {
    if (members && members?.length > 0 && selectedWorkersIds?.length > 0)
      setIsWorkerSelectModal(true);
    // for worker
    else mutationUnApplyService.mutate();
  };

  const renderButtons = () => {
    if (!service) return null;

    switch (true) {
      // case service.status === "CANCELLED" &&
      //   service.employer === userDetails?._id:
      //   return (
      //     <Button
      //       isPrimary={false}
      //       title={t("restoreService")}
      //       onPress={mutationRestoreService.mutate}
      //       style={styles.restoreBtn}
      //       bgColor={Colors?.tertiery}
      //       borderColor={Colors?.tertiery}
      //       textStyle={{ color: Colors?.white }}
      //     />
      //   );

      case service.employer !== userDetails?._id &&
        !isAdmin &&
        service.status === "HIRING":
        return (
          <>
            {isSelected ? (
              <Button
                isPrimary={true}
                title={t("removeFromService")}
                bgColor={Colors?.danger}
                borderColor={Colors?.danger}
                style={{ flex: 1 }}
                onPress={mutationCancelServiceByMediatorAfterSelection.mutate}
              />
            ) : (
              <Button
                isPrimary={true}
                title={isServiceApplied ? t("cancelApply") : t("applyNow")}
                onPress={isServiceApplied ? handleCancelApply : handleApply}
                style={{ flex: 1 }}
                bgColor={isServiceApplied ? Colors?.danger : Colors?.primary}
                borderColor={
                  isServiceApplied ? Colors?.danger : Colors?.primary
                }
              />
            )}
            <Button
              isPrimary={false}
              title={isServiceLiked ? t("unlike") : t("like")}
              onPress={
                isServiceLiked
                  ? mutationUnLikeService.mutate
                  : mutationLikeService.mutate
              }
              style={styles.footerBtn}
              bgColor={isServiceLiked ? Colors?.danger : Colors?.primary}
              borderColor={isServiceLiked ? Colors?.danger : Colors?.primary}
              textStyle={{ color: Colors?.white }}
            />
          </>
        );

      case service.employer === userDetails?._id &&
        service.status !== "CANCELLED" &&
        service.status !== "COMPLETED":
        return (
          <>
            <Button
              isPrimary={true}
              title={t("deleteService")}
              onPress={mutationCancelBookingByEmployer.mutate}
              style={styles.deleteBtn}
            />
            {hasUsersAppliedOrSelected ? (
              <Button
                isPrimary={true}
                title={t("completeService")}
                onPress={mutationCompleteService.mutate}
                style={styles.completeBtn}
                textStyle={{ color: Colors?.white }}
              />
            ) : (
              <Button
                isPrimary={true}
                title={t("edit")}
                onPress={() => {
                  router.push("/(tabs)");
                  setAddService(service);
                }}
                style={styles.footerBtn}
                textStyle={{ color: Colors?.white }}
              />
            )}
          </>
        );

      case isAdmin:
        return (
          <>
            <Button
              isPrimary={true}
              title={t("deleteService")}
              onPress={mutationCancelBookingByEmployer.mutate}
              style={styles.deleteBtn}
            />
            <Button
              isPrimary={false}
              title={t("completeService")}
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

  const toggleUserSelection = (userId: string) => {
    setSelectedWorkersIds((prev: string[]) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const RenderMemberItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => toggleUserSelection(item?._id)}
        style={[styles.userItem]}
        key={item?._id}
        disabled={!!isServiceApplied}
      >
        <CustomCheckbox
          checkboxStyle={{ marginRight: 6 }}
          disabled={!!isServiceApplied}
          isChecked={selectedWorkers?.includes(item?._id)}
          onToggle={() => toggleUserSelection(item?._id)}
        />
        <ProfilePicture uri={item?.profilePicture} />
        <View style={styles.userInfo}>
          <CustomText style={styles.userName} textAlign="left">
            {item?.name}
          </CustomText>
          <CustomText style={styles.userSkills} textAlign="left">
            <CustomText fontWeight="bold">{t("skills")} : </CustomText>
            {[
              { pricePerDay: 300, skill: "brickLayer" },
              { pricePerDay: 300, skill: "brickLayer" },
            ].map(
              (skill: any) =>
                `${t(skill?.skill)} ${skill?.pricePerDay} / ${t("perDay")}, `
            )}
          </CustomText>
          <CustomText style={styles.userAddress} textAlign="left">
            {item?.address || t("addressNotFound")}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedData = useMemo(
    () => members && members?.flatMap((data: any) => data),
    [members]
  );

  const loadMore = () => {
    if (hasMemberNextPage && !isMemberFetchingNextPage) {
      memberFetchPage();
    }
  };

  RenderMemberItem.displayName = "RenderMemberItem";
  const renderItem = ({ item }: any) => <RenderMemberItem item={item} />;

  const mediatorModelContent = () => {
    return (
      <View style={styles.modalContent}>
        {memoizedData && memoizedData.length > 0 ? (
          <View style={{ paddingBottom: 110 }}>
            {memoizedData.map((item: any) => (
              <View key={item?._id?.toString()}>{renderItem({ item })}</View>
            ))}
            {isMemberFetchingNextPage && (
              <ActivityIndicator
                size="large"
                color={Colors?.primary}
                style={styles.loaderStyle}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            {isMemberLoading ? (
              <ActivityIndicator
                style={{ marginLeft: 10, paddingVertical: 60 }}
                color={Colors?.primary}
                animating={true}
              />
            ) : (
              <EmptyDatePlaceholder title="members" />
            )}
          </View>
        )}
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
          mutationLikeService?.isPending ||
          mutationUnLikeService?.isPending ||
          mutationApplyService?.isPending ||
          mutationUnApplyService?.isPending ||
          mutationCompleteService?.isPending ||
          mutationCancelBookingByEmployer?.isPending ||
          mutationCancelServiceByMediatorAfterSelection?.isPending
        }
      />
      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {renderButtons()}
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

      <ModalComponent
        title={isServiceApplied ? t("selectedWorkers") : t("selectWorkers")}
        visible={isWorkerSelectModal}
        content={mediatorModelContent}
        onClose={() => setIsWorkerSelectModal(false)}
        primaryButton={{
          title: isServiceApplied
            ? t("cancelApply")
            : selectedWorkersIds?.length > 0
            ? t("applyNowWithWorkers", { count: selectedWorkersIds?.length })
            : t("applyNowWithOutWorkers"),
          styles: {
            backgroundColor: Colors?.danger,
            borderColor: Colors?.danger,
          },
          action: isServiceApplied
            ? mutationUnApplyService?.mutate
            : () =>
                mutationApplyService?.mutate({
                  workers: selectedWorkers,
                  serviceId: id,
                }),
        }}
        secondaryButton={{
          title: t("cancel"),
          action: () => setIsWorkerSelectModal(false),
        }}
      />

      <AddSkillDrawer
        isDrawerVisible={isAddSkill}
        setIsDrawerVisible={setIsAddSkill}
      />
    </>
  );
};

export default ServiceActionButtons;

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
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
  priceInputContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
