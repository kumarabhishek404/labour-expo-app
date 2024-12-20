import { StyleSheet, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import CustomText from "./CustomText";

interface RatingAndReviewsProps {
  rating: any;
  reviews: any;
}

const RatingAndReviews = ({ rating, reviews }: RatingAndReviewsProps) => {
  return (
    <View>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <FontAwesome
            key={index}
            name="star"
            size={12}
            color={index < Math.floor(rating || 0) ? "#FFA41C" : "#E0E0E0"}
          />
        ))}
        <CustomText style={styles?.reviews}>
          ({reviews >= 50 ? "50+" : reviews || 0})
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviews: {
    marginLeft: 4,
  },
});

export default RatingAndReviews;
