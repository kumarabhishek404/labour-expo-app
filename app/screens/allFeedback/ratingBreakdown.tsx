import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

const FeedbackRatingBreakdown = ({ feedbacks }: any) => {
  const [ratingBreakdown, setRatingBreakdown] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });
  const [overallRating, setOverallRating] = useState(0);

  useEffect(() => {
    if (feedbacks && feedbacks.length) {
      // Calculate overall rating
      const totalRatings = feedbacks.reduce(
        (acc: any, curr: any) => acc + curr.rating,
        0
      );
      setOverallRating(Number((totalRatings / feedbacks.length).toFixed(1)));
      calculateRatingBreakdown(feedbacks);
    }
  }, [feedbacks]);

  const calculateRatingBreakdown = (feedbackArray: any) => {
    const breakdown = { excellent: 0, good: 0, average: 0, poor: 0 };

    // Categorize feedbacks
    feedbackArray.forEach((feedback: any) => {
      if (feedback.rating >= 4) breakdown.excellent++;
      else if (feedback.rating === 3) breakdown.good++;
      else if (feedback.rating === 2) breakdown.average++;
      else breakdown.poor++;
    });

    setRatingBreakdown(breakdown);
  };

  const renderProgressBar = (progress: any) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );

  const totalFeedbacks = feedbacks?.length;

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

  return (
    <>
      <View style={styles.overallRatingContainer}>
        <CustomHeading style={styles.overallRating}>
          {overallRating}
        </CustomHeading>
        {renderStars(Number(overallRating))}
        <CustomText style={styles.reviewsText}>
          Based on {feedbacks.length} reviews
        </CustomText>
      </View>
      <View style={styles.ratingBreakdown}>
        <View style={styles.breakdownRow}>
          <CustomText style={styles.breakdownLabel}>Excellent</CustomText>
          {renderProgressBar(ratingBreakdown.excellent / totalFeedbacks || 0)}
        </View>
        <View style={styles.breakdownRow}>
          <CustomText style={styles.breakdownLabel}>Good</CustomText>
          {renderProgressBar(ratingBreakdown.good / totalFeedbacks || 0)}
        </View>
        <View style={styles.breakdownRow}>
          <CustomText style={styles.breakdownLabel}>Average</CustomText>
          {renderProgressBar(ratingBreakdown.average / totalFeedbacks || 0)}
        </View>
        <View style={styles.breakdownRow}>
          <CustomText style={styles.breakdownLabel}>Poor</CustomText>
          {renderProgressBar(ratingBreakdown.poor / totalFeedbacks || 0)}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overallRatingContainer: { alignItems: "center", marginVertical: 10 },
  overallRating: { fontSize: 40, fontWeight: "bold", color: "#4CAF50" },
  reviewsText: { fontSize: 14, color: "#757575" },
  ratingBreakdown: { marginVertical: 10 },
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
  star: { fontSize: 20, marginRight: 2 },
});

export default FeedbackRatingBreakdown;
