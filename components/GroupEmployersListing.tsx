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
import React from "react";
import { GroupType } from "@/types/groupType";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import profileImage from "../assets/images/placeholder-person.jpg";
import { Link } from "expo-router";
import { debounce } from "lodash";

type RenderItemTypes = {
  item: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    coverImage: string;
    location: any;
    profileImage: string;
    skills: string[];
    rating: string;
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
      <Link href={`/screens/employer/${item?._id}`} asChild>
        <TouchableOpacity>
          <View style={[styles.item, isLastItem && styles.lastElement]}>
            <Image
              source={
                item?.profileImage ? { uri: item?.profileImage } : profileImage
              }
              style={styles.image}
            />
            <View>
              <Text style={styles.itemTxt}>
                {item.firstName} {item.lastName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="star" size={20} color={Colors.primary} />
                <Text style={styles.itemRating}>{item.rating || "4.6"} </Text>
                <Text style={styles.itemReviews}>
                  ({item.reviews || "450"})
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  });

  const renderItem = ({ item, index }: RenderItemTypes) => (
    <RenderItem item={item} index={index} />
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.title}>Top Rated Employers</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  lastElement: {
    marginRight: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
    marginLeft: 5,
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
