import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import CustomHeading from "./CustomHeading";
import PaginationControls from "./Pagination/PaginationControls";
import { usePagination } from "@/app/hooks/usePagination";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { toast } from "@/app/hooks/toast";
import { addReview, deleteReview } from "@/app/api/rating";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "@/utils/translationHelper";

type Review = {
  id: string;
  userId: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
  type: "Positive" | "Negative";
};

type UserReviewsProps = {
  onLayout?: (event: any) => void;
  workerId: string;
  reviews: Review[];
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (review: Review) => void;
};

const UserReviews = forwardRef(
  (
    {
      reviews,
      onEditReview,
      onDeleteReview,
      onLayout,
      workerId,
    }: UserReviewsProps,
    ref: any
  ) => {
    const userDetails = useAtomValue(UserAtom);
    const [activeTab, setActiveTab] = useState<"Positive" | "Negative">(
      "Positive"
    );
    const itemsPerPage = 2;

    const sortReviews = (reviews: Review[]) => {
      return reviews.sort((a, b) => {
        if (a.userId === userDetails?._id) return -1;
        if (b.userId === userDetails?._id) return 1;
        return 0;
      });
    };

    const filteredReviews = sortReviews(
      reviews?.filter((review) => review.type === activeTab) || []
    );

    const {
      currentPage,
      totalPages,
      paginatedItems: paginatedReviews,
      goToNextPage,
      goToPreviousPage,
      setCurrentPage,
    } = usePagination(filteredReviews || [], {
      totalItems: filteredReviews?.length || 0,
      itemsPerPage,
    });

    const handleReviewAction = (review: Review) => {
      console.log("Review -- ", review);
      router?.push({
        pathname: "/screens/reviews/addReview/[id]",
        params: {
          id: workerId,
          role: "workers",
          type: "edit",
          data: JSON.stringify(review),
        },
      });
    };

    const handleViewProfile = (review: Review) => {
      router?.push({
        pathname: "/screens/users/[id]",
        params: { id: review?.userId },
      });
    };

    const mutationDeleteReview = useMutation({
      mutationKey: ["deleteReview", { id: workerId }],
      mutationFn: (reviewId: string) =>
        deleteReview({
          id: workerId,
          reviewId,
        }),
      onSuccess: (response) => {
        toast.success(t("reviewDeletedSuccessfully"));
        router.back();
        console.log("Response while deleting review - ", response);
      },
      onError: (err) => {
        console.error("error while deleting review ", err);
      },
    });

    const renderReview = ({ item }: { item: Review }) => (
      <View style={styles.reviewCard}>
        <Image source={{ uri: item?.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.name}>{item?.name}</Text>
            {item.userId === userDetails?._id ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleReviewAction(item)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => mutationDeleteReview.mutate(item?.id)}
                >
                  <Text
                    style={[styles.actionButtonText, styles.deleteButtonText]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleViewProfile(item)}
                >
                  <Text style={styles.actionButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={styles.date}>{item?.date}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item?.rating.toFixed(1)}</Text>
            <Text style={styles.star}>⭐</Text>
          </View>
          <Text style={styles.comment}>{item?.comment}</Text>
        </View>
      </View>
    );

    const EmptyListComponent = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No {activeTab.toLowerCase()} reviews yet
        </Text>
      </View>
    );

    return (
      <View style={styles.container} ref={ref} onLayout={onLayout}>
        {reviews?.length > 0 && (
          <>
            <CustomHeading textAlign="left" fontSize={18}>
              Reviews
            </CustomHeading>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "Positive" && styles.activeTab,
                ]}
                onPress={() => {
                  setActiveTab("Positive");
                  setCurrentPage(1); // Reset to first page
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Positive" && styles.activeTabText,
                  ]}
                >
                  Positive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "Negative" && styles.activeTab,
                ]}
                onPress={() => {
                  setActiveTab("Negative");
                  setCurrentPage(1); // Reset to first page
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Negative" && styles.activeTabText,
                  ]}
                >
                  Negative
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <FlatList
          scrollEnabled={false}
          data={paginatedReviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyListComponent}
        />

        {filteredReviews?.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        )}
      </View>
    );
  }
);

UserReviews.displayName = "UserReviews";

export default UserReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 4,
    marginTop: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4A90E2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
  },
  reviewCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFA500",
  },
  star: {
    marginLeft: 4,
    fontSize: 14,
    color: "#FFA500",
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#4A90E2",
  },
  deleteButton: {
    backgroundColor: "#FF4444",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "white",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
