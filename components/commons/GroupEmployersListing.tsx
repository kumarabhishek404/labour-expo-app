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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import profileImage from "../../assets/images/placeholder-person.jpg";
import { Link, router } from "expo-router";
import { debounce } from "lodash";
import CustomHeading from "./CustomHeading";
import RatingAndReviews from "./RatingAndReviews";
import CustomText from "./CustomText";
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
    rating: {
      average: number;
      count: number;
    };
    reviews: string;
    price: string;
    isBookmarked: boolean;
  };
  index: number;
};

const GroupEmployersListing = ({
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
            pathname: "/screens/users/[id]",
            params: {
              id: item?._id,
              role: "employers",
              title: "Employer Details",
              type: "top",
            },
          })
        }
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
            <CustomHeading textAlign="left">
              {item.firstName} {item.lastName}
            </CustomHeading>
            <RatingAndReviews
              rating={item?.rating?.average}
              reviews={item?.rating?.count}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="hammer-sickle"
                size={20}
                style={{ marginRight: 5 }}
                color={Colors.primary}
              />
              <CustomHeading fontSize={14}>
                {`${30} ${t("services")}`}{" "}
              </CustomHeading>
              <CustomText>{`${10} ${t("active")}`}</CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  RenderItem.displayName = "RenderItem";
  const renderItem = ({ item, index }: RenderItemTypes) => (
    <RenderItem item={item} index={index} />
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <CustomHeading textAlign="left">{t("topRatedEmployers")}</CustomHeading>
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

export default GroupEmployersListing;

const styles = StyleSheet.create({
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
    marginBottom: 20,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "flex-start",
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
