import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { WorkerType } from "@/types/type";
import { debounce } from "lodash";
import { getWorkLabel } from "@/constants/functions";

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
            color={index < Math.floor(rating || 4) ? "#FFA41C" : "#E0E0E0"}
          />
        ))}
        <Text style={styles.reviews}>
          ({reviews >= 50 ? "50+" : reviews || 23})
        </Text>
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
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
});

export default RatingAndReviews;
