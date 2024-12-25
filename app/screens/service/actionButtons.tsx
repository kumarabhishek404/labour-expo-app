import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useMemo } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { SlideInDown } from "react-native-reanimated";
import EmptyDatePlaceholder from "@/components/commons/EmptyDataPlaceholder";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/app/hooks/toast";
import {
  applyService,
  cancelServiceByMediatorAfterSelection,
  cancelServiceByWorkerAfterSelection,
  completeService,
  deleteServiceById,
  likeService,
  mediatorApplyService,
  mediatorUnApplyService,
  restoreService,
  unApplyService,
  unLikeService,
} from "@/app/api/services";
import Loader from "@/components/commons/Loader";
import ModalComponent from "@/components/commons/Modal";
import CustomHeading from "@/components/commons/CustomHeading";
import { debounce } from "lodash";
import CustomText from "@/components/commons/CustomText";
import ProfilePicture from "@/components/commons/ProfilePicture";
import CustomCheckbox from "@/components/commons/CustomCheckbox";
import { router } from "expo-router";

interface ServiceActionButtonsProps {
  service: any;
  members: any;
  userDetails: any;
  isAdmin: boolean;
  isSelected: boolean;
  isServiceApplied: boolean;
  isServiceLiked: boolean;
  id: string;
  refetch: () => void;
  refreshUser: () => void;
  selectedWorkersIds: string[];
  setSelectedWorkersIds: (ids: string[]) => void;
  setIsWorkerSelectModal: (modal: boolean) => void;
  setModalVisible: (modal: boolean) => void;
  setIsCompleteModalVisible: (modal: boolean) => void;
  hasMemberNextPage: boolean;
  isMemberFetchingNextPage: boolean;
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
  userDetails,
  isAdmin,
  isSelected,
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
  isMemberFetchingNextPage,
  memberFetchPage,
  setAddService,
  isCompleteModalVisible,
  modalVisible,
  isWorkerSelectModal,
}: ServiceActionButtonsProps) => {
  const mutationLikeService = useMutation({
    mutationKey: ["likeService", { id }],
    mutationFn: () => likeService({ serviceId: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("serviceAddedInFavourites"));
      console.log("Response while liking a service - ", response);
    },
    onError: (err) => {
      console.error("error while liking the service ", err);
    },
  });

  const mutationUnLikeService = useMutation({
    mutationKey: ["unlikeService", { id }],
    mutationFn: () => unLikeService({ serviceId: id }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("serviceRemovedInFavourites"));
      console.log("Response while unliking a service - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the service ", err);
    },
  });

  const mutationApplyService = useMutation({
    mutationKey: ["applyService", { id }],
    mutationFn: () => applyService({ serviceID: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      toast.success(t("serviceAppliedSuccessfully"));
      console.log("Response while applying in the service - ", response);
    },
    onError: (err: any) => {
      toast.error(
        `Error while applying in the service - ${err?.response?.data?.message}`
      );
      console.error("error while applying in the service ", err);
    },
  });

  const mutationUnApplyService = useMutation({
    mutationKey: ["unapplyService", { id }],
    mutationFn: () => unApplyService({ serviceID: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      setSelectedWorkersIds([]);
      toast.success(t("yourApplicationCancelledSuccessfully"));
      console.log("Response while unapplying the service - ", response);
    },
    onError: (err: any) => {
      toast.error(
        `Error while cancelling your application in the service - ${err?.response?.data?.message}`
      );
      console.error("error while unapplying the service ", err);
    },
  });

  const mutationMediatorApplyService = useMutation({
    mutationKey: ["mediatorApplyService", { id }],
    mutationFn: () =>
      mediatorApplyService({ serviceId: id, workers: selectedWorkersIds }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      setIsWorkerSelectModal(false);
      toast.success(t("serviceAppliedSuccessfully"));
      console.log("Response while applying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationMediatorUnApplyService = useMutation({
    mutationKey: ["mediatorUnApplyService", { id }],
    mutationFn: () => mediatorUnApplyService({ serviceId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      setIsWorkerSelectModal(false);
      toast.success(t("yourApplicationCancelledSuccessfully"));
      console.log("Response while unapplying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationCancelServiceByWorkerAfterSelection = useMutation({
    mutationKey: ["cancelServiceByWorkerAfterSelection", { id }],
    mutationFn: () => cancelServiceByWorkerAfterSelection({ serviceId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      toast.success(t("yourSelectionCancelledSuccessfully"));
      console.log("Response while unapplying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationCancelServiceByMediatorAfterSelection = useMutation({
    mutationKey: ["cancelServiceByMediatorAfterSelection", { id }],
    mutationFn: () => cancelServiceByMediatorAfterSelection({ serviceId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      toast.success(t("yourSelectionCancelledSuccessfully"));
      console.log("Response while unapplying in the service - ", response);
    },
    onError: (err) => {
      console.error("error while applying in the service ", err);
    },
  });

  const mutationCompleteService = useMutation({
    mutationKey: ["completeService", { id }],
    mutationFn: () => completeService({ serviceID: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      toast.success(t("serviceCompletedSuccessfully"));
      console.log("Response while completing a service - ", response);
    },
    onError: (err) => {
      console.error("error while completing the service ", err);
    },
  });

  const mutationDeleteService = useMutation({
    mutationKey: ["deleteService", { id }],
    mutationFn: () => deleteServiceById(id),
    onSuccess: async (response) => {
      setModalVisible(false);
      await refetch();
      await refreshUser();
      console.log("Response while deleting a service - ", response);
    },
    onError: (err) => {
      console.error("error while deleting a service ", err);
    },
  });

  const mutationRestoreService = useMutation({
    mutationKey: ["restoreService", { id }],
    mutationFn: () => restoreService({ serviceId: id }),
    onSuccess: async (response) => {
      await refetch();
      await refreshUser();
      toast.success(t("serviceRestoredSuccessfully"));
      console.log("Response while restoring a service - ", response);
    },
  });

  const handleDelete = () => {
    mutationDeleteService.mutate();
  };

  const handleApply = () => {
    if (userDetails?.role === "MEDIATOR") {
      setIsWorkerSelectModal(true);
    } else {
      mutationApplyService.mutate();
    }
  };

  const handleCancelApply = () => {
    if (userDetails?.role === "MEDIATOR") {
      setIsWorkerSelectModal(true);
    } else {
      mutationUnApplyService.mutate();
    }
  };

  const renderButtons = () => {
    if (!service) return null;

    switch (true) {
      case service.status === "CANCELLED" &&
        service.employer?._id === userDetails?._id:
        return (
          <Button
            isPrimary={false}
            title={t("restoreService")}
            onPress={mutationRestoreService.mutate}
            style={styles.footerBtn}
            bgColor={Colors?.tertiery}
            textStyle={{ color: Colors?.white }}
          />
        );

      case service.employer?._id !== userDetails?._id &&
        !isAdmin &&
        service.status === "HIRING":
        return (
          <>
            {isSelected ? (
              <Button
                isPrimary={true}
                title={t("removeFromService")}
                onPress={mutationCancelServiceByWorkerAfterSelection.mutate}
              />
            ) : (
              <Button
                isPrimary={true}
                title={isServiceApplied ? t("cancelApply") : t("applyNow")}
                onPress={isServiceApplied ? handleCancelApply : handleApply}
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
              textStyle={{ color: Colors?.white }}
            />
          </>
        );

      case service.employer?._id === userDetails?._id &&
        service.status !== "CANCELLED":
        return (
          <>
            <Button
              isPrimary={true}
              title={t("deleteService")}
              onPress={mutationDeleteService.mutate}
              style={styles.deleteBtn}
            />
            {service?.appliedWorkers?.length > 0 ? (
              <Button
                isPrimary={false}
                title={t("completeService")}
                onPress={mutationCompleteService.mutate}
                style={styles.completeBtn}
                textStyle={{ color: Colors?.white }}
              />
            ) : (
              <Button
                isPrimary={false}
                title={t("edit")}
                onPress={() => {
                  router.push("/(tabs)/addService/");
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
              onPress={mutationDeleteService.mutate}
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
            <CustomHeading fontSize={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading fontSize={14}>{t("wantToDeleteService")}</CustomHeading>
        <CustomText>{t("irreversibleAction")}</CustomText>
      </View>
    );
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedWorkersIds((prev: any) =>
      prev.includes(userId)
        ? prev.filter((id: string) => id !== userId)
        : [...prev, userId]
    );
  };

  const RenderMemberItem = ({ item }: any) => {
    return (
      <View style={[styles.userItem]} key={item?._id}>
        <CustomCheckbox
          disabled={!!isServiceApplied}
          isChecked={selectedWorkersIds?.includes(item?._id)}
          onToggle={() => toggleUserSelection(item?._id)}
          containerStyle={{ marginRight: 8 }}
        />
        <ProfilePicture uri={item?.profilePicture} />
        <View style={styles.userInfo}>
          <CustomText style={styles.userName} textAlign="left">
            {item?.firstName} {item?.lastName}
          </CustomText>
          <CustomText style={styles.userSkills} textAlign="left">
            {t("skills")}: {item?.skills?.join(", ")}
          </CustomText>
          <CustomText style={styles.userAddress} textAlign="left">
            {item?.address}
          </CustomText>
        </View>
      </View>
    );
  };

  const memoizedData = useMemo(
    () => members?.flatMap((data: any) => data),
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
        {memoizedData && memoizedData?.length > 0 ? (
          <FlatList
            data={memoizedData ?? []}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id?.toString()}
            onEndReached={debounce(loadMore, 300)}
            onEndReachedThreshold={0.9}
            ListFooterComponent={() =>
              isMemberFetchingNextPage ? (
                <ActivityIndicator
                  size="large"
                  color={Colors?.primary}
                  style={styles.loaderStyle}
                />
              ) : null
            }
            getItemLayout={(data, index) => ({
              length: 200,
              offset: 200 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={3}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyDatePlaceholder title="Members" />
        )}
      </View>
    );
  };

  const completeServiceModalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={26}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading>{t("areYouSure")}</CustomHeading>
        <CustomHeading fontSize={14}>
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
          mutationMediatorApplyService?.isPending ||
          mutationUnApplyService?.isPending ||
          mutationMediatorUnApplyService?.isPending ||
          mutationCompleteService?.isPending ||
          mutationDeleteService?.isPending ||
          mutationCancelServiceByWorkerAfterSelection?.isPending ||
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
          disabled: selectedWorkersIds?.length === 0,
          title: isServiceApplied ? t("cancelApply") : t("applyNow"),
          styles: {
            backgroundColor: "red",
            borderColor: "red",
          },
          action: isServiceApplied
            ? mutationMediatorUnApplyService?.mutate
            : mutationMediatorApplyService?.mutate,
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setIsWorkerSelectModal(false),
        }}
      />
    </>
  );
};

export default ServiceActionButtons;

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
    flex: 1,
    backgroundColor: Colors.black,
    borderColor: Colors.black,
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
    width: "48%",
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
    padding: 20,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    // padding: 20,
    // width: "90%",
    // maxHeight: "80%",
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
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});
