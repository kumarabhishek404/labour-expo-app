import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Atoms, { mobileNumberAtom } from "@/app/AtomStore";
import BOOKINGS from "@/app/api/booking";
import ListingsServicesPlaceholder from "@/components/commons/LoadingPlaceholders/ListingServicePlaceholder";
import CustomHeading from "@/components/commons/CustomHeading";
import Colors from "@/constants/Colors";
import ButtonComp from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";

const Bookings = () => {
  const mobileNumber = useAtomValue(mobileNumberAtom);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["userBookings", mobileNumber],
    queryFn: async () => {
      if (!mobileNumber) throw new Error("Mobile number is required");
      const response = await BOOKINGS.fetchBookingsByMobile(mobileNumber);
      return response;
    },
    enabled: !!mobileNumber,
  });

  console.log("[Bookings] Fetched bookings data:", data?.data);

  const renderBookingItem = ({ item }: any) => (
    <View style={styles.card}>
      {item.bookingDetails?.serviceTitle && (
        <Text style={styles.title}>{item.bookingDetails.serviceTitle}</Text>
      )}
      {item.bookingDetails?.serviceDescription && (
        <Text style={styles.description}>
          {item.bookingDetails.serviceDescription}
        </Text>
      )}
      {(item.bookingDetails?.price || item.bookingDetails?.estimateTime) && (
        <Text style={styles.meta}>
          {item.bookingDetails?.price ? `₹${item.bookingDetails.price}` : ""}
          {item.bookingDetails?.price && item.bookingDetails?.estimateTime
            ? " • "
            : ""}
          {item.bookingDetails?.estimateTime || ""}
        </Text>
      )}
      <View style={styles.separator} />
      <Text style={styles.userInfo}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <CustomHeading baseFont={24} textAlign="left" color={Colors?.white}>
          {t("myBookings")}
        </CustomHeading>
      </View>

      {isLoading ? (
        <ListingsServicesPlaceholder />
      ) : data?.data?.length > 0 ? (
        <FlatList
          data={data?.data || []}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.empty}>
            <CustomText baseFont={24} fontWeight="600" style={styles.emptyText}>{t("noBookingsFound")}</CustomText>
            <ButtonComp isPrimary title={t("exploreServices")} onPress={() => router?.push("/")} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors?.primary,
    padding: 15,
  },
  card: {
    backgroundColor: "#f2f2f2",
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  userInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  empty: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    marginBottom: 10,
  }
});

export default Bookings;
