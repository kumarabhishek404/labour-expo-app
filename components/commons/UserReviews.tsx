import React, { forwardRef, useEffect, useState } from "react";
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
import PAGINATION from "@/app/hooks/usePagination";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import RATING from "@/app/api/rating";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "@/utils/translationHelper";
import { getTimeAgo } from "@/constants/functions";
import CustomText from "./CustomText";
import { FontAwesome } from "@expo/vector-icons";
import Loader from "./Loaders/Loader";
import ProfilePicture from "./ProfilePicture";
import Colors from "@/constants/Colors";

type Review = {
  _id: string;
  userId: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
  reviewer: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  type: "Positive" | "Negative";
};

type UserReviewsProps = {
  onLayout?: (event: any) => void;
  workerId: string;
  setHasUserReviewed: (hasUserReviewed: boolean) => void;
};

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

const UserReviews = forwardRef(
  ({ setHasUserReviewed, onLayout, workerId }: UserReviewsProps, ref: any) => {
    const userDetails = useAtomValue(Atoms?.UserAtom);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"Positive" | "Negative">(
      "Positive"
    );
    const itemsPerPage = 2;

    const {
      data: reviews,
      isLoading,
      isRefetching,
      refetch,
    } = useQuery({
      queryKey: ["reviews", workerId],
      queryFn: () => RATING?.getAllReviews({ id: workerId }),
    });

    const sortReviews = (reviews: Review[]) => {
      return reviews.sort((a, b) => {
        if (a?.reviewer?._id === userDetails?._id) return -1;
        if (b?.reviewer?._id === userDetails?._id) return 1;
        return 0;
      });
    };

    useEffect(() => {
      if (reviews?.data && userDetails?._id) {
        const userReview = reviews?.data.find(
          (review: Review) => review?.reviewer?._id === userDetails._id
        );
        setHasUserReviewed(!!userReview);
      }
    }, [reviews?.data, userDetails?._id]);

    const filteredReviews = sortReviews(
      reviews?.data?.filter((review: any) => review) || []
    );

    const {
      currentPage,
      totalPages,
      paginatedItems: paginatedReviews,
      goToNextPage,
      goToPreviousPage,
      setCurrentPage,
    } = PAGINATION.usePagination(filteredReviews || [], {
      totalItems: filteredReviews?.length || 0,
      itemsPerPage,
    });

    const handleReviewAction = (review: Review) => {
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

    const mutationDeleteReview = useMutation({
      mutationKey: ["deleteReview", { id: workerId }],
      mutationFn: (reviewId: string) =>
        RATING?.deleteReview({
          id: workerId,
          reviewId,
        }),
      onSuccess: (response) => {
        TOAST?.showToast?.success(t("reviewDeletedSuccessfully"));
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["userDetails", workerId],
        });
        queryClient.invalidateQueries({
          queryKey: ["tops"],
        });
        console.log("Response while deleting review - ", response);
      },
      onError: (err) => {
        console.error("error while deleting review ", err);
      },
    });

    const renderReview = ({ item }: { item: any }) => (
      <View style={styles.reviewCard}>
        <ProfilePicture uri={item?.reviewer?.profilePicture} />
        <View style={styles.textContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={2}>
                {item?.reviewer?.name}
              </Text>
            </View>
            {item?.reviewer?._id === userDetails?._id && (
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
            )}
          </View>
          <Text style={styles.date}>{getTimeAgo(item?.createdAt)}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item?.rating}</Text>
            <StarRating rating={item?.rating} />
          </View>
          <CustomText textAlign="left" baseFont={14} fontWeight="600">
            {t(item?.ratingType)}
          </CustomText>
          <CustomText textAlign="left">{item?.comment}</CustomText>
        </View>
      </View>
    );

    const EmptyListComponent = () => (
      <View style={styles.emptyContainer}>
        <CustomText style={styles.emptyText}>{t("noReviews")}</CustomText>
      </View>
    );

    return (
      <View style={styles.container} ref={ref} onLayout={onLayout}>
        <Loader
          loading={isLoading || isRefetching || mutationDeleteReview.isPending}
        />
        <CustomHeading
          textAlign="left"
          baseFont={18}
          style={{ marginBottom: 10 }}
        >
          {t("reviews")}
        </CustomHeading>

        {reviews?.length > 0 && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Positive" && styles.activeTab]}
              onPress={() => {
                setActiveTab("Positive");
                setCurrentPage(1);
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
              style={[styles.tab, activeTab === "Negative" && styles.activeTab]}
              onPress={() => {
                setActiveTab("Negative");
                setCurrentPage(1);
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
        )}

        <FlatList
          scrollEnabled={false}
          data={paginatedReviews}
          keyExtractor={(item) => item._id.toString()}
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
    marginBottom: 10,
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
  starsContainer: {
    flexDirection: "row",
  },
  reviewCard: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
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
    flexWrap: "wrap",
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
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
    color: "#FFD700",
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
    alignItems: "flex-start",
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flexShrink: 0,
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
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.gray,
  },
});
