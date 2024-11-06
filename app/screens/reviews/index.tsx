import React from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";

const reviews = [
  {
    id: "1",
    name: "Haylie Aminoff",
    timeAgo: "32 minutes ago",
    rating: 4.5,
    reviewText:
      "Lorem ipsum dolor sit amet, consectetur sadi sspcsing elit, sed diam nonumy",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Carla Septimus",
    timeAgo: "54 minutes ago",
    rating: 4.5,
    reviewText:
      "Lorem ipsum dolor sit amet, consectetur sadi sspcsing elit, sed diam nonumy",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Carla George",
    timeAgo: "2 days ago",
    rating: 3.2,
    reviewText:
      "Lorem ipsum dolor sit amet, consectetur sadi sspcsing elit, sed diam nonumy",
    imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "Maren Kenter",
    timeAgo: "3 months ago",
    rating: 2.1,
    reviewText:
      "Lorem ipsum dolor sit amet, consectetur sadi sspcsing elit, sed diam nonumy",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

const StarRating = ({ rating }: any) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starsContainer}>
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesome
          key={`full-${index}`}
          name="star"
          size={18}
          color="#FFD700"
        />
      ))}
      {halfStar && (
        <FontAwesome name="star-half-full" size={18} color="#FFD700" />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesome
          key={`empty-${index}`}
          name="star-o"
          size={18}
          color="#FFD700"
        />
      ))}
    </View>
  );
};

const ReviewScreen = () => {
  const renderReview = ({ item }: any) => (
    <View style={styles.reviewCard}>
      <View style={styles.profileSection}>
        <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <CustomHeading>{item.name}</CustomHeading>
          <CustomText textAlign="left">{item.timeAgo}</CustomText>
        </View>
      </View>
      <View style={styles.ratingSection}>
        <CustomHeading>{item.rating}</CustomHeading>
        <StarRating rating={item.rating} />
      </View>
      <CustomText textAlign="left">{item.reviewText}</CustomText>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Reviews" left="back" />,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeAgo: {
    fontSize: 12,
    color: "#888",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewText: {
    fontSize: 14,
    color: "#666",
  },
});

export default ReviewScreen;
