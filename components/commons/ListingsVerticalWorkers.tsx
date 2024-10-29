import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import coverImage from "../../assets/images/placeholder-cover.jpg";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import SkillSelector from "./SkillSelector";

const ListingsVerticalWorkers = ({
  type,
  availableInterest,
  listings,
  loadMore,
  isFetchingNextPage,
  refreshControl,
}: any) => {
  const RenderItem = React.memo(({ item }: any) => {
    return (
      <View style={styles.container}>
        <Link href={`/screens/${type}/${item?._id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              {/* Profile Image */}
              <Image
                source={
                  item?.coverImage || item?.profilePicture
                    ? { uri: item?.coverImage || item?.profilePicture }
                    : coverImage
                }
                style={styles.image}
              />
              {item && item?.isBookmarked && (
                <View style={styles.liked}>
                  <Ionicons name="heart" size={16} color={Colors.white} />
                </View>
              )}

              <View style={styles.itemInfo}>
                <View>
                  <SkillSelector
                    canAddSkills={false}
                    isShowLabel={false}
                    style={styles?.skillsContainer}
                    tagStyle={styles?.skillTag}
                    tagTextStyle={styles?.skillTagText}
                    userSkills={item?.skills}
                    availableSkills={availableInterest}
                    count={5}
                  />

                  <Text style={styles.itemName}>
                    {item?.firstName} {item?.middleName} {item?.lastName}
                  </Text>

                  <Text style={styles.itemAddress}>{item?.address}</Text>
                </View>
                <View style={styles.ratingPriceContainer}>
                  <RatingAndReviews
                    rating={item?.rating || 4.5}
                    reviews={item?.reviews || 400}
                  />
                  <View style={styles.priceContainer}>
                    <Text style={styles.itemPrice}>
                      <FontAwesome name="rupee" size={14} />{" "}
                      {item?.price || "350"}/Day
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    );
  });

  return (
    <View style={{ marginBottom: 110 }}>
      <FlatList
        data={listings ?? []}
        renderItem={({ item }) => <RenderItem item={item} />}
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
          length: 200,
          offset: 200 * index,
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

export default ListingsVerticalWorkers;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
    marginBottom: 10
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
    paddingVertical: 0
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 0,
    marginBottom: 5
  },
  skillTagText: {
    fontSize: 12,
    color: Colors.primary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  itemAddress: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fa6400",
    marginRight: 5,
  },
  itemValue: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: "600",
  },
  itemReviews: {
    fontSize: 14,
    color: "#999",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  loaderStyle: {
    alignItems: "center",
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
