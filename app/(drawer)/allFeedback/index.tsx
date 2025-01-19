import { fetchAllFeedbacks } from "@/app/api/admin";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Loader from "@/components/commons/Loader";
import ProfilePicture from "@/components/commons/ProfilePicture";
import { getTimeAgo } from "@/constants/functions";
import FeedbackRatingBreakdown from "@/app/(drawer)/allFeedback/ratingBreakdown";

const FeedbackScreen = () => {
  const [filteredFeedbacks, setFilteredFeedbacks]: any = useState([]);

  const {
    data: response,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: () => fetchAllFeedbacks(),
    refetchOnMount: true,
    retry: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      setFilteredFeedbacks(response?.data?.feedback || []);
    }, [response])
  );

  const renderStars = (rating: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={[styles.star, { color: i <= rating ? "#FFD700" : "#C0C0C0" }]}
        >
          ★
        </Text>
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  const renderFeedback = ({ item }: any) => (
    <View style={styles.feedbackCard}>
      <ProfilePicture
        uri={item?.sender?.profilePicture}
        style={styles.profileImage}
      />
      <View style={styles.feedbackDetails}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CustomText textAlign="left" style={styles.userName}>
            {item?.sender?.name}
          </CustomText>
          <CustomText textAlign="left" color="#757575" fontSize={12}>
            {getTimeAgo(item?.createdAt)}
          </CustomText>
        </View>
        {renderStars(item?.rating)}
        <CustomText textAlign="left" fontWeight="bold">
          {item?.feedbackType}
        </CustomText>
        <CustomText textAlign="left" fontSize={14}>
          {item?.description}
        </CustomText>
      </View>
    </View>
  );

  return (
    <>
      <Loader loading={isLoading || isRefetching} />
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Feedback" left="menu" right="notification" />
          ),
        }}
      />
      <View style={styles.container}>
        {filteredFeedbacks && (
          <FeedbackRatingBreakdown feedbacks={filteredFeedbacks} />
        )}

        <FlatList
          data={filteredFeedbacks || []}
          keyExtractor={(item: any) => item._id.toString()}
          renderItem={renderFeedback}
          style={styles.feedbackList}
          showsVerticalScrollIndicator={false}
        />
        {/* <Button
          isPrimary={true}
          title={t("writeAReview")}
          style={styles.buttonText}
          onPress={() => router?.back()}
        /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F5F5F5" },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  breakdownLabel: { flex: 1, fontSize: 14 },
  progressBarContainer: {
    flex: 3,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "#4CAF50" },
  feedbackList: { marginVertical: 10 },
  feedbackCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  feedbackDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold" },
  reviewButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  star: { fontSize: 20, marginRight: 2 },
});

export default FeedbackScreen;
