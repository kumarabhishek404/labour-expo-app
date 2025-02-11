import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, router, useGlobalSearchParams } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import Button from "../inputs/Button";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

const ListingsVerticalBookings = ({
  availableInterest,
  listings,
  loadMore,
  isFetchingNextPage,
  onRemoveBookedWorker,
  refreshControl,
  type,
}: any) => {
  const RenderItem = ({
    item,
    onRemoveBookedWorker,
    onCompleteBooking,
  }: any) => {
    console.log("item--", item);
    const workersList =
      item?.selectedUsers?.length > 0
        ? item?.selectedUsers
        : [item?.bookedWorker ?? ""];
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/screens/bookings/[id]",
              params: {
                id: item?._id,
                title: `Booking Details`,
                data: JSON.stringify(item),
              },
            })
          }
        >
          <View style={styles.card}>
            {/* Status Badge */}
            <View style={[styles.statusBadge]}>
              <CustomText style={styles.statusText}>
                {item?.status.toUpperCase()}
              </CustomText>
            </View>

            {/* Booking Details */}
            <View style={styles.infoContainer}>
              <CustomHeading
                color={Colors?.primary}
                textAlign="left"
                baseFont={22}
              >
                {t(item?.type)} - {t(item?.subType)}
              </CustomHeading>
              <CustomText textAlign="left" baseFont={17} fontWeight="bold">
                📍 {item?.address}
              </CustomText>
              <CustomText textAlign="left" baseFont={17} fontWeight="bold">
                📅 Start Date: {item?.startDate.split("T")[0]}
              </CustomText>
              <CustomText textAlign="left" baseFont={17} fontWeight="bold">
                ⏳ Duration: {item?.duration} days
              </CustomText>
              <CustomText textAlign="left" baseFont={17} fontWeight="bold">
                🛠 Booking Type: {item?.bookingType}
              </CustomText>
            </View>

            {/* Worker Details */}
            <View style={styles.workerContainer}>
              {workersList.length > 0 ? (
                workersList.map((worker: any, index: number) => (
                  <View key={index} style={styles.workerCard}>
                    <Image
                      source={
                        worker?.profilePicture
                          ? { uri: worker?.profilePicture }
                          : coverImage
                      }
                      style={styles.workerImage}
                    />
                    <View style={styles.workerInfo}>
                      <CustomText style={styles.workerName}>
                        <CustomText color={Colors?.tertiery} fontWeight="bold">
                          ({worker?.role})
                        </CustomText>{" "}
                        {worker?.name}
                      </CustomText>
                      <CustomText>📞 {worker?.mobile}</CustomText>
                    </View>
                  </View>
                ))
              ) : (
                <CustomText style={styles.noWorkerText}>
                  No Workers Assigned
                </CustomText>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {workersList && workersList?.length <= 1 ? (
                <Button
                  isPrimary={false}
                  title={t("cancelBooking")}
                  onPress={() =>
                    onRemoveBookedWorker({
                      serviceId: item?._id,
                      userId: item?.bookedWorker?._id,
                    })
                  }
                  borderColor={Colors?.danger}
                  textColor={Colors?.danger}
                />
              ) : (
                <View></View>
              )}
              <Button
                isPrimary={true}
                title={t("markAsCompleted")}
                onPress={() => onCompleteBooking(item?.serviceId)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => (
    <RenderItem item={item} onRemoveBookedWorker={onRemoveBookedWorker} />
  );

  return (
    <View style={{ marginBottom: 110 }}>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)}
        onEndReachedThreshold={0.9}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={Colors?.primary}
              style={styles.loaderStyle}
            />
          ) : null
        }
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListingsVerticalBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: 80,
    minHeight: 100,
    maxHeight: 150,
    borderRadius: 8,
    marginRight: 15,
  },
  liked: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 20,
  },
  itemInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  skillsContainer: {
    paddingVertical: 0,
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 0,
    marginBottom: 5,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  hiring: { backgroundColor: "#FFA500" },
  completed: { backgroundColor: "#28A745" },
  cancelled: { backgroundColor: "#DC3545" },
  statusText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 10,
  },
  workerContainer: {
    backgroundColor: Colors?.fourth,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  workerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  workerInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  workerName: {
    fontWeight: "bold",
  },
  noWorkerText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
