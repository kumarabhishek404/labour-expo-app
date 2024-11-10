import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import profileImage from "../../assets/images/placeholder-person.jpg";
import { Link, router } from "expo-router";
import { debounce } from "lodash";
import RatingAndReviews from "./RatingAndReviews";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";

type RenderItemTypes = {
  item: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    coverImage: string;
    location: any;
    profilePicture: string;
    skills: string[];
    rating: string;
    reviews: string;
    price: string;
    isBookmarked: boolean;
  };
  index: number;
};

const GroupWorkersListing = ({
  listings,
  category,
  loadMore,
  isFetchingNextPage,
}: {
  listings: any[];
  category: string;
  loadMore: any;
  isFetchingNextPage: boolean;
}) => {
  const RenderItem: any = React.memo(({ item, index }: RenderItemTypes) => {
    const isLastItem = index === listings.length - 1;

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `/screens/users/${item?._id}`,
            params: { role: "workers", title: t("workerDetails"), type: "all" },
          })
        }
        style={styles?.container}
      >
        <View style={[styles.item, isLastItem && styles.lastElement]}>
          <Image
            source={
              item?.profilePicture
                ? { uri: item?.profilePicture }
                : profileImage
            }
            style={styles.image}
          />
          <View>
            <CustomHeading textAlign="left" fontSize={14}>
              {item.firstName} {item.lastName}
            </CustomHeading>
            <RatingAndReviews
              rating={item?.rating || 4.5}
              reviews={item?.reviews || 400}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderItem = ({ item, index }: RenderItemTypes) => (
    <RenderItem item={item} index={index} />
  );

  return (
    <View style={{ marginTop: 20 }}>
      <CustomHeading textAlign="left">Top Rated Workers</CustomHeading>
      <View style={styles.divider}></View>
      <FlatList
        data={listings ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        onEndReached={debounce(loadMore, 300)} // Trigger load more when user scrolls to bottom
        onEndReachedThreshold={0.9}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size="large"
                style={styles.loaderStyle}
                color={Colors?.primary}
              />
            </View>
          ) : null
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />
    </View>
  );
};

export default GroupWorkersListing;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginRight: 20,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 16,
    color: "#1F3E72",
    fontWeight: "600",
    // marginBottom: 8,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
    marginBottom: 20,
  },
  item: {
    // padding: 10,
    // marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  lastElement: {
    marginRight: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    // marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
    color: "#999",
  },
  loaderStyle: {
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  footerLoader: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    // height: 250, // Adjust to match the size of your list items
  },
});
