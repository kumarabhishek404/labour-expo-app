import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { useQuery } from "@tanstack/react-query";
import { getAllReviews } from "@/app/api/rating";
import { UserAtom } from "@/app/AtomStore/user";
import { useAtomValue } from "jotai";
import Loader from "@/components/commons/Loader";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";
import { getTimeAgo } from "@/constants/functions";
import EmptyPlaceholder from "@/assets/empty-placeholder.png";
import ProfilePicture from "@/components/commons/ProfilePicture";

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
  const userDetails = useAtomValue(UserAtom);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["reviews", userDetails?._id],
    queryFn: () => getAllReviews({ id: userDetails?._id }),
    enabled: !!userDetails?._id,
  });

  const RenderItem = React.memo(({ item }: any) => {
    return (
      <View key={item?._id} style={styles.reviewCard}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <ProfilePicture
              uri={item?.reviewer?.profilePicture}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <CustomHeading style={styles.userName}>
                {item?.reviewer?.firstName} {item?.reviewer?.lastName}
              </CustomHeading>
              <CustomText textAlign="left" fontSize={12}>
                {getTimeAgo(item?.createdAt)}
              </CustomText>
            </View>
          </View>
          <View style={styles.ratingSection}>
            <CustomHeading>{item?.rating}</CustomHeading>
            <StarRating rating={item?.rating} />
          </View>
        </View>

        <CustomText textAlign="left" fontWeight="bold" fontSize={14}>
          {t(item?.ratingType)}
        </CustomText>
        <CustomText textAlign="left">{item?.comment}</CustomText>
      </View>
    );
  });

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item }: any) => <RenderItem item={item} />;

  const memoizedData = useMemo(
    () => data?.data?.flatMap((data: any) => data),
    [data]
  );

  const stats = useMemo(() => {
    if (!memoizedData?.length) return { average: 0, total: 0 };
    const total = memoizedData.length;
    const sum = memoizedData.reduce(
      (acc: number, curr: any) => acc + curr.rating,
      0
    );
    return {
      average: Number((sum / total).toFixed(1)),
      total,
    };
  }, [memoizedData]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t("reviews")} left="back" />,
        }}
      />
      <Loader loading={isLoading || isRefetching} />
      <View style={styles.container}>
        {memoizedData?.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <CustomHeading fontSize={24}>{stats.average}</CustomHeading>
              <StarRating rating={stats.average} />
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <CustomHeading fontSize={24}>{stats.total}</CustomHeading>
              <CustomText>{t("totalReviews")}</CustomText>
            </View>
          </View>
        )}
        <FlatList
          data={memoizedData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={!isRefetching && refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image source={EmptyPlaceholder} style={styles.emptyImage} />
              <CustomText fontSize={16} fontWeight="bold">
                {t("noReviewsYet")}
              </CustomText>
            </View>
          )}
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    minHeight: 50,
  },
  profileImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    width: "100%",
    textAlign: "left",
  },
  timeAgo: {
    fontSize: 12,
    color: "#888",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    minWidth: 100,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    gap: 10,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 15,
  },
});

export default ReviewScreen;
